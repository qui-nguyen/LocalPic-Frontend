import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Input, Button, ListItem, Text, Badge } from "react-native-elements";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; //Local Storage

function ListPOIScreen(props) {
  const [valueToFind, setValueToFind] = useState("");
  const [newListPOIFound, setNewListPOIFound] = useState(props.listPOIsaved);

  useEffect(() => {
    setNewListPOIFound(props.listPOIsaved);
  }, [props.listPOIsaved]);

  const deletePOILocalStorage = (deletePOI) => {
    let newList = props.listPOIsaved.filter((POI) => POI !== deletePOI);
    AsyncStorage.setItem("listPOI", JSON.stringify(newList));
  };

  const findValue = (value) => {
    if (value) {
      let filterListPOI = props.listPOIsaved.filter((poi) => {
        return poi.desc.includes(value) || poi.title.includes(value);
      });
      if (filterListPOI) {
        setNewListPOIFound(filterListPOI);
      }
    } else {
      setNewListPOIFound(props.listPOIsaved);
    }
  };

  const newListPOIFoundMap = newListPOIFound.map((marker, i) => {
    return (
      <ListItem.Swipeable
        rightContent={
          <Button
            title="Delete"
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
            onPress={() => {
              props.deletePoi(marker);
              deletePOILocalStorage(marker);
            }}
          />
        }
        key={`${i}-${marker.coordinate.longitude}-${marker.coordinate.latitude}`}
      >
        <ListItem.Content style={{ marginVertical: 10, borderColor: "#f582ae", borderRadius: 5 }}>
          <ListItem.Title style={{ fontWeight: "bold" }}>
            {marker.title}
          </ListItem.Title>
          <ListItem.Subtitle>{marker.desc}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem.Swipeable>
    );
  });

  if (newListPOIFound) {
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
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Badge status="success" />
          <Badge status="error" />
          <Badge status="primary" />
          <Badge status="warning" />
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "flex-start",
            padding: 20,
          }}
        >
          <Badge
            value={<Text>{newListPOIFoundMap.length}</Text>}
            status="warning"
          />
          <Entypo name="location" size={24} color="black" />
        </View>
        <ScrollView style={{ flex: 1 }}>{newListPOIFoundMap}</ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Input
            containerStyle={{ marginBottom: 5 }}
            placeholder="Find your POI"
            onChangeText={(value) => {
              findValue(value);
              setValueToFind(value);
            }}
            value={valueToFind}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={{ textAlign: "center", color: "red", fontSize: 30 }}>
            No data
          </Text>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    listPOIsaved: state.listPOI,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deletePoi: function (marker) {
      dispatch({ type: "deletePOI", marker: marker });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListPOIScreen);
