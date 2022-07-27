import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button, Overlay, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";

import React, { useState, useEffect } from "react";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; //Local Storage
import socketIOClient from "socket.io-client";
var socket = socketIOClient("https://mysterious-sierra-29108.herokuapp.com/");

function MapScreen(props) {
  /*------------------------------------ State ---------------------------------*/
  const [position, setPosition] = useState({});
  const [listPosition, setListPosition] = useState([]);
  const [addPOI, setAddPOI] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [coordinate, setCoordinate] = useState({});

  /*---------------------------------- Overlay/Modal ------------------------------*/
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    async function askPermissions() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      /*---------------Get permission acces to local of user --------------*/
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        Location.watchPositionAsync({ distanceInterval: 50 }, (location) => {
          setPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        });
      }
    }
    /*-------------Get list POI from Local Storage when this component is charged----------*/
    AsyncStorage.getItem("listPOI", function (error, POI) {
      if (POI) {
        let userPOI = JSON.parse(POI);
        props.getListPOI(userPOI);
        console.log("test" + userPOI);
      }
    });
    askPermissions();
  }, []);

  /*-------------Send via websocket from Front to Back when a user connect---------*/
  useEffect(() => {
    socket.emit("sendPosition", {
      pseudo: props.pseudo,
      position: position,
    });
    return () => socket.off("sendPosition"); // for delete all: // socket.off()
  }, [position]);

  /*-------------Receive position via websocket from Back when list position changed---------*/
  useEffect(() => {
    socket.on("sendPositionToAll", (userPosition) => {
      let listNewPosition = listPosition.filter(
        (position) => position.pseudo !== userPosition.pseudo
      );
      listNewPosition.push(userPosition);
      setListPosition(listNewPosition);
    });
    return () => socket.off("sendPositionToAll"); // for delete all: // socket.off()
  }, [listPosition]);

  /*--------------------Automate apparence of list POI from data of listPOI Redux-------------*/
  const markersPOI = props.listPOIsaved.map((marker, i) => {
    return (
      <Marker
        key={i}
        coordinate={marker.coordinate}
        title={marker.title}
        description={marker.desc}
        pinColor="blue"
      />
    );
  });

  /*--------------------Automate users positions-------------*/
  const userPosition = listPosition.map((userPos, i) => {
    return (
      <Marker
        key={i}
        coordinate={userPos.position}
        title={userPos.pseudo}
        pinColor="green"
      />
    );
  });
  /*--------------------Principal UI-------------*/
  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 45.7537667,
          longitude: 4.862333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsTraffic={true}
        onPress={(event) => {
          if (addPOI) {
            setCoordinate(event.nativeEvent.coordinate);
            toggleOverlay();
          }
        }}
      >
        <Marker
          coordinate={position}
          title="Hello"
          description={`${props.pseudo} is here`}
          draggable
        />
        {markersPOI}
        {userPosition}
      </MapView>
      <Button
        icon={<Ionicons name="location-outline" size={24} color="#001858" />}
        title={addPOI === false ? "Add POI" : "Please chosse a position"}
        titleStyle={{ color: "#001858", fontWeight: "700" }}
        buttonStyle={{ backgroundColor: addPOI === false ? "#f582ae" : "#eaddcf" }}
        type="solid"
        onPress={() => {
          setAddPOI(!addPOI);
        }}
      />

      {/*-------------------------Overlay ---------------------- */}
      <Overlay
        overlayStyle={styles.overlay}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder="Title"
          onChangeText={(value) => setTitle(value)}
          value={title}
        />
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder="Description"
          onChangeText={(value) => setDesc(value)}
          value={desc}
        />
        <Button
          icon={<Ionicons name="location" size={24} color="#001858" />}
          title="Add POI"
          titleStyle={{ color: "#001858", fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "#f582ae",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 10,
          }}
          onPress={() => {
            props.addPoiToList({
              coordinate: coordinate,
              title: title,
              desc: desc,
            });
            {
              /*----------------------------Set list POI by list POI from Redux and new POI-------------------------*/
            }
            AsyncStorage.setItem(
              "listPOI",
              JSON.stringify([
                ...props.listPOIsaved,
                {
                  coordinate: coordinate,
                  title: title,
                  desc: desc,
                },
              ])
            );
            setTitle("");
            setDesc("");
            setAddPOI(false);
            toggleOverlay();
          }}
          
          type="solid"
        />
      </Overlay>
    </View>
  );
}
/*--------------------Balises's styles-------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    height: "80%",
    width: "80%",
  },
});
/*--------------------Component => communicate with Redux and component presentation-------------*/
const mapStateToProps = (state) => {
  return {
    pseudo: state.userPseudo,
    listPOIsaved: state.listPOI,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPoiToList: function (POI) {
      dispatch({ type: "savePOI", newPOI: POI });
    },
    getListPOI: function (listPOI) {
      dispatch({ type: "getListPOI", POIs: listPOI });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
