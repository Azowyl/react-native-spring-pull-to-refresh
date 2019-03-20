export const eventScrollToTop = () => {
    return {
        nativeEvent: {
            contentOffset: {
                y: 0
            },
            layoutMeasurement: {
                height: 0,
            },
            contentSize: {
                height: 0,
            }
        }
    };
};

export const eventScrollToBottom = () => {
    return {
        nativeEvent: {
            contentOffset: {
                y: 1000
            },
            layoutMeasurement: {
                height: 0,
            },
            contentSize: {
                height: 0,
            }
        }
    };
};