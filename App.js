/* eslint-disable react-native/no-inline-styles */
// Import React and required components
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Image,
  Linking,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RNImageToPdf from 'react-native-image-to-pdf';
import ImagePicker from 'react-native-image-crop-picker';
// https://www.npmjs.com/package/react-native-permissions
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [singleFile, setSingleFile] = useState('');
  const [multipleFile, setMultipleFile] = useState([]);
  const [isPermission, setPermission] = useState(false);

  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res[0].uri);
      console.log('Type : ' + res[0].type);
      console.log('File Name : ' + res[0].name);
      console.log('File Size : ' + res[0].size);
      //Setting the state to show single file attributes
      setSingleFile(res);

      RNFS.readFile(res[0].uri, 'base64').then(data => {
        console.log('File Data srting : ' + data);
      });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        Alert.alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
        //There can me more options as well find above
      });
      for (const res of results) {
        //Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
      }
      //Setting the state to show multiple file attributes
      setMultipleFile(results);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        Alert.alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  // https://reactnative.dev/docs/permissionsandroid
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message:
            'App needs read access to your storage ' +
            'so you can take awesome upload.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        setPermission(true);
      } else {
        Alert.alert('Camera storage denied.');
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Opps, Something went wrong! for storage Permission');
    }
  };

  const requestAllPermission = async () => {
    try {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then(statuses => {
        console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
        console.log(
          'Read storage',
          statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
        );
        console.log(
          'Write storage',
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
        );
        console.log(
          'FINE LOCATION',
          statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
        );
        console.log(
          'COARSE LOCATION',
          statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION],
        );
        if (statuses[PERMISSIONS.ANDROID.CAMERA] === 'denied') {
          requestAllPermission();
        }
      });
    } catch (err) {
      console.warn(err);
      Alert.alert('Opps, Something went wrong! for All Permission');
    }
  };

  const handlePress = async url => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const filePreview = async path => {
    console.log('file Preview path : ', path);
    FileViewer.open(path, {showOpenWithDialog: true})
      .then(await FileViewer.open(path))
      .catch(error => {
        // error
        Alert.alert(`Not able preview file open this URL: ${path}`);
      });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const myAsyncPDFFunction = async () => {
    try {
      // var p = 'file://' + RNFS.DocumentDirectoryPath;
      // // https://stackoverflow.com/questions/47197227/how-to-access-files-and-folders-using-react-native-fs-library
      /* RNFS.readDir(RNFS.DownloadDirectoryPath + '')
        .then(result => {
          console.log('GOT RESULT', result);
          return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .then(statResult => {
          if (statResult[0].isFile()) {
            return RNFS.readFile(statResult[1], 'utf8');
          }
          return 'no file';
        })
        .then(contents => {
          console.log(contents);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
      console.log('>>', multipleFile); */
      var pathImgs = [];
      multipleFile.map((item, index) => {
        if (item?.type.includes('image')) {
          var patharr = item?.uri.split('/');
          patharr = patharr[patharr.length - 1];
          patharr = patharr.replace('raw%3A', '').replace(/%2F/gi, '/');
          pathImgs.push(patharr);
        }
      });
      if (pathImgs?.length > 0) {
        const options = {
          imagePaths: pathImgs,
          // imagePaths: [
          //   '/storage/emulated/0/Download/f1.png',
          //   '/storage/emulated/0/Download/f2.png',
          // ],
          name: 'PDFName.pdf',
          maxSize: {
            // optional maximum image dimension - larger images will be resized
            width: 1600,
            // height: Math.round((deviceHeight() / deviceWidth()) * 900),
            height: 2400,
          },
          quality: 0.7, // optional compression paramter
        };
        console.log('pdf option >>>', options);
        const pdf = await RNImageToPdf.createPDFbyImages(options);
        console.log(pdf.filePath);
      } else {
        Alert.alert('No Files selected in pick mutiple files');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Opps, Something went wrong!');
    }
  };

  const openCameraPicker = async () => {
    try {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Opps, Something went wrong with Camera!');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.sectionTitle}>File Handling in React Native</Text>
          {/*
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              handlePress('https://aboutreact.com/file-picker-in-react-native/')
            }>
            <Text style={styles.titleText}>
              https://aboutreact.com/file-picker-in-react-native/
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              handlePress(
                'https://stackoverflow.com/questions/34908009/react-native-convert-image-url-to-base64-string',
              )
            }>
            <Text style={styles.titleText}>
              https://stackoverflow.com/questions/34908009/react-native-convert-image-url-to-base64-string
            </Text>
          </TouchableOpacity> */}
          <View style={styles.greyline} />
          <View style={styles.container}>
            <Button
              style={styles.margin10}
              title="Request Storage Permission"
              onPress={requestStoragePermission}
            />
            <View style={styles.greyline} />
            <Button
              style={styles.margin10}
              title="Request All Permission"
              onPress={requestAllPermission}
            />
          </View>
          <View style={styles.greyline} />
          <View style={styles.container}>
            {/*To show single file attribute*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={selectOneFile}>
              {/*Single file selection button*/}
              <Text style={styles.btnFont}>Click here to pick one file</Text>
              <Image
                source={{
                  uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                }}
                style={styles.imageIconStyle}
              />
            </TouchableOpacity>
            {/*Showing the data of selected Single file*/}
            {singleFile && singleFile.length > 0 !== null ? (
              <>
                <Text
                  style={[
                    styles.textStyle,
                    {color: isDarkMode ? 'white' : 'black'},
                  ]}>
                  File Name: {singleFile[0].name ? singleFile[0].name : ''}
                  {'\n'}
                  Type: {singleFile[0].type ? singleFile[0].type : ''}
                  {'\n'}
                  File Size: {singleFile[0].size ? singleFile[0].size : ''}
                  {'\n'}
                  URI: {singleFile[0].uri ? singleFile[0].uri : ''}
                  {'\n'}
                </Text>
                <Button
                  style={styles.margin10}
                  title="Preview"
                  onPress={() => filePreview(singleFile[0].uri)}
                />
              </>
            ) : null}
            <View style={styles.greyline} />
            {/*To multiple single file attribute*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={selectMultipleFile}>
              {/*Multiple files selection button*/}
              <Text style={styles.btnFont}>
                Click here to pick multiple files
              </Text>
              <Image
                source={{
                  uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                }}
                style={styles.imageIconStyle}
              />
            </TouchableOpacity>
            <ScrollView>
              {/*Showing the data of selected Multiple files*/}
              {multipleFile.map((item, key) => (
                <View key={key}>
                  <Text
                    style={[
                      styles.textStyle,
                      {color: isDarkMode ? 'white' : 'black'},
                    ]}>
                    File Name: {item.name ? item.name : ''}
                    {'\n'}
                    Type: {item.type ? item.type : ''}
                    {'\n'}
                    File Size: {item.size ? item.size : ''}
                    {'\n'}
                    URI: {item.uri ? item.uri : ''}
                    {'\n'}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.greyline} />
            {/*Convert to pdf*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={myAsyncPDFFunction}>
              <Text style={styles.btnFont}>Convert image to PDF</Text>
            </TouchableOpacity>
            <View style={styles.greyline} />
            {/*Capture images and save to cache folder*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={openCameraPicker}>
              <Text style={styles.btnFont}>Capture image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    fontSize: 15,
    marginTop: 16,
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  greyline: {
    backgroundColor: 'grey',
    height: 2,
    margin: 10,
  },
  margin10: {
    margin: 10,
    padding: 10,
  },
  btnFont: {
    margin: 10,
    fontSize: 20,
  },
});

export default App;
