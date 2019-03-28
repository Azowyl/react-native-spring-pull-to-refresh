
# react-native-spring-pull-to-refresh

## Preview

```javascript
// TODO: add preview
```

## Getting started

`$ npm install react-native-spring-pull-to-refresh --save`

## Usage
```javascript
import SpringPullToRefresh from 'react-native-spring-pull-to-refresh';

<SpringPullToRefresh
            initialText={"Pull Me!"}
            releaseText={"Release Me!"}
            onRefresh={() => {}}
            refreshing={false}
            data={[]}
            renderItem={() => {}} 
            keyExtractor={() => {}}
/>

// TODO: What to do with the module?
RNSpringPullToRefresh;
```

## Props

| Prop        | Description           | Default  | Required | 
| ------------- |:-------------:| :-----:| ------ :|
| defaultHeight   | header's default height | 50 | no |
| backgroundColor | header's background color | ? | no |
| textStyle | style for header's messages | { textAlign: "center", fontSize: 21, color: white, paddingBottom: 10 } | no |
| refreshingIndicatorColor | color for indicator showed when refreshing | white | no |
| initialText | default header's text | - | yes |
| releaseText | text to show when pulling to refresh | - | yes |
| onRefresh | function to call when releasing | - | yes |
| refreshing | set this to true when refreshing content | - | yes |
| initialLeftIcon | icon to show at initial text's left | null | no |
| releaseLeftIcon | icon to show at release text's left | null | no |
| draggingSpeed | how fast should the header grow | 10 | no |
| data | list's items | - | yes |
| renderItem | function for render each data's item | - | yes |
| footer | footer component | null | no |
| noContentComponent | component to render where data is empty | null | no |
| onEndReached | called when list reach the end | () => {} | no |
| keyExtractor | key extractor for each data's item | - | yes |