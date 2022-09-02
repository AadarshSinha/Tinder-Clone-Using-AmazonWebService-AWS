import {Auth} from 'aws-amplify';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
const LoginPage = ({setLoading}) => {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState(0);
  const [screen, setScreen] = useState('signin');
  const SignIn = async () => {
    try {
      const response = await Auth.signIn(number, password);
      console.log(response);
      // setLoading(false);
    } catch (e) {
      Alert.alert('Ops..', e.message);
    }
  };
  const resendOTP = async() => {
    try {
        await Auth.resendSignUp(number);
        Alert.alert("OTP sent successfully");
  } catch (e) {
      Alert.alert( e.message);
  }
  };
  const Continue = async () => {
    try {
        await Auth.forgotPassword(number);
        setScreen('verifyOld');
    } catch (e) {
      Alert.alert( e.message);
  }
  };
  const Verify = async () => {
      if(screen==='verifyNew'){
          try {
              const response = await Auth.confirmSignUp(number, otp);
              console.log(response);
              setNumber('')
              setPassword('')
              setOTP(0)
              setScreen('signin');
              Alert.alert("User created successfully");
        } catch (e) {
            Alert.alert( e.message);
        }
    }
    else {
        try {
            const response = await Auth.forgotPasswordSubmit(number, otp , password);
            console.log(response);
            setNumber('')
            setPassword('')
            setOTP(0)
            setScreen('signin');
            Alert.alert("Password reset successfully");
      } catch (e) {
          Alert.alert( e.message);
      }
    }
};
  const Register = async () => {
      try {
          const response = await Auth.signUp({
            username: number, 
            password: password
        });
          console.log(response);
          setScreen('verifyNew');
      } catch (e) {
        Alert.alert('Ops..', e.message);
      }
  };
  return (
    <View style={styles.container}>
      {screen === 'signin' && <Text style={styles.head}>Sign In</Text>}
      {screen === 'register' && <Text style={styles.head}>New User</Text>}
      {screen === 'forgot' && <Text style={styles.head}>Registered No.</Text>}
      {(screen === 'verifyNew' || screen === 'verifyOld') && (
        <Text style={styles.head}>Verify</Text>
      )}
      {screen === 'signin' && (
        <>
          <TextInput
            style={styles.textInput}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter Email Id"
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            placeholderTextColor="grey"
          />
          <TouchableOpacity style={styles.button} onPress={SignIn}>
            <Text style={styles.text}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => (
              setScreen('register'), setNumber(''), setPassword('')
            )}>
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => (
              setScreen('forgot'), setNumber(''), setPassword('')
            )}>
            <Text style={styles.text}>Forgot Password</Text>
          </TouchableOpacity>
        </>
      )}
      {screen === 'forgot' && (
        <>
          <TextInput
            style={styles.textInput}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter Email Id"
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter New Password"
            placeholderTextColor="grey"
          />
          <TouchableOpacity style={styles.button} onPress={Continue}>
            <Text style={styles.text}>continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => (
              setScreen('signin'), setNumber(''), setPassword('')
            )}>
            <Text style={styles.text}>Sign In</Text>
          </TouchableOpacity>
        </>
      )}
      {screen === 'register' && (
        <>
          <TextInput
            style={styles.textInput}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter Email Id"
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            placeholderTextColor="grey"
          />
          <TouchableOpacity style={styles.button} onPress={Register}>
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => (
              setScreen('signin'), setNumber(''), setPassword('')
            )}>
            <Text style={styles.text}>Sign In</Text>
          </TouchableOpacity>
        </>
      )}
      {(screen === 'verifyNew' || screen === 'verifyOld') && (
        <>
          <TextInput
            style={styles.textInput}
            value={otp}
            onChangeText={setOTP}
            placeholder="Enter OTP"
            placeholderTextColor="grey"
          />
          <TouchableOpacity style={styles.button} onPress={Verify}>
            <Text style={styles.text}>Verify</Text>
          </TouchableOpacity>
          {screen==='verifyNew'&&<TouchableOpacity style={styles.button} onPress={resendOTP}>
            <Text style={styles.text}>Resend</Text>
          </TouchableOpacity>}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F76C6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '70%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 10,
    elevation: 10,
    padding: 10,
    color: 'black',
  },
  button: {
    // width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 40,
    elevation: 3,
    backgroundColor: 'orange',
    marginTop: 10,
    paddingHorizontal: 20,
    elevation: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
  },
  head: {
    fontSize: 50,
    marginBottom: 30,
    color: 'white',
  },
});
export default LoginPage;
