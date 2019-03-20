export const expectNotToFindByProps = (element, testInstance) => {
    try {
        element.root.findByProps({testID: testInstance});
    } catch (e) {
        expect(true).toBeTruthy();
        return;
    }
    throw new Error("Expected not to find " + "'" + testInstance + "'" + " but it was found");
};

export const randomNumber = (max = 10000) => {
    return Math.floor(Math.random() * Math.floor(max));
};
