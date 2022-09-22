import React, {useEffect, useState} from 'react';
import {
  Text,
  Safe,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  setInterval,
  clearInterval,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import {Amplify, Hub, Auth, DataStore} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import HomeScreen from './src/HomeScreen';
import LoginPage from './src/LoginPage';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});
const App = () => {
  const [loading, setLoading] = useState(true);
  const [curUser, setCurUser] = useState(undefined);
  const [sync,setSync]=useState(false)
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });
      setCurUser(authUser);
    } catch (e) {
      setCurUser(null);
    }
  };
  useEffect(()=>{SplashScreen.hide();},[])
  useEffect(() => {
    checkUser();
  }, []);
  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut'){
        checkUser();
        if(data.payload.event === 'signOut')setSync(true);
      }
    };
    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);
  if (curUser === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <SafeAreaView style={style.home}>
      {curUser ? (
        <HomeScreen sync={sync} />
      ) : (
        <LoginPage setLoading={setLoading} />
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});
export default App;

// export const onCreateChatData = /* GraphQL */ `
//   subscription onCreateChatData {
//     onCreateChatData {
//       id
//       from
//       to
//       message
//     }
//   }
// `;
// export const onUpdateChatUsers = /* GraphQL */ `
//   subscription onUpdateChatUsers {
//     onUpdateChatUsers {
//       id
//       from
//       to
//       message
//     }
//   }
// `;
// export const onCreateChatUsers = /* GraphQL */ `
//   subscription onCreateChatUsers {
//     onCreateChatUsers {
//       id
//       from
//       to
//       message
//     }
//   }
// `;
// export const onCreateBlock = /* GraphQL */ `
//   subscription onCreateBlock {
//     onCreateBlock {
//       id
//       by
//       to
//     }
//   }
// `;
// export const onDeleteBlock = /* GraphQL */ `
//   subscription onDeleteBlock {
//     onDeleteBlock {
//       id
//       by
//       to
//     }
//   }
// `;
// ./gradlew bundleRelease
// npx react-native run-android --variant=release