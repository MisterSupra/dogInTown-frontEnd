import { StatusBar } from 'expo-status-bar';
import { CameraView, Camera } from 'expo-camera';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Image,
  Pressable,
  Modal,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from "@react-navigation/native";

const DOG_SIZE_S= 'petit';
const DOG_SIZE_M = 'moyen';
const DOG_SIZE_L = 'grand';

export default function DogSignUpScreen({ navigation }) {

  const userToken = 'RL01aqaWnQNXi24mX3fPzEIONIMIMx6H';

  const photo = 'photo.png';
  	// Reference to the camera
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

	// Permission hooks
	const [hasPermission, setHasPermission] = useState(false);
	const [facing, setFacing] = useState("back");
	const [flashStatus, setFlashStatus] = useState(false);

  
  const handlePhoto = () => {
    setModalIsVisible(true)

  };

	// Functions to toggle camera facing and flash status
	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"));
	};

	const toggleFlashStatus = () => {
		setFlashStatus((current) => (current === false ? true : false));
	};

	// Function to take a picture and save it to the reducer store
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
    (photo && console.log(photo.uri))
    
  }


  const [dogName, setDogName] = useState('');
  const [dogSize, setDogSize] = useState('');
  const [selectedRace, setSelectedRace] = useState();
  const [modalIsVisible, setModalIsVisible] = useState(false);

  //REDUCER
  const user = useSelector((state) => state.user.value.username);

  // Fonction pour naviguer vers le Tab menu
  const handleDogSignup = async (dogRegister) => {
    if (!dogRegister) {
      navigation.navigate('TabNavigator');
      return;
    }
    
    const response = await fetch(`https://dog-in-town-backend.vercel.app/users/dog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userToken: userToken, name: dogName, race: selectedRace, photo: photo, size: dogSize }),
    })
    navigation.navigate('TabNavigator');
  }

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);
  // Conditions to prevent more than 1 camera component to run in the bg
  if (!hasPermission || !isFocused) {
    return <View />;
  }
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.inner}>
        <View style={styles.upperContent}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalIsVisible}
          onRequestClose={() => {
            setModalIsVisible(!modalIsVisible);
            }}>
              <View style={styles.centeredView}>
                  <LinearGradient colors={['#8034eb', '#8034eb', '#8034eb', '#8034eb', '#ebcc34']} style={styles.modalView}>
                     <CameraView style={styles.camera} facing={facing} enableTorch={flashStatus} ref={(ref) => (cameraRef.current = ref)}>
	                   	<SafeAreaView style={styles.settingContainer}>
	                   		<TouchableOpacity style={styles.settingButton} onPress={toggleFlashStatus}>
	                   			<FontAwesome name="flash" size={25} color={flashStatus === true ? "#e8be4b" : "white"} />
	                   		</TouchableOpacity>
	                   		<TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
	                   			<FontAwesome name="rotate-right" size={25} color="white" />
	                   		</TouchableOpacity>
	                   	</SafeAreaView>

	                   	{/* Bottom container with the snap button */}
	                   	<View style={styles.snapContainer}>
	                   		<TouchableOpacity style={styles.snapButton} onPress={takePicture}>
	                   			<FontAwesome name="circle-thin" size={50} color="white" />
	                   		</TouchableOpacity>
	                   	</View>
	                   </CameraView>
                     <TouchableOpacity style={styles.closeModal} onPress={() => setModalIsVisible(false)}>
                       <FontAwesome name='times' size={35} color="white" />
                     </TouchableOpacity>
                  </LinearGradient>
              </View>
        </Modal>
          <View style={styles.leaveContainer}>
            <Pressable onPress={() => handleDogSignup(false)}>
              <View style={styles.textContainer}>
                <Text style={styles.leaveText}>Plus tard</Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bonjour {user}, et si vous nous parliez de votre chien ?</Text>
          </View>
        </View>
        <View style={styles.dogsInfo}>
          <View style={styles.textInputContainer} elevation={5}>
            <TextInput
              style={styles.textInput}
              placeholder="Nom"
              onChangeText={(value) => setDogName(value)}
              value={dogName} />
          </View>
          <View style={styles.pickerContainer} elevation={5}>
            <Picker
              selectedValue={selectedRace}
              style={styles.pickerInput}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRace(itemValue)
              }>
              <Picker.Item label="Race" value="Race" />
              <Picker.Item label="Labrador" value="Labrador" />
              <Picker.Item label="Golden Retriever" value="Golden" />
            </Picker>
          </View>
        </View>
        <View style={styles.dogSize}>
          <View style={styles.sizeTextContainer}>
            <Text style={styles.dogSizeText}>Taille:</Text>
          </View>
          <View style={styles.dogSizeCardContainer}>
            <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_S)}>
              <View style={styles.dogSizeCard}>
                <Image style={{maxHeight: 40, maxWidth: 40, tintColor: dogSize === DOG_SIZE_S ? "#F1AF5A" : "#5B1A10"}} source={require('../assets/Images/petit.png')} />
                <Text>Petit</Text>
              </View>
            </Pressable>
            <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_M)}>
              <View style={styles.dogSizeCard}>
                <Image style={{maxHeight: 50, maxWidth: 50, tintColor: dogSize === DOG_SIZE_M ? "#F1AF5A" : "#5B1A10"}} source={require('../assets/Images/moyen.png')} />
                <Text>Moyen</Text>
              </View>
            </Pressable>
            <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_L)}>
              <View style={styles.dogSizeCard}>
                <Image style={{maxHeight: 100, maxWidth: 100, tintColor: dogSize === DOG_SIZE_L ? "#F1AF5A" : "#5B1A10"}} source={require('../assets/Images/grand.png')} />
                <Text>Grand</Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.dogPicture}>
          <Text style={styles.dogPictureText}>Voulez-vous rajouter une photo ?</Text>
          <View style={styles.dogAvatar}>
            <TouchableOpacity style={styles.photoPressable} onPress={() => handlePhoto()}>
              <FontAwesome name='camera' size={40} color='#A23D42' />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => handleDogSignup(true)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </ScrollView >
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 15,
  },
  upperContent: {
    width: '100%',
    paddingTop: 30,
  },
  leaveContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // backgroundColor: '#5B1A10',
    width: 80,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    color: '#5B1A10',
    textAlign: 'center',
  },
  dogsInfo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  textInputContainer: {
    width: '80%',
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    fontSize: 18,
    paddingHorizontal: 15,
  },
  pickerContainer: {
    width: '80%',
    height: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pickerInput: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    fontSize: 18,
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
  dogAvatar: {
    height: 150,
    width: 150,
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#5B1A10',
  },
  dogPictureText: {
    fontSize: 25,
    color: '#5B1A10',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: 50,
    backgroundColor: '#A23D42',
    borderRadius: 18,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 700,
  },
  leaveText: {
    color: '#5B1A10',
    fontSize: 18,
    // fontWeight: 600,
  },
  photoPressable: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // MODAL STYLE
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 0,
    margin: 20,
    backgroundColor: 'white',
    paddingBottom: 25,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    height: '60%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '100%',
    backgroundColor: '#e66351'
  },
  // Camera 
  camera: {
    width: '120%',
    aspectRatio: 1 / 1,
    paddingTop: 5,
    justifyContent: "space-between",
    overflow: 'hidden',
	},
	settingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 40,
	},
	settingButton: {
		width: 40,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	snapContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	snapButton: {
		width: 100,
		aspectRatio: 1,
		alignItems: "center",
    justifyContent: "flex-end",
    opacity: 0.8,
	},
 
});
