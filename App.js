/* eslint-disable react-native/no-inline-styles */
// Import React and required components

// https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html
// https://github.com/ggunti/react-native-amazing-cropper
// https://www.npmjs.com/package/react-native-amazing-cropper
// NON working old dependices Lib with @react-native-community/image-editor and react-native-image-rotate

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import AmazingCropper from 'react-native-amazing-cropper';

const App = () => {
  const onDoneAZ = uri => {
    console.log('onDoneAZ >>', uri);
  };

  const onErrorAZ = err => {
    console.log('onErrorAZ >>', err);
  };

  const onCancelAZ = () => {
    console.log('onCancelAZ >>');
  };

  return (
    <View style={styles.amazingCropper}>
      <Image
        style={styles.imageIconStyle}
        source={{
          // uri: 'https://www.lifeofpix.com/wp-content/uploads/2018/09/manhattan_-11-1600x2396.jpg',
          uri: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        }}
      />
      <AmazingCropper
        onDone={onDoneAZ}
        onError={onErrorAZ}
        onCancel={onCancelAZ}
        // imageUri="https://www.lifeofpix.com/wp-content/uploads/2018/09/manhattan_-11-1600x2396.jpg"
        imageUri="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
        imageWidth={1600}
        imageHeight={2396}
        NOT_SELECTED_AREA_OPACITY={0.3}
        BORDER_WIDTH={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  amazingCropper: {
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  imageGallaryStyle: {
    height: 300,
    width: '100%',
    resizeMode: 'stretch',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    resizeMode: 'stretch',
  },
  greyline: {
    backgroundColor: 'grey',
    height: 2,
    margin: 10,
  },
});

export default App;
