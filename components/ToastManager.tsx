import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import React, { Component } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";

import defaultProps from "../utils/defaultProps";
import { Colors } from "../config/theme";
import styles from "./styles";
import { ToastManagerProps, ToastManagerState } from "../utils/interfaces";

const { height } = Dimensions.get("window");

class ToastManager extends Component<ToastManagerProps, ToastManagerState> {
  private timer: NodeJS.Timeout;
  private isShow: boolean;
  static defaultProps = defaultProps;
  static __singletonRef: ToastManager | null;

  constructor(props: ToastManagerProps) {
    super(props);
    ToastManager.__singletonRef = this;
    this.timer = setTimeout(() => {}, 0); // Initialize timer with a dummy value
    this.isShow = false;
  }

  state: any = {
    isShow: false,
    text: "",
    opacityValue: new Animated.Value(1),
    barWidth: new Animated.Value(RFPercentage(32)),
    barColor: Colors.default,
    icon: "checkmark-circle",
    position: this.props.position,
    animationStyle: {
      upInUpOut: {
        animationIn: "slideInDown",
        animationOut: "slideOutUp",
      },
      rightInOut: {
        animationIn: "slideInRight",
        animationOut: "slideOutRight",
      },
      zoomInOut: {
        animationIn: "zoomInDown",
        animationOut: "zoomOutUp",
      },
    },
  };

  static info = (text: string, position: string, icon?: any) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.info,
      icon,
      position,
      "info"
    );
  };

  static success = (text: string, position?: string, icon?: any) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.success,
      icon,
      position,
      "success"
    );
  };

  static warn = (text: string, position: string, icon?: any) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.warn,
      icon,
      position,
      "warn"
    );
  };

  static error = (text: string, position: string, icon?: any) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.error,
      icon,
      position,
      "error"
    );
  };

  show = (
    text = "",
    barColor = Colors.default,
    icon: string,
    position?: string,
    status: string
  ) => {
    const { duration } = this.props;
    this.state.barWidth.setValue(this.props.width);
    this.setState({
      isShow: true,
      duration,
      text,
      barColor,
      icon,
      status,
    });
    if (position) this.setState({ position });
    this.isShow = true;
    if (duration !== this.props.end) this.close(duration);
  };

  close = (duration: number) => {
    if (!this.isShow && !this.state.isShow) return;
    this.resetAll();
    this.timer = setTimeout(() => {
      this.setState({ isShow: false });
    }, duration || this.state.duration);
  };

  position = () => {
    const { position } = this.state;
    if (position === "top") return this.props.positionValue;
    if (position === "center") return height / 2 - RFPercentage(9);
    return height - this.props.positionValue - RFPercentage(10);
  };

  handleBar = () => {
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  pause = () => {
    this.setState({ oldDuration: this.state.duration, duration: 10000 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).stop();
  };

  resume = () => {
    this.setState({ duration: this.state.oldDuration, oldDuration: 0 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  hideToast = () => {
    this.resetAll();
    this.setState({ isShow: false });
    this.isShow = false;
    if (!this.isShow && !this.state.isShow) return;
  };

  resetAll = () => {
    clearTimeout(this.timer);
  };

  render() {
    this.handleBar();
    const {
      animationIn,
      animationStyle,
      animationOut,
      backdropTransitionOutTiming,
      backdropTransitionInTiming,
      animationInTiming,
      animationOutTiming,
      backdropColor,
      backdropOpacity,
      hasBackdrop,
      width,
      height,
      hasProgressBar,
      Component,
      hasIcon,
      entryStyle,
    } = this.props;

    const {
      isShow,
      animationStyle: stateAnimationStyle,
      barColor,
      icon,
      text,
      barWidth,
      status,
    } = this.state;

    return (
      <Modal
        animationIn={
          animationIn || stateAnimationStyle[animationStyle].animationIn
        }
        animationOut={
          animationOut || stateAnimationStyle[animationStyle].animationOut
        }
        backdropTransitionOutTiming={backdropTransitionOutTiming}
        backdropTransitionInTiming={backdropTransitionInTiming}
        animationInTiming={animationInTiming}
        animationOutTiming={animationOutTiming}
        onTouchEnd={this.resume}
        onTouchStart={this.pause}
        swipeDirection={["up", "down", "left", "right"]}
        onSwipeComplete={this.hideToast}
        onModalHide={this.resetAll}
        isVisible={isShow}
        coverScreen={false}
        backdropColor={backdropColor}
        backdropOpacity={backdropOpacity}
        hasBackdrop={hasBackdrop}
        style={styles.modalContainer}
      >
        <Pressable
          style={[
            styles.mainContainer,
            entryStyle,
            {
              width,
              height,
              top: this.position(),
            },
          ]}
          onPress={this.hideToast}
        >
          {hasIcon && (
            <View style={styles.hideButton}>
              {icon ? icon : <Icon name="close-outline" size={22} />}
            </View>
          )}

          <Component text={text} status={status} />

          {hasProgressBar && (
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={{ width: barWidth, backgroundColor: barColor }}
              />
            </View>
          )}
        </Pressable>
      </Modal>
    );
  }
}

ToastManager.defaultProps = defaultProps;

export default ToastManager;
