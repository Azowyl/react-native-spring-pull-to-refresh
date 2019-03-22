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

    /* COLORS */
    c_w: { color: white },

    /* TEXT SIZE */
    h3: { fontSize: 21 },

    /* TEXT ALIGN */
    text_center: {textAlign: "center"},

    /* PADDING */
    pd_b_sm: { paddingBottom: 10 },
});