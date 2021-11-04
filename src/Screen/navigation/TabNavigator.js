import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './../HomeScreen';
import GroupScreen from './../GroupScreen';
import FriendScreen from './../FriendScreen';
import NotificationScreen from './../NotificationScreen';
import ProfileScreen from './../ProfileScreen';
import {StyleSheet, BackHandler} from 'react-native';
import i18n from './../../i18n/i18n';
import SigninAction from '../../redux/actions/signin';
import UserAction from '../../redux/actions/user';
import {connect} from 'react-redux';
import * as RootNavigation from './../../rootNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../api/fetch';
import Config from '../../var/config';
import {DataProvider} from 'recyclerlistview';

const Tab = createBottomTabNavigator();

const handleBackButton = () => {
  BackHandler.exitApp();
  return true;
};

const BottomTabNavigator = (props) => {
  const [notif, setNotif] = useState(0);

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('user').then((uid) => {
      setUserId(JSON.parse(uid).userId);
      let url =
        Config.API_URL_BASE1 +
        Config.API_NOTIFICATION_UNREAD_NUMBER +
        JSON.parse(uid).userId;
      API.get(url)
        .then((res) => {
          let result = res.data.data;
          setNotif(result.length);
        })
        .then((res2) => {})
        .catch((error) => {
          console.log(error.response?.data?.error);
          alert('Oups an error occure');
        });
    });
  }, [notif, props]);
  return (
    <Tab.Navigator
      initialRouteName={'home'}
      backBehavior={'history'}
      lazy={true}
      listeners={{
        focus: () =>
          BackHandler.addEventListener('hardwareBackPress', handleBackButton),
        blur: () =>
          BackHandler.removeEventListener(
            'hardwareBackPress',
            handleBackButton,
          ),
      }}
      detachInactiveScreens={true}
      sceneContainerStyle={styles.tabContainer}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'groups':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'notifications':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'friends':
              iconName = focused
                ? 'ios-people-circle'
                : 'ios-people-circle-outline';
              break;
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#007bff',
        inactiveTintColor: 'gray',
        labelPosition: 'below-icon',
        adaptive: true,
        allowFontScaling: true,
      }}>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{tabBarLabel: i18n.t('icon_home')}}
      />
      <Tab.Screen
        name="groups"
        component={GroupScreen}
        options={{tabBarLabel: i18n.t('icon_groups')}}
      />
      <Tab.Screen
        name="notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: i18n.t('icon_notification'),
          tabBarBadge: notif,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{tabBarLabel: i18n.t('icon_profile')}}
        listeners={{
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            //setNotif(notif + 2);
            if (props.user !== null) {
              RootNavigation.navigate('profile');
            } else {
              props.checkUser();
              RootNavigation.navigate('profile');
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    isLogin: state.userState.isLogin,
    lang: state.userState.lang,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkUser: () => dispatch(UserAction.CheckUserStatus()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: 'white',
  },
});
