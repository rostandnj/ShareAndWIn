import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import I18n from '../i18n/i18n';
import Config from '../var/config';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from './../rootNavigation';

import Loader from './Components/Loader';
import API from '../api/fetch';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import SigninAction from './../redux/actions/signin';
import UserAction from './../redux/actions/user';
import isPlainObject from 'react-redux/lib/utils/isPlainObject';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginButton, AccessToken} from 'react-native-fbsdk-next';

const LoginScreen = (props) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const passwordInputRef = createRef();
  GoogleSignin.configure({
    androidClientId: Config.google.client_id,
    iosClientId:
      '27879685572-eep2uth12psgsmehghjkmie06f0mscau.apps.googleusercontent.com',
  });

  const loginGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //If login is successful you'll get user info object in userInfo below I'm just printing it to console. You can store this object in a usestate or use it as you like user is logged in.
      if (userInfo.user !== undefined) {
        console.log(userInfo.user);
        props.signinOne(userInfo.user.id);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert(I18n.t('canceled_signin'));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert(I18n.t('google_signin_in_process'));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert(I18n.t('play_service_not_vailable'));
      } else {
        alert(I18n.t('google_signin_wrong') + error.message);
      }
    }
  };
  const loginFacebook = () => {};

  useEffect(() => {
    if (isPlainObject(props.data)) {
      AsyncStorage.setItem('user', JSON.stringify(props.data)).then((r) => {
        API.defaults.headers.common.Authorization =
          'Bearer ' + props.data.accessToken;
        RootNavigation.navigate('DrawerNavigationRoutes');
      });
    }
  }, [props.data]);

  const handleSubmitPress = () => {
    props.signin(userEmail, userPassword);
  };

  return (
    <View style={styles.mainBody}>
      <LinearGradient
        colors={['#007bff', '#6AD2F7', '#6AD2F7']}
        style={styles.linearGradient}>
        <Loader loading={props.isLoading} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View>
            <KeyboardAvoidingView style={{marginTop: -50}} enabled>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../Image/logo.png')}
                  style={{
                    width: '50%',
                    height: 80,
                    resizeMode: 'contain',
                    margin: 30,
                  }}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                  placeholder={I18n.t('email')} //dummy@abc.com
                  placeholderTextColor="#ffffff"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                  placeholder={I18n.t('password')} //12345
                  placeholderTextColor="#ffffff"
                  keyboardType="default"
                  ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              {props.errorMsg !== '' ? (
                <Text style={styles.errorTextStyle}> {props.errorMsg} </Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>{I18n.t('login')}</Text>
              </TouchableOpacity>
              <View style={[styles.textBtn, {}]}>
                <Icon.Button
                  style={{width: '100%', flexDirection: 'row'}}
                  name="google"
                  borderRadius={30}
                  backgroundColor="#DD4B39"
                  onPress={() => loginGoogle()}>
                  {I18n.t('login_google')}
                </Icon.Button>
              </View>
              <View style={styles.textBtn}>
                <Text
                  style={styles.registerTextStyle}
                  onPress={() => RootNavigation.navigate('RegisterScreen')}>
                  {I18n.t('register')}
                </Text>
                <Text
                  style={styles.registerTextStyle}
                  onPress={() => RootNavigation.navigate('ResetScreen')}>
                  {I18n.t('reset_password')}
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    hasError: state.signin.hasError,
    isLoading: state.signin.isLoading,
    signed: state.signin.signed,
    errorMsg: state.signin.errorMsg,
    errorField: state.signin.errorField,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signin: (email, password) => dispatch(SigninAction.signin(email, password)),
    signinOne: (email, password) => dispatch(SigninAction.signinOne(email)),
    isLogin: (user, lang) => dispatch(UserAction.isLogin(user, lang)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#007bff',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#007bff',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#ffffff',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#ffffff',
  },
  registerTextStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 15,
  },
  textBtn: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginTop: 5,
    marginBottom: 30,
  },
});
