import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

function HomeScreen(props) {
  const [isPseudoStorage, setIsPseudoStorage] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("pseudoStorage", function (error, pseudo) {
      if (pseudo) {
        props.onSubmitPseudo(pseudo);
        setIsPseudoStorage(true);
      }
    });
  }, []);

  let viewInput;

  if (isPseudoStorage && props.pseudo) {
    viewInput = (
      <>
        <Text style={{ fontSize: 20, color: "#001858", fontStyle: "italic"}}>Hello {props.pseudo}!</Text>
        <Button
          title="Logout"
          icon={{
            name: "logout",
            type: "AntDesign",
            size: 15,
            color: "#001858",
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ color: "#001858", fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "#f582ae",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 10,
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={() => {
            AsyncStorage.removeItem("pseudoStorage");
            setIsPseudoStorage(false);
            props.onSubmitPseudo("");
          }}
        ></Button>
      </>
    );
  } else {
    viewInput = (
      <>
          <Input
            placeholder="Thanh Qui"
            leftIcon={{ type: "font-awesome", name: "user", color: "#ff5470" }}
            onChangeText={(value) => props.onSubmitPseudo(value)}
            value={props.pseudo}
          />
      </>
    );
  }

  return (
    <View style={styles.container}>
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
      />

      {viewInput}
      <Button
        title="Go to Map"
        icon={{
          name: "arrow-right",
          type: "font-awesome",
          size: 15,
          color: "#001858",
        }}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ color: "#001858", fontWeight: "700" }}
        buttonStyle={{
          backgroundColor: "#f582ae",
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 10,
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        onPress={() => {
          AsyncStorage.setItem("pseudoStorage", props.pseudo);
          props.navigation.navigate("BottomNavigator");
        }}
      >
        {" "}
      </Button>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#41dfff",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
});

const mapStateToProps = (state) => {
  return {
    pseudo: state.userPseudo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo: pseudo });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
