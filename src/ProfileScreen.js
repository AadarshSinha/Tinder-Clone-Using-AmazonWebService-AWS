import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {User, Feedback} from './models/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import FeedbackForm from './FeedbackForm';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Card from './Card';

const ProfileScreen = ({setIsNew, setScreen,isNew}) => {
  const [Name, setName] = useState('');
  const [Age, setAge] = useState('');
  const [Bio, setBio] = useState('');
  const [Gender, setGender] = useState('FEMALE');
  const [Uri, setUri] = useState('');
  const [user, setUser] = useState(null);
  const [isPick, setIsPick] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [isFeedback, setIsFeedback] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if(isNew) BackHandler.exitApp()
      else {
        setScreen('display');
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();

        const dbUsers = await DataStore.query(User, u =>
          u.sub('eq', authUser.attributes.sub),
        );
        if (!dbUsers || dbUsers.length === 0) {
          console.log('This is a new user');
          setUser([]);
          return;
        }
        console.log('This is a old user');
        const dbUser = dbUsers[0];
        setUser(dbUser);
        setName(dbUser.name);
        setBio(dbUser.bio);
        setGender(dbUser.gender);
        setAge(dbUser.age);
        setUri(dbUser.image);
      } catch (error) {
        Alert.alert('Error');
      }
    };
    getCurrentUser();
  }, []);
  const check = () => {
    if (Name === '') return false;
    if (Age === '') return false;
    if (Uri === '') return false;
    if (Bio === '') return false;
    if (Gender === '') return false;
    return true;
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(Uri);
      const Blob = await response.blob();
      console.log(Blob);
      const urlParts = Uri.split('.');
      const extension = urlParts[urlParts.length - 1];
      const unique = moment();
      const authUser = await Auth.currentAuthenticatedUser();
      const key = `${authUser.attributes.sub}/${unique}.${extension}`;
      await Storage.put(key, Blob);
      console.log('user added to s3 successfully');
      return key;
    } catch (e) {
      console.log(e);
      Alert.alert(e.message);
    }
  };
  const AddImage = () => {
    launchImageLibrary(
      {mediaType: 'mixed', quality: 0.25},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (didCancel || errorCode) {
          console.warn('canceled or error');
          console.log(errorMessage);
          return;
        }
        setUri(assets[0].uri);
        setIsPick(true);
        console.log('picked image = ' + assets[0].uri);
      },
    );
  };
  const Submit = async () => {
    console.log('clicked submit');
    if (!check()) {
      if (Uri === '') {
        Alert.alert('Add a Profile Photo');
        return;
      }
      console.log('Enter all details');
      Alert.alert('Enter all details');
      return;
    }
    setIsUpdating(true);
    console.log('Current User');
    console.log(user);
    let newImage = Uri;
    if (isPick) {
      try {
        newImage = await uploadImage();
      } catch (error) {
        console.log(error);
        Alert.alert('Error');
      }
      // DataStore.clear()
    }
    console.log('newImage = ' + newImage);
    if (user.length === 0) {
      console.log('Adding new user data');
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        const newUser = new User({
          sub: authUser.attributes.sub,
          name: Name,
          bio: Bio,
          gender: Gender,
          age: Age,
          image: newImage,
        });
        await DataStore.save(newUser);
        setUser(newUser);
        setIsNew(false);
        Alert.alert('Updated Successfully');
        setIsUpdating(false);
        console.log('User added successful');
      } catch (error) {
        console.log(error);
        Alert.alert('Error');
      }
      return;
    }
    console.log('updating user data');
    try {
      const updatedUser = User.copyOf(user, updated => {
        updated.name = Name;
        updated.bio = Bio;
        updated.gender = Gender;
        updated.age = Age;
        updated.image = newImage;
      });
      await DataStore.save(updatedUser);
    } catch (error) {
      console.log(error);
      Alert.alert('Error');
      return;
    }
    Alert.alert('Updated Successfully');
    setIsUpdating(false);
    console.log('update successful');
  };
  const logOut = async () => {
    // await DataStore.clear();
    Auth.signOut();
  };
  const showImage = () => {
    if (Uri === '') {
      return (
        <View style={styles.NoUser}>
          <FontAwesome name="user" size={300} color="grey" />
        </View>
      );
    }
    if (isPick) {
      return <Image source={{uri: Uri}} style={styles.s3image} />;
    }
    const url = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${Uri}`;
    console.log(url);
    return <Image source={{uri: url}} style={styles.s3image} />;
  };

  if (zoom) {
    return (
      <>
          <Card user={user} />
        <MaterialCommunityIcons
          name="card-text"
          size={35}
          color="grey"
          style={styles.card1}
          onPress={() => {
            setZoom(!zoom);
          }}
        />
      </>
    );
  }
  if (isFeedback) {
    return <FeedbackForm setIsFeedback={setIsFeedback} />;
  }
  if (user === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ScrollView style={styles.ProfileContainer}>
      <View alignItems="center" style={{width: '100%', height: '100%'}}>
        <Text style={styles.textt}>Profile Photo</Text>
        <MaterialCommunityIcons
          name="card-text"
          size={35}
          color="grey"
          style={styles.card}
          onPress={() => {
            setZoom(!zoom);
          }}
        />
        <SkeletonPlaceholder style={styles.skeleton}>
          <View style={styles.imageContainer}></View>
        </SkeletonPlaceholder>
        {showImage()}
        <Pressable onPress={AddImage}>
          <Ionicons name="add-circle" size={35} color="#F76C6B" />
        </Pressable>
        <Text style={styles.textt}>Name</Text>
        <TextInput style={styles.name} value={Name} onChangeText={setName} />
        <Text style={styles.textt}>Age</Text>
        <TextInput
          style={styles.age}
          value={Age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <Text style={styles.textt}>Gender</Text>
        <Picker
          label="Gender"
          style={styles.gender}
          selectedValue={Gender}
          onValueChange={itemValue => setGender(itemValue)}>
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Male" value="MALE" />
        </Picker>
        <Text style={styles.textt}>Bio</Text>
        <TextInput
          style={styles.bio}
          value={Bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={styles.button} onPress={Submit}>
          <Text style={styles.text}>
            {isUpdating ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsFeedback(!isFeedback)}>
          <Text style={styles.text}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={logOut}>
          <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
      </View>
      {isUpdating && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  card1: {
    position: 'absolute',
    right: 30,
    top: 95,
    paddingHorizontal: 2,
    elevation:20,
    backgroundColor:'white',
    borderRadius:10,
  },
  card: {
    position: 'absolute',
    right: 30,
    top: 15,
    padding: 5,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
  },
  NoUser: {
    width: 300,
    height: 300,
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'red',
    top: 10,
    borderRadius: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    top: 50,
    backgroundColor: 'white',
  },
  skeleton: {
    position: 'relative',
  },
  imageContainer: {
    height: 300,
    width: 300,
    borderRadius: 150,
  },
  ProfileContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  s3image: {
    width: 300,
    height: 300,
    borderWidth: 1,
    padding: 1,
    borderRadius: 150,
    position: 'absolute',
    top: 50,
  },
  name: {
    width: '92%',
    padding: 10,
    height: 60,
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#b5b5b5',
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    elevation: 10,
  },
  age: {
    width: '92%',
    padding: 10,
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#b5b5b5',
    color: 'black',
    fontSize: 20,
    elevation: 10,
  },
  gender: {
    width: '92%',
    padding: 10,
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#b5b5b5',
    color: 'black',
    fontSize: 20,
    elevation: 10,
  },

  bio: {
    width: '92%',
    padding: 10,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#b5b5b5',
    color: 'black',
    fontSize: 20,
    elevation: 10,
  },
  button: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: '#F76C6B',
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textt: {
    width: '92%',
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
export default ProfileScreen;
