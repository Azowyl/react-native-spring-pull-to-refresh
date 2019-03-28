import {StyleSheet} from "react-native";
import {white} from "./colors";

export const styles = StyleSheet.create({
    /* CONTAINERS */
    container: {
        position: "relative",
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        alignSelf: "stretch"
    },

    centered_row: {
        flexDirection: "row",
        justifyContent: "center"
    },

    absolute_pos: {
        position: "absolute",
        alignSelf: "center"
    },

    /* COLORS */
    c_w: { color: white },

    /* TEXT SIZE */
    h3: { fontSize: 21 },

    /* TEXT ALIGN */
    text_center: {textAlign: "center"},

    /* PADDING */
    pd_b_sm: { paddingBottom: 10 },
});

export const toOpacityStyle = (value) => {
    return {opacity: value};
};

export const toHeightStyle = (value) => {
    return { height: value};
};