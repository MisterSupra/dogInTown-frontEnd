import React from 'react';
import { StyleSheet, Pressable, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState} from 'react';


const DOG_SIZE_S = 'petit';
const DOG_SIZE_M = 'moyen';
const DOG_SIZE_L = 'grand';

const PopUpAddPlace = ({ addPlaceName, placeToAdd, setModalVisible, setPlaces, userToken }) => {

    const [dogSize, setDogSize] = useState('petit'); //taille du chien
    const [firstComment, setFirstComment] = useState(''); //contenu d'un premier commentaire


    //Fonction pour ajouter à la BDD un nouveau lieu
    const handleAddingPlace = async (place) => {
        try {
          if (firstComment !== '') {
            const responseComment = await fetch(`https://dog-in-town-backend.vercel.app/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: firstComment, token: userToken }),
            });
            const result = await responseComment.json();
            const responsePlace = await fetch(`https://dog-in-town-backend.vercel.app/places/addPlace`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: place.name,
                token: result.comment.token,
                userToken : userToken,
                type: place.types[0],
                adress: place.formatted_address,
                size: dogSize,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }),
            });
          } else {
            const responsePlace = await fetch(`https://dog-in-town-backend.vercel.app/places/addPlace`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: place.name,
                type: place.types[0],
                userToken : userToken,
                adress: place.formatted_address,
                size: dogSize,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }),
            });
          }
          setDogSize(DOG_SIZE_S);
          setPlaces([]);
          setFirstComment('');
        } catch (error) {
          console.error('Erreur lors de l\'ajout du lieu:', error);
        } finally {
          setModalVisible(false); 
        }
      };

    return (
        <KeyboardAvoidingView style={styles.fenetre}>
            <Pressable style={styles.leaveContainer}>
                <FontAwesome name='times-circle' size={30} color='black' onPress={() => setModalVisible(false)} />
            </Pressable>
            <Text style={styles.addModalTitle}>Ce lieu est un espace dog friendly ?</Text>
            <View style={styles.searchBox}>
                <Text style={styles.searchBoxField}>{addPlaceName}</Text>
            </View>
            <View style={styles.dogSize}>
                <View style={styles.sizeTextContainer}>
                    <Text style={styles.dogSizeText}>Taille de chien accepté:</Text>
                </View>
                <View style={styles.dogSizeCardContainer}>
                    <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_S)}>
                        <View style={styles.dogSizeCard}>
                            <Image style={{ maxHeight: 40, maxWidth: 40, tintColor: dogSize === DOG_SIZE_S ? "#A23D42" : "#5B1A10" }} source={require('../assets/Images/petit.png')} />
                            <Text>Petit</Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_M)}>
                        <View style={styles.dogSizeCard}>
                            <Image style={{ transform:[{scaleX: -1}], maxHeight: 50, maxWidth: 50, tintColor: dogSize === DOG_SIZE_M ? "#A23D42" : "#5B1A10" }} source={require('../assets/Images/moyen.png')} />
                            <Text>Moyen</Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_L)}>
                        <View style={styles.dogSizeCard}>
                            <Image style={{ maxHeight: 100, maxWidth: 100, tintColor: dogSize === DOG_SIZE_L ? "#A23D42" : "#5B1A10" }} source={require('../assets/Images/grand.png')} />
                            <Text>Grand</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
            <View style={styles.firstCommentContainer}>
                <TextInput placeholder='Laissez un premier avis sur ce lieu!' onChangeText={(value) => setFirstComment(value)} value={firstComment} autoCapitalize="sentences" style={styles.firstCommentTextInput}></TextInput>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleAddingPlace(placeToAdd)}>
                <View >
                    <Text style={styles.buttonLabel}>Ajouter</Text>
                </View>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};



/// STYLE MODAL AJOUT DE LIEU ////
const styles = StyleSheet.create({

    fenetre: {
        backgroundColor: '#F1AF5A',
        width: '90%',
        height: '75%',
        minHeight: '75%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    buttonContainer: {
        width: '80%',
        height: 60,
        backgroundColor: '#FCE9D8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaveContainer: {
        position: 'relative',
        bottom: '3%',
        left: '38%',
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    dogSize: {
        height: 140,
        // backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dogSizeText: {
        marginLeft: 8,
        fontSize: 20,
        color: '#5B1A10',
    },
    dogPicture: {
        height: 310,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // backgroundColor: 'red',
        marginTop: 20,
    },
    sizeTextContainer: {
        height: 50,
        width: '100%',
        backgroundColor: 'puprle',
    },
    dogSizeCardContainer: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginRight: '12%',
    },
    dogSizeCard: {
        alignItems: 'center',
    },
    firstCommentContainer: {
        backgroundColor: 'white',
        height: '20%',
        width: '80%',
        borderRadius: 15,
    },
    firstCommentTextInput: {
    },
    addModalTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: '#5B1A10',
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 600,
        color: '#5B1A10',
    },
    searchBoxField: {
        fontSize: 22,
        fontWeight: 700,
    },
})

export default PopUpAddPlace;
