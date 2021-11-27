// Import React and required components
import React, { useState } from 'react';
import {
  Alert, Button, Image, Linking, PermissionsAndroid, SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet, Text, TouchableOpacity, useColorScheme, View
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFS from 'react-native-fs';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';


const Doc = () => {
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


      RNFS.readFile(res[0].uri, 'base64')
        .then(data => {
          console.log('File Data srting : ' + data);
        });

    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
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
        alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
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
          title: "Storage Permission",
          message:
            "App needs read access to your storage " +
            "so you can take awesome upload.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the storage");
        setPermission(true)
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePress = async (url) => {
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

  const filePreview = async (path) => {
    console.log('file Preview path : ', path)
    FileViewer.open(path, { showOpenWithDialog: true })
      .then(await FileViewer.open(path)
      )
      .catch(error => {
        // error
        Alert.alert(`Not able preview file open this URL: ${path}`);
      });
  };


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.sectionTitle}>
            File Picker in React Native
          </Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handlePress('https://aboutreact.com/file-picker-in-react-native/')}>
            <Text style={styles.titleText}>
              https://aboutreact.com/file-picker-in-react-native/
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handlePress('https://stackoverflow.com/questions/34908009/react-native-convert-image-url-to-base64-string')}>
            <Text style={styles.titleText}>
              https://stackoverflow.com/questions/34908009/react-native-convert-image-url-to-base64-string
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: 'grey',
              height: 2,
              margin: 10
            }} />
          <Button
            style={{ margin: 10 }}
            title="request permissions"
            onPress={requestStoragePermission} />
          <View
            style={{
              backgroundColor: 'grey',
              height: 2,
              margin: 10
            }} />
          <View style={styles.container}>
            {/*To show single file attribute*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={selectOneFile}>
              {/*Single file selection button*/}
              <Text style={{ margin: 10, fontSize: 19 }}>
                Click here to pick one file
              </Text>
              <Image
                source={{
                  uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                }}
                style={styles.imageIconStyle}
              />
            </TouchableOpacity>
            {/*Showing the data of selected Single file*/}
            {singleFile && singleFile.length > 0 !== null ?
              <>
                <Text style={[styles.textStyle, { color: isDarkMode ? 'white' : 'black' }]}>
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
                  style={{ margin: 10 }}
                  title="Preview"
                  onPress={() => filePreview(singleFile[0].uri)} />
              </> : null}
            <View
              style={{
                backgroundColor: 'grey',
                height: 2,
                margin: 10
              }} />
            {/*To multiple single file attribute*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={selectMultipleFile}>
              {/*Multiple files selection button*/}
              <Text style={{ margin: 10, fontSize: 19 }}>
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
                  <Text style={[styles.textStyle, { color: isDarkMode ? 'white' : 'black' }]}>
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
          </View>
        </View>
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
    // backgroundColor: '#fff',
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
});

export default Doc;
