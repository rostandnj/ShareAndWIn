import React, {useState, createRef} from 'react';
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
  Alert,
} from 'react-native';
import I18n from '../i18n/i18n';
import Config from '../var/config';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from './Components/Loader';
import API from '../api/fetch';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const ResetScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert(I18n.t('fill_email'));
      return;
    }
    setLoading(true);
    let dataToSend = {email: userEmail};
    API.post(
      Config.API_URL_BASE1 + Config.API_RESET_PASSWORD + '/' + userEmail,
      {},
    )
      .then((res) => {
        setLoading(false);
        if ([201, 200].includes(res.status)) {
          Alert.alert(
            '',
            I18n.t('password_link_sent'),
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.replace('Auth');
                },
              },
            ],
            {cancelable: false},
          );
          // AsyncStorage.setItem('user_id', res.data.id);
          // navigation.replace('Auth');
        } else {
          setErrortext(I18n.t('login_error'));
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrortext(I18n.t('login_error'));
        console.log(error.response.data);
      });
  };

  return (
    <View style={styles.mainBody}>
      <LinearGradient
        colors={['#007bff', '#6AD2F7', '#6AD2F7']}
        style={styles.linearGradient}>
        <Loader loading={loading} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View>
            <KeyboardAvoidingView style={{marginTop: -100}} enabled>
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
              {errortext !== '' ? (
                <Text style={styles.errorTextStyle}> {errortext} </Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>{I18n.t('reset')}</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default ResetScreen;

const iconStyles = {
  borderRadius: 10,
  iconStyle: {paddingVertical: 5},
};

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
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
    marginTop: 15,
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
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
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
    margin: 20,
    marginTop: 5,
    marginBottom: 30,
  },
  textBtn: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginTop: 5,
    marginBottom: 30,
  },
});
