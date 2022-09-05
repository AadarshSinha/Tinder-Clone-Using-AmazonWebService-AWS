import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Auth, DataStore, API} from 'aws-amplify';
import {User, WaitlingList, Matches, ChatUsers, ChatData} from './models';
import ChatMessage from './ChatMessage';
import {onCreateChatData} from './models/schema';

const Messanger = ({setIsChatting, setLoverSub, from, to}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [lover, setLover] = useState(null);
  const [msg, setMsg] = useState(null);
  const [chatContent, setChatContent] = useState([]);
  useEffect(() => {
    const getCurrentUsers = async () => {
      const dbUsers = await DataStore.query(User, u1 => u1.sub('eq', from));
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setCurrentUser(dbUsers[0]);
    };
    getCurrentUsers();
  }, []);
  useEffect(() => {
    const getLover = async () => {
      const dbUsers = await DataStore.query(User, u1 => u1.sub('eq', to));
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setLover(dbUsers[0]);
    };
    getLover();
  }, []);
  useEffect(() => {
    const subscription = API.graphql({
      query: onCreateChatData,
    }).subscribe({
      next: data => {
        const newMsg = data.value.data.onCreateChatData;
        if (
          !(
            (newMsg.from === from && newMsg.to === to) ||
            (newMsg.from === to && newMsg.to === from)
            )
            ) {
              return;
            }
            console.log('newMsg = ', newMsg);
        setChatContent(chatContent => [newMsg, ...chatContent]);
      },
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const getMessages = async () => {
      const dbUsers = await DataStore.query(
        ChatData,
        u1 =>
          u1.or(u2 =>
            u2
              .and(u3 => u3.from('eq', from).to('eq', to))
              .and(u4 => u4.from('eq', to).to('eq', from)),
          ),
        {sort: s => s.createdAt()},
      );
      console.log('Messages = ', dbUsers);
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setChatContent(dbUsers);
    };
    getMessages();
  }, []);
  const updateData = async () => {
    if(chatContent.length==0){
      const temp = new ChatUsers({
          from:from,
          to:to,
          message:msg
        });
        await DataStore.save(temp);
        console.log("created new user")
      }
      else{
        const updateUser=await DataStore.query(ChatUsers, u1 =>
          u1.or(u2 =>
          u1.or(u2 => u2.and(u3=>u3.from('eq',from).to('eq',to)).and(u4=>u4.from('eq',to).to('eq',from))),
          ),
        );
        const updatedUser = User.copyOf(updateUser[0], updated => {
  
          updated.message=msg;
        });
        await DataStore.save(updatedUser);
        console.log("updated user")
  
      }
  }
  const display = () => {
    const url = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${lover.image}`;
    return <Image source={{uri: url}} style={styles.image} />;
  };
  const handleBack = () => {
    setLoverSub(null);
    setIsChatting(false);
  };
  const handleSend = async () => {
    if (msg == '') return;
    updateData()
    const currentMsg = new ChatData({
      from: from,
      to: to,
      message: msg,
    });
    await DataStore.save(currentMsg);
    setMsg('');
    console.log('Added new message');
  };
  if (lover === null) return;
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Pressable onPress={handleBack} style={styles.back}>
          <Ionicons name="chevron-back-outline" size={50} color="white" />
        </Pressable>
        {display()}
        <Text style={styles.namee}>{lover.name}</Text>
      </View>
      <FlatList
        data={chatContent}
        renderItem={({item}) => (
          <ChatMessage item={item} from={currentUser} to={lover} />
        )}
        inverted
        style={styles.content}
      />
      <View style={styles.bottom}>
        <TextInput
          style={styles.input}
          value={msg}
          onChangeText={setMsg}
          multiline
          numberOfLines={3}
          placeholder="Send message"
          placeholderTextColor="grey"
        />
        <Pressable onPress={handleSend}>
          <Ionicons name="send" size={50} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    color: 'black',
    marginBottom: 80,
    marginTop: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#b5b5b5',
  },
  navbar: {
    width: '100%',
    height: 100,
    backgroundColor: '#F76C6B',
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomEndRadius: 20,
    // borderBottomLeftRadius: 20,
    top: 0,
    // display: 'none',
  },
  back: {
    marginLeft: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginLeft: 10,
  },
  namee: {
    marginLeft: 20,
    fontSize: 30,
    fontWeight: '800',
    color: 'white',
  },
  bottom: {
    width: '100%',
    height: 80,
    backgroundColor: '#F76C6B',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    justifyContent: 'space-evenly',
    // display: 'none',
  },
  input: {
    backgroundColor: 'white',
    width: '70%',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 10,
    color: 'black',
  },
});
export default Messanger;
