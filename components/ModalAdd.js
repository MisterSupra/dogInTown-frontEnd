import React from "react";
import { View, Platform, KeyboardAvoidingView, Modal, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { DogAdd } from "../components/DogAdd";
import { useFonts } from 'expo-font'; // FONT

export const ModalAdd = ({ visible, onClose, onValidate }) => {
  // export de la font
  useFonts({
    "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
    "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
    "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    });
    
  return (
	  <Modal
	  	key={visible}
    	style={styles.modal}
    	animationType="fade"
    	transparent={true}
    	visible={visible}
    	onRequestClose={onClose}
	>
      <View style={styles.contenuModal}>
        <TouchableOpacity  onPress={onClose} style={styles.close}>
          <FontAwesome
            alignSelf="center"
            name="close"
            size={20}
            color="gray"
          />
        </TouchableOpacity>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <DogAdd added={onValidate} />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {},
  contenuModal: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
    height: "90%",
    margin: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  close: {
    justifyContent: 'center',
    // backgroundColor: 'red',
	  height: 60,
    width: 60,
    borderRadius: 100,
    position: "absolute",
    top: -10,
    right: -5,
  },
});