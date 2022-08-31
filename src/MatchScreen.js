import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches} from './models';
import Card from './Card';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const DisplayScreen = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setCurrentUser(dbUsers[0]);
    };
    getCurrentUser();
    const getDisplayUsers = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('ne', authUser.attributes.sub).gender('eq', 'Male'),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setUsers(dbUsers);
    };
    getDisplayUsers();
  }, []);
  useEffect(() => {
    if (users === null) return;
    setLoading(false);
  }, [users]);
  const handleLike = async () => {
    console.log('like');
    const checkRepeat = await DataStore.query(WaitlingList, u =>
      u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
    );
    if (!(!checkRepeat || checkRepeat.length === 0)) {
      console.log('user alredy liked');
      setIndex((index + 1) % users.length);
      return;
    }
    const newWait = new WaitlingList({
      user1: currentUser.sub,
      user2: users[index].sub,
    });
    await DataStore.save(newWait);
    const checkMatch = await DataStore.query(WaitlingList, u =>
      u.user1('eq', users[index].sub).user2('eq', currentUser.sub),
    );
    if (!checkMatch || checkMatch.length === 0) {
      console.log('No new matches');
      setIndex((index + 1) % users.length);
      return;
    }
    console.log('This is a new matches');
    const newMatch = new Matches({
      user1: currentUser.sub,
      user2: users[index].sub,
    });
    await DataStore.save(newMatch);
    setIndex((index + 1) % users.length);
  };
  const handleDislike = async () => {
    console.log('dislike');
    await DataStore.delete(WaitlingList, u =>
      u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
    );
    await DataStore.delete(Matches, u =>
      u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
    );
    await DataStore.delete(Matches, u =>
      u.user2('eq', currentUser.sub).user1('eq', users[index].sub),
    );
    setIndex((index + 1) % users.length);
  };
  return (
    <SafeAreaView style={styles.DisplayContainer}>
      {!loading && <Card user={users[index]} />}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={handleDislike}>
          <Entypo
            name="cross"
            size={40}
            color="#A65CD2"
            style={styles.button}
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
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  DisplayContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    paddingTop: 80,
  },
});
export default DisplayScreen;
