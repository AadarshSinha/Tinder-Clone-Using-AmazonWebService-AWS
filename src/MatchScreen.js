import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity,Text, SafeAreaView,Alert,ActivityIndicator} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches, ChatUsers} from './models';
import Card2 from './Card2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MatchScreen = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setCurrentUser(dbUsers[0]);
      
      } catch (error) {
        Alert.alert("Error")
      }
    };
    getCurrentUser();
  }, []);
  const getDisplayUsers = async () => {
    try {
    const dbUsers = await DataStore.query(WaitlingList, u =>
      u.user2('eq', currentUser.sub),
    );
    if (!dbUsers ) {
      return;
    }

      setLoading(false);

    setUsers(dbUsers);
      
    } catch (error) {
      Alert.alert("Error")
    }
  };
  useEffect(() => {
    if (currentUser === null || currentUser.length === 0) return;
    getDisplayUsers();
  }, currentUser);
  const handleLike = async () => {
    try {
      const checkExistingMatch = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
          .and(u3 =>
              u3.user1('eq', currentUser.sub).user2('eq', users[index].user1),
            )
            .and(u4 =>
              u4.user1('eq', users[index].user1).user2('eq', currentUser.sub),
              ),
              ),
              );
              if (checkExistingMatch.length !== 0) {
                console.log('user alredy matched');
                setIndex((index + 1) % users.length);
                return;
              }
            } catch (error) {
              Alert.alert("Error");
              return;
    }
    try {
      const checkRepeat = await DataStore.query(WaitlingList, u =>
        u.user1('eq', currentUser.sub).user2('eq', users[index].user1),
      );
      if (checkRepeat.length !== 0) {
        console.log('user alredy liked');
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {
      Alert.alert("Error");
      return;
    }
    try {
      const checkMatch = await DataStore.query(WaitlingList, u =>
        u.user1('eq', users[index].user1).user2('eq', currentUser.sub),
      );
      if (checkMatch.length === 0) {
        try {
          console.log(users)
          const newWait = new WaitlingList({
            user1: currentUser.sub,
            user2: users[index].user1,
          });
          await DataStore.save(newWait);
        } catch (error) {
          Alert.alert("Error");
          return;
        }
        console.log('no new matches');
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {

      Alert.alert("Error");
      return;
    }
    console.log('This is a new matches');
    try {
      const newMatch = new Matches({
        user1: currentUser.sub,
        user2: users[index].user1,
      });
      await DataStore.save(newMatch);
    } catch (error) {

      Alert.alert("Error");
      return;
    }
    try {
      await DataStore.delete(WaitlingList, u =>
        u.user1('eq', users[index].user1).user2('eq', currentUser.sub),
      );
    } catch (error) {

      Alert.alert("Error");
      return;
    }
    setIndex((index + 1) % users.length);
  };
  const handleDislike = async () => {
    console.log('dislike');
    // console.log(currentUser.sub, ' ', users[index].user1);
    try {
      const checkExistingMatch = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
            .and(u3 =>
              u3.user1('eq', currentUser.sub).user2('eq', users[index].user1),
            )
            .and(u4 =>
              u4.user1('eq', users[index].user1).user2('eq', currentUser.sub),
            ),
        ),
      );
      if (checkExistingMatch.length !== 0) {
        console.log('user is matched , deleting it');
        try {
          await DataStore.delete(Matches, u1 =>
            u1.user2('eq', currentUser.sub).user1('eq', users[index].user1),
          );
        } catch (error) {

          Alert.alert("Error");
          return;
        }
        try {
          await DataStore.delete(Matches, u =>
            u.user1('eq', currentUser.sub).user2('eq', users[index].user1),
          );
        } catch (error) {

          Alert.alert("Error");
          return;
        }
        console.log('creating new waiting');
        try {
          const newWait = new WaitlingList({
            user2: currentUser.sub,
            user1: users[index].user1,
          });
          await DataStore.save(newWait);
        } catch (error) {

          Alert.alert("Error");
          return;
        }
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {

      Alert.alert("Error");
      return;
    }
    try {
      await DataStore.delete(WaitlingList, u =>
        u.user1('eq', currentUser.sub).user2('eq', users[index].user1),
      );
    } catch (error) {

      Alert.alert("Error");
      return;
    }
    setIndex((index + 1) % users.length);
  };
  const handleSkip = () => {
    setIndex((index + 1) % users.length);
  }
  if(loading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  if(users===null || users.length===0 ){
   return (
    <View style={styles.nouserContainer}>
      <Text style={styles.Title1}>Users Who Already Liked You</Text>
       <Text style={styles.nouser1}>Opps..</Text>
       <Text style={styles.nouser2}>No Users to Show</Text>
    </View>
   ) 
  }
  return (
    <SafeAreaView style={styles.DisplayContainer}>
      <Text style={styles.Title}>Users Who Already Liked You</Text>
      {!loading && <Card2 user={users[index]} />}
      {!loading && users.length!=0 && <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={handleDislike}>
          <Entypo
            name="cross"
            size={40}
            color="#A65CD2"
            style={styles.button}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <FontAwesome
            name="refresh"
            size={43}
            color="#F6BE00"
            style={styles.button1}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLike}>
          <AntDesign
            name="heart"
            size={40}
            color="#4FCC94"
            style={styles.button}
          />
        </TouchableOpacity>
      </View>}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Title:{
    width:'100%',
    color:'#F76C6B',
    fontSize:20,
    fontWeight:'800',
    textAlign:'center',
    position:'absolute',
    top:70,
  },
  Title1:{
    width:'100%',
    color:'#F76C6B',
    fontSize:20,
    fontWeight:'800',
    textAlign:'center',
    position:'absolute',
    top:10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    height: 70,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  button1: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    paddingLeft:12,
  },
  DisplayContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    paddingTop: 80,
  },
  nouser1:{
    color:'#F76C6B',
    fontSize:80,
    fontWeight:'800'
  },
  nouser2:{
    color:'#F76C6B',
    fontSize:40,
  },
  nouserContainer:{
    width:'100%',
    height:'60%',
    alignItems:'center',
    justifyContent:'center',
  },
});
export default MatchScreen;
