import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches} from './models';
import DisplayMatches from './DisplayMatches';
import DisplayMessage from './DisplayMessage';
import Messanger from './Messanger';
const ChatScreen = () => {
  const [matches, setMatches] = useState([]);
  const [userSub, setUserSub] = useState(null);
  const [loverSub, setLoverSub] = useState(null);
  const [isChatting, setIsChatting] = useState(false);
  useEffect(() => {
    const getMatchedUsers = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      // console.log(authUser.attributes.sub)
      setUserSub(authUser.attributes.sub);
      const dbUsers = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
            .user1('eq', authUser.attributes.sub)
            .user2('eq', authUser.attributes.sub),
        ),
      );
      // console.log(dbUsers)
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setMatches(dbUsers);
    };
    getMatchedUsers();
  }, []);
  useEffect(() => {
    if (loverSub == null) return;
    console.log('you click on your lover ', loverSub);
    setIsChatting(true);
  }, loverSub);
  if (isChatting)
    return (
      <Messanger
        setIsChatting={setIsChatting}
        setLoverSub={setLoverSub}
        to={loverSub}
        from={userSub}
      />
    );
  return (
    <View style={styles.container}>
      <Text style={styles.head}>Your Matches</Text>
      <ScrollView horizontal={true} style={styles.scroll}>
        {matches.length != 0 &&
          matches.map(match => (
            <DisplayMatches
              sub={match.user1 === userSub ? match.user2 : match.user1}
              key={match.id}
              setLoverSub={setLoverSub}
            />
          ))}
      </ScrollView>
      <Text style={styles.head}>Messages</Text>
      <ScrollView style={styles.message} horizontal={false}>
        {matches.length != 0 &&
          matches.map(match => (
            <DisplayMessage
              sub={match.user1 === userSub ? match.user2 : match.user1}
              key={match.id}
              setLoverSub={setLoverSub}
            />
          ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '90%',
    // backgroundColor:'green',
  },
  scroll: {
    width: '100%',
    marginTop: 10,
    // backgroundColor:'yellow',
  },
  head: {
    color: '#F76C6B',
    fontSize: 25,
    marginLeft: 10,
    fontWeight: '800',
  },
  message: {
    width: '100%',
    height: '70%',
    marginTop: 10,
    flexDirection: 'column',
  },
});
export default ChatScreen;
