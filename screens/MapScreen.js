import { StatusBar } from 'expo-status-bar';
import {KeyboardAvoidingView, Platform, Dimensions, Pressable,  StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker, } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window'); //dimension de l'écran


export default function MapScreen() {
  // etat du input recherches
  const [recherches, setRecherches] = useState('');
  // etat modal
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({});
  const [places, setPlaces] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dogSize, setDogSize] = useState('');
  const [firstComment, setFirstComment] = useState('');


  //Fonction pour sélectionner la taille du chien et changé la couleur de l'image selectionné
  const handleDogSize = (size) => {
    setDogSize(size);
  }

  // Trouver notre position actuel
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
          });
      }
    })();
  }, []);

  // FONCTION POUR TROUVER UN LIEU SUR L'API GOOGLE PLACE

  // CAN ONLY SEARH ONCE FOR ME  >>>>>>>>>>>>> GAB
  // DES FOIS NOMS ET ADRESSE DU PRECEDENT FETCH SUR LE PIN MAIS POSITION CORRECTE   !!!!!!!!!!!!!!!
  const searchPlace = async () => {
    if (!searchText.trim().length) return;

    console.log('Recherche:', searchText);
    const apiKey = 'AIzaSyB3-IGZvc4auyC94pY8GvmAAP34AsU43SE';
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}&key=${apiKey}`;

    try {
      const response = await fetch(googleApiUrl);
      const data = await response.json();

      
      if (data.status === 'OK' && data.results.length > 0) {
        const placeData = data.results[0]; // Obtenir juste le premier résultat (pour avoir seulement 1 lieu)
        setPlaces(placeData);  // enregistre la data du lieu recherché dans l'état places
        console.log(placeData);  // log des données pour voir la structure de la réponse
        setModalVisible(false);
        setSearchText('');
        setFirstComment('');
      } else {
        console.log('Pas de résultats trouvé', data.status);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MapView mapType="standard" style={styles.map} initialRegion={{
        latitude: 45.75,
        longitude: 4.85,
        latitudeDelta: 1.0,
        longitudeDelta: 1.0,
      }}>
        {currentPosition && currentPosition.latitude && currentPosition.longitude && (
          <Marker coordinate={currentPosition} pinColor="#fecb2d" title="Vous êtes ici" />
        )}
        {places && places.geometry && places.geometry.location && (
          <Marker
            coordinate={{
              latitude: places.geometry.location.lat,
              longitude: places.geometry.location.lng,
            }}
            title={places.name}
            description={places.formatted_address}
          />
        )}
      </MapView>
      <View style={styles.blocRecherches}>
        <FontAwesome name='sliders' color='#525252' style={styles.icons} />
        <TextInput
          style={styles.recherches}
          placeholder='Rechercher'
          onChangeText={(value) => setRecherches(value)}
          value={recherches}
        />
        <FontAwesome name='search' color='#525252' style={styles.icons} />
      </View>
      {!modalVisible && <View style={styles.zoneBouton}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.boutonPatoune} activeOpacity={0.8}>
          <Image style={styles.patte} source={require('../assets/Images/Patoune5B1A10Empty.png')} />
        </TouchableOpacity>
      </View>}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.contenuModal}>
          <View style={styles.fenetre}>
            <Text>Vous voulez rajouter un lieu ?</Text>
            <View style={styles.searchBox}>
              <Text style={styles.searchBoxField}>Nom:</Text>
              <TextInput style={styles.addSearchInput} onChangeText={(value) => setSearchText(value)} value={searchText} autoCapitalize="sentences" />
            </View>
            <View style={styles.dogSize}>
              <View style={styles.sizeTextContainer}>
                <Text style={styles.dogSizeText}>Taille:</Text>
              </View>
              <View style={styles.dogSizeCardContainer}>
                <Pressable style={styles.dogSizeCard} onPress={() => handleDogSize('petit')}>
                  <View style={styles.dogSizeCard}>
                    <Image style={styles.imageSmall} source={require('../assets/Images/petit.png')} />
                    <Text>Petit</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.dogSizeCard} onPress={() => handleDogSize('moyen')}>
                  <View style={styles.dogSizeCard}>
                    <Image style={styles.imageMid} source={require('../assets/Images/moyen.png')} />
                    <Text>Moyen</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.dogSizeCard} onPress={() => handleDogSize('grand')}>
                  <View style={styles.dogSizeCard}>
                    <Image style={styles.imageBig} source={require('../assets/Images/grand.png')} />
                    <Text>Grand</Text>
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={styles.firstCommentContainer}>
              <TextInput placeholder='laissez nous un avis!' onChangeText={(value) => setFirstComment(value)} value={firstComment} autoCapitalize="sentences" style={styles.firstCommentTextInput}></TextInput>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={searchPlace} >
                <Text style={styles.buttonLabel}>Ajoutez le lieu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#97C7DE',
  },
  map: {
    height: height,
    width: width,
  },
  blocRecherches: {
    top: '10%',
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: '85%',
    height: 60,

  },
  recherches: {
    width: '70%',
    height: '100%',
    marginLeft: '3%',
    marginRight: '3%',

  },
  icons: {
    fontSize: 22,
  },
  zoneBouton: {
    position: 'absolute',
    top: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  boutonPatoune: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
 
  },
  patte: {
    height: 150,
    width: 150,
  },
  /// STYLE MODAL AJOUT DE LIEU ////
  contenuModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  fenetre: {
    backgroundColor: '#F1AF5A',
    width: '90%',
    height: '75%',
    minHeight: '75%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSearchInput: {
    marginLeft: 20,
    height: 40,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '80%',
    height: 60,
    backgroundColor: '#FCE9D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dogSize: {
    height: 130,
    // backgroundColor: 'orange',
    marginVertical: 10,
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
    // backgroundColor: 'yellow',
  },
  dogSizeCard: {
    alignItems: 'center',
  },
  imageSmall: {
    maxHeight: 40,
    maxWidth: 40,
  },
  imageMid: {
    maxHeight: 50,
    maxWidth: 50,
  },
  imageBig: {
    maxHeight: 100,
    maxWidth: 100,
  },
  firstCommentContainer: {

  },
  firstCommentTextInput: {

  },
});