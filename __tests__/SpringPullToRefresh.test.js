import 'react-native';
import React from "react";
import renderer from "react-test-renderer";
import SpringPullToRefresh from "../SpringPullToRefresh";

describe("pull to refresh component", () => {
    let render;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {

        };

        render = (props) => renderer.create(<SpringPullToRefresh {...props}/>);
    });

    it ("should render without crashing", () => {
        expect(render(defaultProps).toJSON()).toBeTruthy();
    });
});