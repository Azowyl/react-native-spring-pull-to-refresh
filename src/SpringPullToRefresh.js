import React from "react";
import {View, Text, ActivityIndicator, FlatList, PanResponder, Animated, Dimensions} from "react-native";
import PropTypes from "prop-types";
import {styles} from "./styles/styles";

const DRAGGING_SPEED = 10;
const TOP_POSITION = 0;
const ANIMATION_SPEED = 15;
const DRAGGING_TOLERANCE = 5;
const DEFAULT_HEADER_HEIGHT = 50;
const DEFAULT_MAX_HEIGHT = 150;
const { height } = Dimensions.get("window");

export class SpringPullToRefresh extends React.Component {
    static propTypes = {
        /* STYLE */
        defaultHeight: PropTypes.number,
        backgroundColor: PropTypes.string,
        textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        refreshingIndicatorColor: PropTypes.string,

        /* TEXT */
        initialText: PropTypes.string.isRequired,
        releaseText: PropTypes.string.isRequired,

        /* SETTINGS*/
        maxHeight: PropTypes.number,
        onRefresh: PropTypes.func.isRequired,
        refreshing: PropTypes.bool.isRequired,
        initialLeftIcon: PropTypes.object,
        releaseLeftIcon: PropTypes.object,
        draggingSpeed: PropTypes.number,
        data: PropTypes.array.isRequired,
        renderItem: PropTypes.func.isRequired,
        footer: PropTypes.object,
        noContentComponent: PropTypes.object,
        onEndReached: PropTypes.func,
        keyExtractor: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            height: new Animated.Value(0),
            canScroll: true,
            scrollY: 0,
            initialTextOpacity: new Animated.Value(1),
            releaseTextOpacity: new Animated.Value(0),
            enoughElementsToScroll: true,
        };

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: () => !this.state.canScroll,
            onPanResponderMove: (evt, gestureState) => {
                this.onDragging(evt, gestureState);
            },
            onPanResponderRelease: () => {
                this.onRelease();
            },
        });

    }

    componentDidMount = () => {
        this.state.height.setValue(this.getDefaultHeight());
        this.setState({enoughElementsToScroll: this.props.data.length > 0});
    };

    getHeight = () => {
        return this.state.height._value;
    };

    getDefaultHeight = () => {
        return this.props.defaultHeight ? this.props.defaultHeight : DEFAULT_HEADER_HEIGHT;
    };

    getMaxHeight = () => {
        return this.props.maxHeight ? this.props.maxHeight : DEFAULT_MAX_HEIGHT;
    };

    getDraggingSpeed = () => {
        return this.props.draggingSpeed ? this.props.draggingSpeed : DRAGGING_SPEED;
    };

    isDraggingDown = (gestureState) => {
        return gestureState.dy >= DRAGGING_TOLERANCE;
    };

    isAtTop = () => {
        return this.state.scrollY <= TOP_POSITION;
    };

    isAtBottom = (layoutMeasurement, contentOffset, contentSize) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    onDragging = (event, gestureState) => {
        if (this.isDraggingDown(gestureState)) {
            let newHeight = 0;
            if (this.getHeight() + this.getDraggingSpeed() > this.getMaxHeight()) {
                // if it exceeds max height
                newHeight = this.getMaxHeight();
            } else {
                newHeight = this.getHeight() + this.getDraggingSpeed();
            }

            Animated.parallel([
                Animated.spring(
                    this.state.height,
                    {
                        toValue: newHeight,
                        speed: ANIMATION_SPEED
                    }
                ),
                Animated.timing(
                    this.state.initialTextOpacity,
                    {
                        toValue: 1 - (this.getHeight() / this.props.maxHeight),
                        duration: 1
                    }
                ),
                Animated.timing(
                    this.state.releaseTextOpacity,
                    {
                        toValue: this.getHeight() / this.props.maxHeight,
                        duration: 100
                    }
                )
            ]).start();
        } else if (this.state.enoughElementsToScroll) {
            this.setState({canScroll: true});
        }
    };

    onRelease = () => {
        if (this.isAtMaxHeight()) {
            this.props.onRefresh();
        }

        this.state.initialTextOpacity.setValue(1);
        this.state.releaseTextOpacity.setValue(0);

        Animated.spring(
            this.state.height,
            {
                toValue: this.getDefaultHeight(),
                speed: ANIMATION_SPEED
            }
        ).start();
    };

    onEndDrag = () => {
        if (this.isAtTop()) {
            this.setState({canScroll: false});
        }
    };

    isAtMaxHeight = () => {
        return this.getHeight() >= this.getMaxHeight();
    };

    renderHeader = () => {
        let textStyle;
        if (Array.isArray(this.props.textStyle)) {
            textStyle = [styles.text_center, styles.h3, styles.c_w, styles.pd_b_sm, ...this.props.textStyle];
        } else {
            textStyle = [styles.text_center, styles.h3, styles.c_w, styles.pd_b_sm, {...this.props.textStyle}];
        }

        const {
            refreshingIndicatorColor, backgroundColor, refreshing, releaseLeftIcon, releaseText, initialText, initialLeftIcon
        } = this.props;

        return (
            <Animated.View
                testID={"ptr-header-container"}
                style={{height: this.state.height, justifyContent: "flex-end", backgroundColor: backgroundColor, paddingBottom: 10}}>
                <ActivityIndicator color={refreshingIndicatorColor} testID={"ptr-activity-indicator"} style={{opacity: refreshing ? 1 : 0, paddingBottom: 10}}/>
                {
                    !refreshing &&
                    <View>
                        <Animated.View
                            testID={"ptr-animated-initialText"}
                            style={[{flexDirection: "row", justifyContent: "center", opacity: this.state.initialTextOpacity, position: "absolute", alignSelf: "center", paddingBottom: 10}]}>
                            {initialLeftIcon}
                            <Text style={textStyle} testID={"ptr-initialText"}>{initialText}</Text>
                        </Animated.View>

                        <Animated.View style={{flexDirection: "row", justifyContent: "center", opacity: this.state.releaseTextOpacity}} testID={"ptr-animated-releaseText"}>
                            {releaseLeftIcon}
                            <Text style={textStyle} testID={"ptr-releaseText"}>{releaseText}</Text>
                        </Animated.View>
                    </View>
                }
            </Animated.View>
        );
    };

    onScroll = ({layoutMeasurement, contentOffset, contentSize}) => {
        this.setState({scrollY: contentOffset.y});
        if (this.isAtBottom(layoutMeasurement, contentOffset, contentSize) && this.props.onEndReached) {
            this.props.onEndReached();
        }
    };

    onContentSizeChange = (contentWidth, contentHeight) => {
        if (contentHeight > height !== this.state.canScroll) {
            this.setState({ canScroll: contentHeight > height});
        }
    };

    onEndReached = () => {
        if (this.isAtTop() && this.state.enoughElementsToScroll) {
            this.setState({enoughElementsToScroll: false});
        }
    };

    render() {
        return(
            <View testID={"ptr-container"} {...this._panResponder.panHandlers} style={styles.container}>
                <FlatList
                    ref={ref => this.flatList = ref}
                    scrollEnabled={this.state.canScroll}
                    testID={"ptr-scroll-view"}
                    onScroll={({nativeEvent}) => this.onScroll(nativeEvent)}
                    onScrollEndDrag={this.onEndDrag}
                    bounces={false}
                    keyExtractor={this.props.keyExtractor}
                    ListHeaderComponent={this.renderHeader()}
                    ListFooterComponent={this.props.footer}
                    ListEmptyComponent={this.props.noContentComponent}
                    data={this.props.data}
                    renderItem={this.props.renderItem}
                    extraData={this.props}
                    onContentSizeChange={this.onContentSizeChange}
                    onEndReached={this.onEndReached}
                />
            </View>
        );
    }
}

export default SpringPullToRefresh;