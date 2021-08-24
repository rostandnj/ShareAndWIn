import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Image, Alert} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import API from '../api/fetch';
import API_FILE from '../api/fetchFile';
import Config from '../var/config';
import I18n from '../i18n/i18n';
import UserAction, {isLogin} from '../redux/actions/user';
import {connect} from 'react-redux';

const SplashScreen = (props) => {
  const [user, setUser] = useState(null);
  const [animating, setAnimating] = useState(true);
  //props.checkUser();
  useEffect(() => {
    AsyncStorage.getItem('user').then((userToken) => {
      //console.log(userToken);
      if (userToken !== null) {
        let url = Config.API_URL_BASE1 + Config.API_USER_PROFILE;
        API.defaults.headers.Authorization =
          'Bearer ' + JSON.parse(userToken).accessToken;
        API_FILE.defaults.headers.Authorization =
          'Bearer ' + JSON.parse(userToken).accessToken;
        API.get(url)
          .then((res) => {
            API.get(
              Config.API_URL_BASE4 + Config.API_Loyality + res.data.data.id,
            )
              .then((res2) => {
                res.data.data.loyalTy = res2.data.data;
                //setUser(res.data.data);
                props.isLogin(res.data.data, 'en');
                props.navigation.navigate('DrawerNavigationRoutes');
              })
              .then((res2) => {})
              .catch((error) => {
                console.log(error.response.data);
              });
          })
          .catch((error) => {
            console.log(error.response.data);
            Alert.alert(
              'Message',
              error.response.data.error,
              [{text: 'OK', onPress: () => {}}],
              {cancelable: true},
            );
            props.navigation.navigate('Auth');
          });
      } else {
        props.navigation.navigate('Auth');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#007bff', '#6AD2F7', '#6AD2F7']}
        style={styles.linearGradient}>
        <Image
          source={require('../Image/aboutreact.png')}
          style={{
            width: '90%',
            resizeMode: 'contain',
            margin: 30,
            marginTop: '35%',
          }}
        />
        <ActivityIndicator
          animating={animating}
          color="#FFFFFF"
          size="large"
          style={styles.activityIndicator}
        />
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    isLogin: (user, lang) => dispatch(UserAction.isLogin(user, lang)),
    logout: () => dispatch(UserAction.logout()),
    checkUser: () => dispatch(UserAction.CheckUserStatus()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
