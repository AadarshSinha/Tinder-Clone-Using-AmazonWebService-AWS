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
} from 'react-native';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {User} from './models/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {S3Image} from 'aws-amplify-react-native';
import {Picker} from '@react-native-picker/picker';


const ProfileScreen = () => {
  const [Name, setName] = useState('');
  const [Age, setAge] = useState('');
  const [Bio, setBio] = useState('');
  const [Gender, setGender] = useState('');
  const [Uri, setUri] = useState('');
  const [user, setUser] = useState(null);
  const [isPick, setIsPick] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      console.log('sub = ', authUser.attributes.sub);
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );
      console.log('dbusers ', dbUsers);
      if (!dbUsers || dbUsers.length === 0) {
        console.log('This is a new user');
        return;
      }
      const dbUser = dbUsers[0];
      console.log('dbuser ', dbUser);
      setUser(dbUser);
      setName(dbUser.name);
      setBio(dbUser.bio);
      setGender(dbUser.gender);
      setAge(dbUser.age);
      setUri(dbUser.image);
    };
    getCurrentUser();
  }, []);
  // useEffect(() => {
  //   console.log('hello 1');
  //   if (user === null) return;
  //   console.log('hello 2');
  //   setLoading(true);
  // }, [user]);
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

      const blob = await response.blob();

      const urlParts = Uri.split('.');
      const extension = urlParts[urlParts.length - 1];

      const authUser = await Auth.currentAuthenticatedUser();
      const key = `${authUser.attributes.sub}.${extension}`;

      console.log('user uploaded successfully');
      await Storage.put(key, blob);
      return key;
    } catch (e) {
      console.log(e);
    }
  };
  const Submit = async () => {
    console.log('clicked submit');
    if (!check()) {
      console.log('Enter all details');
      return;
    }
    console.log('Current User');
    console.log(user);
    let newImage;
    if (isPick) {
      newImage = await uploadImage();
      // DataStore.clear()
    }
    console.log('newImage = ' + newImage);
    if (!user) {
      console.log('Adding new user data');
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
      console.log('User added successful');
      return;
    }
    console.log('updating user data');
    const updatedUser = User.copyOf(user, updated => {
      updated.name = Name;
      updated.bio = Bio;
      updated.gender = Gender;
      updated.age = Age;
      if (isPick) updated.image = newImage;
    });
    await DataStore.save(updatedUser);

    console.log('updated user to db');
  };
  const logOut = async () => {
    await DataStore.clear();
    try {
      await Auth.signOut();
      window.location.reload();
  } catch (error) {
      console.log('error signing out: ', error);
  }
  };
  const AddImage = () => {
    launchImageLibrary(
      {mediaType: 'mixed'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (didCancel || errorCode) {
          console.warn('canceled or error');
          console.log(errorMessage);
          return;
        }
        setUri(assets[0].uri);
        setIsPick(true);
        console.log('picked image = ' + Uri);
      },
    );
  };
  const showImage = () => {
    if (Uri === '') {
      return <FontAwesome name="user" size={130} color="grey" />;
    }
    if (isPick) {
      return <Image source={{uri: Uri}} style={styles.s3image} />;
    }
    const url = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${Uri}`;
    console.log('url = ' + url);
    return <Image source={{uri: url}} style={styles.s3image} />;

  };

  return (
    <ScrollView style={styles.ProfileContainer}>
        <View alignItems="center">
          <Text style={styles.textt}>Profile Photo</Text>
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
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
        </Picker>
          <Text style={styles.textt}>Bio</Text>
          <TextInput
            style={styles.bio}
            value={Bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
          />
          <View style={styles.profileFooter}>
            <TouchableOpacity style={styles.button} onPress={Submit}>
                <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={logOut}>
              <Text style={styles.text}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ProfileContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
  },
  s3image: {
    width: 200,
    height: 200,
    borderWidth: 1,
    padding: 1,
    borderRadius: 100,
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
