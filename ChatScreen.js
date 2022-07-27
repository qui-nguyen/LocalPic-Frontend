import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import { Input, Button, ListItem } from "react-native-elements";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { connect } from "react-redux";

/*----Web socket----*/
import socketIOClient from "socket.io-client";

var socket = socketIOClient("https://localpic.herokuapp.com/");

function ChatScreen(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);

  const regex = /:\)|:\(|:p/gi;
  const replaceBadWorld = /\w*fuck\w*/gi;

  const listEmojis = {
    ":)": "\u263A",
    ":(": "\u2639",
    ":p": "\uD83D\uDE1B",
  };
  useEffect(() => {
    socket.on("sendMessageToAll", (obj) => {
      let msg = obj.message.replace(
        regex,
        (correspondance) => listEmojis[correspondance.toLowerCase()]
      );
      msg = msg.replace(replaceBadWorld, "\u2022\u2022\u2022");
      setListMessage([...listMessage, { ...obj, message: msg }]);
      scrollToEnd();
    });
    return () => socket.off("sendMessageToAll"); // for delete all: // socket.off()
  }, [listMessage]);

  const messages = listMessage.map((message, i) => {
    //let style = "mesgLeft";
    let styleMsg = styles.msgLeft;
    let styleBox = { flexDirection: "row" };
    let styleMsgContainer = { backgroundColor: "#8bd3dd" };
    if (message.pseudo === props.pseudo) {
      styleMsg = styles.msgRight;
      styleBox = { flexDirection: "row-reverse" };
      styleMsgContainer = { backgroundColor: "#D8D8D8" };
    }
    return (
      <View key={i} style={[styles.container, styleBox]}>
        <View style={[styles.msg, styleMsgContainer]}>
          <Text style={[styleMsg, {fontSize: 20}]}>{message.message}</Text>
          <Text style={[styleMsg, {fontWeight: "bold"}]}>{message.pseudo}</Text>
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          "#d16ba5",
          "#c777b9",
          "#ba83ca",
          "#aa8fd8",
          "#9a9ae1",
          "#8aa7ec",
          "#79b3f4",
          "#69bff8",
          "#52cffe",
          "#41dfff",
        ]}
        style={styles.background}
      >
        <View style={styles.topContainer}>
          <Text style={{ color: "#001858", fontSize: 20 }}>
            <Icon name="wechat" size={24} color="#001858" />
            Chat box
          </Text>
        </View>
      </LinearGradient>
      <ScrollView style={{ marginVertical: 70 }}>{messages}</ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder="Your message"
          onChangeText={(value) => setCurrentMessage(value)}
          value={currentMessage}
        />
        <Button
          icon={<Icon name="envelope-o" size={20} color="#001858" />}
          title="Send"
          titleStyle={{ color: "#001858", fontWeight: "700" }}
          buttonStyle={{ backgroundColor: "#f582ae" }}
          type="solid"
          onPress={() => {
            socket.emit("sendMessage", {
              pseudo: props.pseudo,
              message: currentMessage,
            }),
              setCurrentMessage("");
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginHorizontal: 20,
  },

  msg: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    maxWidth: "60%",
    borderRadius: 10,
  },
  msgLeft: {
    textAlign: "left",
    color: "#172c66"
  },
  msgRight: {
    textAlign: "right",
    color: "#172c66"
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 90,
  },
});

const mapStateToProps = (state) => {
  return {
    pseudo: state.userPseudo,
  };
};

export default connect(mapStateToProps, null)(ChatScreen);
