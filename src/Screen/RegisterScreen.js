// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Loader from './Components/Loader';
import I18n from '../i18n/i18n';
import Config from '../var/config';
import API from '../api/fetch';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
const RegisterScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistrationSuccess, setisRegistrationSuccess] = useState(false);

  const firstNameInputRef = createRef();
  const lastNameInputRef = createRef();
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const confirmPasswordInputRef = createRef();

  const handleSubmitButton = () => {
    setErrortext('');
    if (!firstName) {
      alert(I18n.t('please_fill') + I18n.t('firstname'));
      return;
    }
    if (!lastName) {
      alert(I18n.t('please_fill') + I18n.t('lastname'));
      return;
    }
    if (!email) {
      alert(I18n.t('please_fill') + I18n.t('email'));
      return;
    }
    if (!password) {
      alert(I18n.t('please_fill') + I18n.t('password'));
      return;
    }
    if (!confirmPassword) {
      alert(I18n.t('please_fill') + I18n.t('confirm_password'));
      return;
    }
    if (confirmPassword !== password) {
      alert(I18n.t('password_mismatch'));
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };
    API.post(Config.API_URL_BASE2 + Config.API_REGISTER, dataToSend)
      .then((res) => {
        setLoading(false);
        if ([201, 200].includes(res.status)) {
          setisRegistrationSuccess(true);
        } else {
          setErrortext(I18n.t('registration_error'));
          console.log('registration_error');
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrortext(error.response.data.message);
        console.log(error.response.data);
      });
  };
  if (isRegistrationSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../Image/success.png')}
          style={{height: 150, resizeMode: 'contain', alignSelf: 'center'}}
        />
        <Text style={styles.successTextStyle}>{I18n.t('registration_ok')}</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>{I18n.t('login_now')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF', marginTop: -10}}>
      <LinearGradient
        colors={['#007bff', '#6AD2F7', '#6AD2F7']}
        style={styles.linearGradient}>
        <Loader loading={loading} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../Image/aboutreact.png')}
              style={{
                width: '50%',
                height: 80,
                resizeMode: 'contain',
                margin: 30,
              }}
            />
          </View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(value) => setFirstName(value)}
                underlineColorAndroid="#f000"
                placeholder={I18n.t('firstname')}
                placeholderTextColor="#ffffff"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  firstNameInputRef.current && firstNameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(value) => setLastName(value)}
                underlineColorAndroid="#f000"
                placeholder={I18n.t('lastname')}
                placeholderTextColor="#ffffff"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  lastNameInputRef.current && lastNameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(value) => setEmail(value)}
                underlineColorAndroid="#f000"
                placeholder={I18n.t('email')}
                placeholderTextColor="#ffffff"
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current && emailInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(value) => setPassword(value)}
                underlineColorAndroid="#f000"
                placeholder={I18n.t('password')}
                placeholderTextColor="#ffffff"
                secureTextEntry={true}
                ref={passwordInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(value) => setConfirmPassword(value)}
                underlineColorAndroid="#f000"
                placeholder={I18n.t('confirm_password')}
                placeholderTextColor="#ffffff"
                secureTextEntry={true}
                ref={confirmPasswordInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  confirmPasswordInputRef.current &&
                  confirmPasswordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitButton}>
              <Text style={styles.buttonTextStyle}>{I18n.t('register')}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
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
    marginBottom: 20,
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
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});
