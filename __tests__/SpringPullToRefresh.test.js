import {View} from "react-native";
import React from "react";
import renderer from "react-test-renderer";
import SpringPullToRefresh from "../src/SpringPullToRefresh";
import {expectNotToFindByProps, randomNumber} from "./utils/utils";
import {lorem} from "faker";
import {eventScrollToBottom, eventScrollToTop} from "./factories/factories";

describe("pull to refresh component", () => {
    let render;
    let defaultProps;

    const getHeaderContainerProps = (component) => component.root.findByProps({testID: "ptr-header-container"}).props;
    const getScrollViewProps = (component) => component.root.findByProps({testID: "ptr-scroll-view"}).props;
    const scroll = (component, evt) => getScrollViewProps(component).onScroll(evt);

    beforeEach(() => {
        defaultProps = {
            height: randomNumber(),
            initialText: lorem.word(),
            releaseText: lorem.word(),
            onRefresh: jest.fn(),
            refreshing: false,
            data: [],
            renderItem: jest.fn,
            keyExtractor: jest.fn(() => randomNumber().toString()),
        };

        render = (props) => renderer.create(<SpringPullToRefresh {...props}/>);
    });

    it ("should render without crashing", () => {
        expect(render(defaultProps).toJSON()).toBeTruthy();
    });

    describe("component elements", () => {
        let component;

        beforeEach(() => {
            component = render(defaultProps);
        });

        it ("should render a container", () => {
            expect(component.root.findByProps({testID: "ptr-container"})).toBeTruthy();
        });

        it ("should render a header container", () => {
            expect(component.root.findByProps({testID: "ptr-header-container"})).toBeTruthy();
        });

        it ("renders a scroll view", () => {
            expect(component.root.findByProps({testID: "ptr-scroll-view"})).toBeTruthy();
        });

        it ("should render an animated initial text", () => {
            expect(component.root.findByProps({testID: "ptr-animated-initialText"})).toBeTruthy();
        });

        it ("should render an animated release text", () => {
            expect(component.root.findByProps({testID: "ptr-animated-releaseText"})).toBeTruthy();
        });

        it ("should render a footer when provided", () => {
            defaultProps.footer = <View testID={"test-footer"}/>;
            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "test-footer"})).toBeTruthy();
        });

        it ("should render no content component when data is empty", () => {
            defaultProps.noContentComponent = <View testID={"test-no-content-component"}/>;
            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "test-no-content-component"})).toBeTruthy();
        });

        it ("should not render no content component if data is not empty", () => {
            defaultProps.noContentComponent = <View testID={"test-no-content-component"}/>;
            defaultProps.data = [{someKey: "someValue"}];
            defaultProps.renderItem = jest.fn();
            const component = render(defaultProps);

            expectNotToFindByProps(component, "test-no-content-component");
        });
    });

    describe("pull to refresh header", () => {
        it ("should set container height to height prop", () => {
            const defaultHeight = randomNumber();
            const component = render({...defaultProps, defaultHeight});

            expect(getHeaderContainerProps(component).style.height._value).toEqual(defaultHeight);
        });

        it ("should set background color prop to container style", () => {
            defaultProps.backgroundColor = "#FFFFFF";
            const component = render(defaultProps);

            expect(getHeaderContainerProps(component).style.backgroundColor).toEqual(defaultProps.backgroundColor);
        });

        it ("should render initial text prop", () => {

            defaultProps.initialText = "Pull me!";

            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "ptr-initialText"})).toBeTruthy();
        });

        it ("should not render release text when its not at max height", () => {
            defaultProps.maxHeight = defaultProps.height + 30;
            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "ptr-animated-releaseText"}).props.style.opacity._value).toBeLessThan(1);
        });

        it ("should not render initial text when its at max height", () => {
            defaultProps.height = 30;
            defaultProps.maxHeight = 30;
            const component = render(defaultProps);


            expect(component.root.findByProps({testID: "ptr-animated-releaseText"}).props.style.opacity._value).toBeLessThan(1);
        });

        it ("should render release text when its at max height", () => {
            defaultProps.height = 30;
            defaultProps.maxHeight = 30;
            const component = render(defaultProps);


            expect(component.root.findByProps({testID: "ptr-releaseText"})).toBeTruthy();
        });

        it ("should add initial text style with textStyle prop if provided", () => {
            defaultProps.textStyle = {fontSize: 13};
            const component = render(defaultProps);

            const initialTextStyle = component.root.findByProps({testID: "ptr-initialText"}).props.style;

            expect(initialTextStyle.some(style => style.fontSize === defaultProps.textStyle.fontSize)).toBeTruthy();
        });

        it ("should add release text style with textStyle prop if provided", () => {
            defaultProps.height = 30;
            defaultProps.maxHeight = 30;
            defaultProps.textStyle = {fontSize: 13};
            const component = render(defaultProps);

            const releaseTextStyle = component.root.findByProps({testID: "ptr-releaseText"}).props.style;

            expect(releaseTextStyle.some(style => style.fontSize === defaultProps.textStyle.fontSize)).toBeTruthy();
        });

        it ("should add initial text style with textStyle prop if its an array", () => {
            defaultProps.textStyle = [{fontSize: 13}];
            const component = render(defaultProps);

            const initialTextStyle = component.root.findByProps({testID: "ptr-initialText"}).props.style;

            expect(initialTextStyle.some(style => style.fontSize === defaultProps.textStyle.fontSize)).toBeTruthy();
        });

        it ("should render an activity indicator when its refreshing", () => {
            defaultProps.refreshing = true;
            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "ptr-activity-indicator"}).props.style.opacity).toEqual(1);
        });

        it ("should not render an activity indicator when its refreshing", () => {
            defaultProps.refreshing = false;
            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "ptr-activity-indicator"}).props.style.opacity).toEqual(0);
        });

        it ("should not render initialText when its refreshing", () => {
            defaultProps.refreshing = true;
            const component = render(defaultProps);

            expectNotToFindByProps(component, "ptr-initialText");
        });

        it ("should render initial left icon prop if provided", () => {
            defaultProps.initialLeftIcon = <View testID={"test-view"}/>;
            const component = render(defaultProps);

            expect(component.root.findByProps({testID: "test-view"})).toBeTruthy();
        });

        it ("should render release left icon prop if provided", () => {
            defaultProps.height = 30;
            defaultProps.maxHeight = 30;
            defaultProps.releaseLeftIcon = <View testID={"test-view"}/>;
            const component = render(defaultProps);
            expect(component.root.findByProps({testID: "test-view"})).toBeTruthy();
        });

        it ("should call onRefresh prop when releasing at max height", () => {
            defaultProps.defaultHeight = randomNumber();
            defaultProps.maxHeight = defaultProps.defaultHeight;
            defaultProps.onRefresh = jest.fn();
            const component = render(defaultProps);

            component.root.findByProps({testID: "ptr-container"}).props.onResponderRelease();

            expect(defaultProps.onRefresh).toBeCalled();
        });

        it ("should disable scroll when releasing and is at top", () => {
            const component = render(defaultProps);

            scroll(component, eventScrollToTop()); // now its not at top

            getScrollViewProps(component).onScrollEndDrag();

            expect(getScrollViewProps(component).scrollEnabled).toBeFalsy();
        });

        it ("should have a default height", () => {
            defaultProps.defaultHeight = undefined;
            const component = render(defaultProps);
            const headerStyle = component.root.findByProps({testID: "ptr-header-container"}).props.style;
            expect(headerStyle.height).toBeTruthy();
        });
    });

    describe("scroll view component", () => {
        it ("should call onEndReached prop when reaching scroll view's end", () => {
            defaultProps.onEndReached = jest.fn();
            const component = render(defaultProps);

            scroll(component, eventScrollToBottom());

            expect(defaultProps.onEndReached).toBeCalled();
        });
    });
});