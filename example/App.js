/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {StyleSheet, View, Button} from "react-native";
import SpringPullToRefresh from "react-native-spring-pull-to-refresh";


type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <SpringPullToRefresh
                    initialText={"Pull Me!"}
                    releaseText={"Release Me!"}
                    onRefresh={() => {}}
                    refreshing={false}
                    data={[{id: 1}, {id: 2}]}
                    renderItem={({item}) => <Button title={`item-${item.id}`} onPress={() => console.log("pressed!")}/>}
                    keyExtractor={item => item.id.toString()}
                    height={50}
                    maxHeight={150}
                    backgroundColor={"#000000"}
                    draggingSpeed={30}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0e36ff",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});
