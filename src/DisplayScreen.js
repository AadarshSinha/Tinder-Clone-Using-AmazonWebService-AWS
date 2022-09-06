import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches, ChatUsers} from './models';
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
  }, []);
  const getDisplayUsers = async () => {
    const dbUsers = await DataStore.query(User, u =>
      u.sub('ne', currentUser.sub).gender('ne', currentUser.gender),
    );
    if (!dbUsers || dbUsers.length === 0) {
      return;
    }
    setUsers(dbUsers);
    setLoading(false);
  };
  useEffect(() => {
    if (currentUser === null || currentUser.length === 0) return;
    getDisplayUsers();
  }, currentUser);
  const handleLike = async () => {
    const checkExistingMatch = await DataStore.query(Matches, u1 =>
      u1.or(u2 =>
        u2
          .and(u3 =>
            u3.user1('eq', currentUser.sub).user2('eq', users[index].sub),
          )
          .and(u4 =>
            u4.user1('eq', users[index].sub).user2('eq', currentUser.sub),
          ),
      ),
    );
    if (checkExistingMatch.length !== 0) {
      console.log('user alredy matched');
      setIndex((index + 1) % users.length);
      return;
    }
    const checkRepeat = await DataStore.query(WaitlingList, u =>
      u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
    );
    if (checkRepeat.length !== 0) {
      console.log('user alredy liked');
      setIndex((index + 1) % users.length);
      return;
    }
    const checkMatch = await DataStore.query(WaitlingList, u =>
      u.user1('eq', users[index].sub).user2('eq', currentUser.sub),
    );
    if (checkMatch.length === 0) {
      const newWait = new WaitlingList({
        user1: currentUser.sub,
        user2: users[index].sub,
      });
      await DataStore.save(newWait);
      console.log('no new matches');
      setIndex((index + 1) % users.length);
      return;
    }
    console.log('This is a new matches');
    const newMatch = new Matches({
      user1: currentUser.sub,
      user2: users[index].sub,
    });
    await DataStore.save(newMatch);
    await DataStore.delete(WaitlingList, u =>
      u.user1('eq', users[index].sub).user2('eq', currentUser.sub),
      );
      setIndex((index + 1) % users.length);
    };
    const handleDislike = async () => {
      console.log('dislike');
      // console.log(currentUser.sub, ' ', users[index].sub);
      const checkExistingMatch = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
          .and(u3 =>
            u3.user1('eq', currentUser.sub).user2('eq', users[index].sub),
            )
            .and(u4 =>
              u4.user1('eq', users[index].sub).user2('eq', currentUser.sub),
          ),
      ),
    );
    if (checkExistingMatch.length !== 0) {
      console.log('user is matched , deleting it');
      await DataStore.delete(Matches, u1 =>
        u1.user2('eq', currentUser.sub).user1('eq', users[index].sub),
        );
        await DataStore.delete(Matches, u =>
          u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
          );
          console.log("creating new waiting")
          const newWait = new WaitlingList({
            user2: currentUser.sub,
            user1: users[index].sub,
          });
          await DataStore.save(newWait);
          setIndex((index + 1) % users.length);
          return;
        }
        await DataStore.delete(WaitlingList, u =>
      u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
    );
    setIndex((index + 1) % users.length);
  };
  return (
    <SafeAreaView style={styles.DisplayContainer}>
      {!loading && <Card user={users[index]}/>}
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
