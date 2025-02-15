import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  mainContainer: {
    borderRadius: 6,
    position: "absolute",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    elevation: 5,
  },

  hideButton: {
    position: "absolute",
    top: RFPercentage(0.5),
    right: RFPercentage(0.5),
  },

  textStyle: {
    fontSize: RFPercentage(2.5),
    fontWeight: "400",
  },

  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    height: 4,
    width: "100%",
    bottom: 0,
  },

  content: {
    width: "100%",
    padding: RFPercentage(1.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  iconWrapper: {
    marginRight: RFPercentage(0.7),
  },
});

export default styles;
