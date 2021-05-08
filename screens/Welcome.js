import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Button,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import Voice from "react-native-voice";
import Languages from "../language.json";
import Tts from "react-native-tts";

const Welcome = () => {
  //update ans ready
  const [ansReady, setAnsReady] = useState("0");

  //update souceTranslator
  const [souceTranslator, setSouceTranslator] = useState("");

  //update
  const [translatedWord, UpdatetranslatedWord] = useState("");

  //Update dropdown
  const [selectedValue, setSelectedValue] = useState("Hindi");
  const [selectedValueTwo, setSelectedValueTwo] = useState("English");

  //update default dropdown
  const [TranslateOut, setTranslateOut] = useState("auto");
  const [TranslateIn, setTranslateIn] = useState("hi");

  function updateOneDropDownOne(itemValue, itemIndex) {
    setSelectedValue(itemValue);
    setTranslateOut(itemValue);
    console.log(itemValue);
  }
  function updateOneDropDownTwo(itemValue, itemIndex) {
    setSelectedValueTwo(itemValue);
    setTranslateIn(itemValue);
    console.log(itemValue);
  }

  //set voice states
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    console.log("onSpeechStart: ", e);
    setStarted("√");
  };

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log("onSpeechEnd: ", e);
    setEnd("√");
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log("onSpeechError: ", e);
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log("onSpeechResults: ", e);
    setResults(e.value);
  };

  const onSpeechPartialResults = (e) => {
    //Invoked when any results are computed
    console.log("onSpeechPartialResults: ", e.value[0]);

    setSouceTranslator(e.value[0]);
    console.log("ye sourceTranslator ka type h", typeof souceTranslator);
    setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = (e) => {
    //Invoked when pitch that is recognized changed
    console.log("onSpeechVolumeChanged: ", e);
    setPitch(e.value);
  };
  const startRecognizing = async () => {
    setAnsReady("0");
    Tts.stop();
    console.log("sun rha h");
    ToastAndroid.showWithGravity(
      "Say Something",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
    //Starts listening for speech for a specific locale
    try {
      await Voice.start(TranslateOut);
      setPitch("");
      setError("");
      setStarted("");
      setResults([]);
      setPartialResults([]);
      setEnd("");
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    console.log("rok dia");
    console.log(results);
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    setAnsReady("0");
    Tts.stop();
    UpdatetranslatedWord("");

    try {
      await Voice.destroy();
      setPitch("");
      setError("");
      setStarted("");
      setResults([]);
      setPartialResults([]);
      setEnd("");
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };
  // useEffect(() => {
  //   const response = axios
  //     .post(
  //       'https://translation.googleapis.com/language/translate/v2',
  //       {},
  //       {
  //         params: {
  //           q: souceTranslator,
  //           target: TranslateIn,
  //           key: 'AIzaSyB5Jq5_rfSmRR382c_jPQqorvsZUXr1mqc'
  //         }
  //       }
  //     )
  //     .then((response) => {
  //       UpdatetranslatedWord(response.data.data.translations[0].translatedText);
  //     })
  //     .catch((err) => {
  //       console.log('rest api error', err);
  //     });
  // }, [souceTranslator, TranslateIn]);
  

  useEffect(function pronuce() {
    if (ansReady == "1") {
      Tts.setDefaultLanguage(TranslateIn);

      Tts.speak(translatedWord, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: "STREAM_MUSIC",
        },
      });
    }
  });
  function resultLast() {
    
    const data = JSON.stringify([
      {
        Text: souceTranslator,
      },
    ]);

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        let temp = JSON.parse(this.responseText);
        console.log(typeof temp);
        console.log(temp[0].translations[0].text);
        UpdatetranslatedWord(temp[0].translations[0].text);
        setAnsReady("1");
      }
    });

    xhr.open(
      "POST",
      `https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=${TranslateIn}&textType=plain&profanityAction=NoAction`
    );
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader(
      "x-rapidapi-key",
      "d0d8f82bc8msh5db3f0f54531eb3p1b7181jsnbeb8a998664b"
    );
    xhr.setRequestHeader(
      "x-rapidapi-host",
      "microsoft-translator-text.p.rapidapi.com"
    );

    xhr.send(data);
  }

  return (
    <View style={styles.mainView}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 10,
          height: "15%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Picker
            style={styles.picker}
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              updateOneDropDownOne(itemValue, itemIndex)
            }
          >
            <Picker.Item label="Auto Detect" value="auto" key="Auto Detect" />
            {Object.keys(Languages).map((key) => (
              <Picker.Item label={Languages[key]} value={key} key={Languages} />
            ))}
          </Picker>
        </View>
        <View>
          <Text style={{color:"white",}}>-To-</Text>
        </View>
        <View>
          <Picker
            style={styles.picker}
            selectedValue={selectedValueTwo}
            onValueChange={(itemValue, itemIndex) =>
              updateOneDropDownTwo(itemValue, itemIndex)
            }
          >
            {Object.keys(Languages).map((key) => (
              <Picker.Item label={Languages[key]} value={key} key={Languages} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.SecondView}>
        <View
          style={{
            height: "45%",
            backgroundColor: "#5773FF",
            borderRadius: 30,
            padding: 10,
          }}
        >
          <ScrollView style={{ height: "20%" }}>
            <Text style={styles.translatedWord}>
              {partialResults.map((result, index) => {
                return (
                  <Text
                    key={`partial-result-${index}`}
                    style={styles.textStyle}
                  >
                    {result}
                  </Text>
                );
              })}
            </Text>
          </ScrollView>
        </View>
        <View
          style={{
            height: "45%",
            marginTop:10,
            backgroundColor: "#5773FF",
            borderRadius: 40,
            padding: 10,
          }}
        >
          <ScrollView style={{ height: "20%" }}>
            <Text style={styles.translatedWord}>{translatedWord}</Text>
          </ScrollView>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            backgroundColor: "black",
            height:"10%",
          }}
        >
          <TouchableHighlight
            onPress={startRecognizing}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Start</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={destroyRecognizer}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={resultLast} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Translate</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    backgroundColor: "black",
  },
  picker: {
    height: 50,
    width: 130,
    margin: 5,
    color: "white",
  },
  SecondView: {
    height: "82%",
    margin:10
  },
  translatedWord: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    margin: 10,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    marginRight: 2,
    marginLeft: 2,
    
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",

  },
});
export default Welcome;
