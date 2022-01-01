import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Modal,
  Portal,
  Provider,
  TextInput,
  Card,
  Button,
  DefaultTheme,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import {connect} from 'react-redux';
import I18n from './../i18n/i18n';
import variables from '../var/variables';
import Config from '../var/config';
import API from '../api/fetch';
import API_FILE from '../api/fetchFile';
import UserAction from '../redux/actions/user';

const options = {
  title: I18n.t('select_image'),
  customButtons: [{name: 'fb', title: I18n.t('choose')}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  mediaType: 'photo',
  maxHeight: 1000,
  maxWidth: 600,
};

const ProfileScreen = (props) => {
  const [visible, setVisible] = useState(false);
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [filePath, setFilePath] = useState('');
  const [fileData, setFileData] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [errorPic, setErrorPic] = useState('');
  const [picture, setPicture] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [userBirthday, setUserBirthday] = useState('');
  const [userGender, setUserGender] = useState('M');
  const [userCountry, setUserCountry] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [user, setUser] = useState(null);
  const [isStatisticVisible, setIsStatisticVisible] = useState(false);

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#007bff',
      accent: '#09dfe2',
    },
  };

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setError('');
  };

  const openPictureModal = (val) => {
    //setIsPictureModalVisible(val);
    chooseImage();
  };

  const updateProfileImage = () => {
    setErrorPic('');
    setUpdatingProfile(true);
    if (fileData !== '') {
      let formData: FormData = new FormData();
      formData.append('file', {
        uri: filePath.uri,
        type: filePath.type,
        name: filePath.fileName,
      });
      formData.append('id', props.user.id);

      API_FILE.post(
        Config.API_URL_BASE3 + Config.API_UPDATE_PROFILE_PICTURE,
        formData,
      )
        .then((res) => {
          setUpdatingProfile(false);
          let u = props.user;
          u.photo = res.data.data;
          setUser(u);
          props.isUpdate(u);
          setErrorPic(I18n.t('profile_updated'));
          setTimeout(() => {
            setIsPictureModalVisible(false);
          }, 3000);
        })
        .catch((error) => {
          setUpdatingProfile(false);
          setErrorPic(error.response.data.message);
          setTimeout(() => {
            setIsPictureModalVisible(false);
            setErrorPic('');
          }, 3000);
          console.log(error.response.data);
        });
    }
  };

  useEffect(() => {
    setUser(props.user);
    if (user !== null) {
      setUserAddress(user.address !== null ? user.address : '');
      setUserPhone(user.phone !== null ? user.phone : '');
      setUserCity(user.city !== null ? user.city : '');
      setUserCountry(user.country !== null ? user.country : '');
      setUserGender(user.gender !== null ? user.gender : '');
      setUserBirthday(user.birthDate !== null ? user.birthDate : '');
      setUserDescription(user.description !== null ? user.description : '');
    }
  }, [user]);

  const updateProfile = () => {
    const data = {
      address: userAddress,
      country: userCountry,
      city: userCity,
      gender: userGender,
      phone: userPhone,
      birthDate: userBirthday,
      description: userDescription,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
    };
    setUpdatingProfile(true);
    setError('');
    API.put(
      Config.API_URL_BASE3 + Config.API_UPDATE_PROFILE + props.user.email,
      data,
    )
      .then((res) => {
        const newUser = res.data.data;
        setUser(props.user);
        user.address = newUser.address;
        user.country = newUser.country;
        user.city = newUser.city;
        user.gender = newUser.gender;
        user.phone = newUser.phone;
        user.birthDate = newUser.birthDate;
        user.description = newUser.description;
        user.firstName = newUser.firstName;
        user.lastName = newUser.lastName;
        user.email = newUser.email;
        setUpdatingProfile(false);
        setError(I18n.t('profile_updated'));
        props.isUpdate(user);
        setTimeout(() => {
          hideModal();
        }, 3000);
      })
      .catch((error) => {
        console.log(error.response.data);
        setUpdatingProfile(false);
      });
  };

  const chooseImage = () => {
    setFilePath('');
    setFileData('');
    setFileUri('');
    setPicture('');
    setErrorPic('');
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.error) {
        //console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));s
        //console.log('response', JSON.stringify(response));
        //console.log(response);
        setFilePath(response);
        setFileData(response.data);
        setFileUri(response.uri);
        setPicture(JSON.stringify(response));
        setIsPictureModalVisible(true);
        //const source = {uri: response.uri};
      }
    });
  };

  const hideModalStat = () => {
    setIsStatisticVisible(false);
  };

  return (
    props.user !== null && (
      <SafeAreaView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Avatar.Image
              defaultSource={require('../Image/pre.gif')}
              source={{
                uri:
                  props.user.photo !== null
                    ? Config.API_URL_BASE3 +
                      Config.API_FILE_MINI +
                      props.user.photo.uid
                    : '',
              }}
              size={80}
            />
            <View style={{marginLeft: 20}}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 15,
                    marginBottom: 5,
                  },
                ]}>
                {props.user.firstName} {props.user.lastName}
              </Title>
              <Caption style={styles.caption}>@ {props.user.email}</Caption>
              <Caption style={[styles.caption, {marginTop: 10}]}>
                <Icon name="calendar" color="#777777" size={15} />{' '}
                {props.user.birthDate}
              </Caption>
              <Caption style={[styles.caption, {marginTop: 10}]}>
                <Icon name="gender-male-female" color="#777777" size={15} />{' '}
                {props.user.gender}
              </Caption>
              <View style={{backgroundColor: '#e5e5e5'}}>
                <Button
                  mode="outlined"
                  color={'#007bff'}
                  onPress={() => {
                    openPictureModal(true);
                  }}>
                  {I18n.t('update_picture')}
                </Button>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="flag" color="#777777" size={20} />
            <Text style={{color: '#777777', marginLeft: 20}}>
              {props.user.country}, {props.user.city}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" color="#777777" size={20} />
            <Text style={{color: '#777777', marginLeft: 20}}>
              {props.user.phone}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#777777" size={20} />
            <Text style={{color: '#777777', marginLeft: 20}}>
              {props.user.address}
            </Text>
          </View>
          <View style={[styles.row, {marginLeft: -15}]}>
            <Button
              color={'#007bff'}
              onPress={() => setIsStatisticVisible(true)}>
              <Icon name="chart-line" color="#777777" size={20} />
              <Text style={{color: '#777777', marginLeft: 40}}>
                {I18n.t('statistic')}
              </Text>
            </Button>
          </View>
        </View>

        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <Title>{props.user?.loyaltyPoint}</Title>
            <Caption>{I18n.t('badge_loyalty_point')}</Caption>
          </View>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <Title>
              {props.user.loyalTy != null
                ? props.user.loyalTy.enumLoyaltyPointsType
                : 0}
            </Title>
            <Caption>{I18n.t('badge_loyalty_level')}</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>{props.user?.marketingPoint}</Title>
            <Caption>{I18n.t('badge_marketing_point')}</Caption>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <TouchableRipple onPress={showModal}>
            <View style={styles.menuItem}>
              <Icon name="account-edit" color="#007bff" size={25} />
              <Text style={styles.menuItemText}>
                {I18n.t('update_personal_info')}
              </Text>
            </View>
          </TouchableRipple>
        </View>
        <Provider theme={theme}>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={[styles.modal]}>
              <ScrollView>
                <Card>
                  <Card.Title
                    rightStyle={{marginRight: 20}}
                    title={I18n.t('update_your_profile')}
                    subtitle=""
                    right={() => {
                      return (
                        <TouchableOpacity onPress={() => hideModal()}>
                          <Avatar.Icon size={24} icon="close" />
                        </TouchableOpacity>
                      );
                    }}
                  />
                  <Card.Content>
                    <TextInput
                      label={I18n.t('birth_date')}
                      value={userBirthday}
                      onChangeText={(text) => setUserBirthday(text)}
                    />
                    <DropDownPicker
                      items={[
                        {
                          label: I18n.t('man'),
                          value: 'M',
                        },
                        {
                          label: I18n.t('woman'),
                          value: 'W',
                        },
                      ]}
                      defaultValue={userGender}
                      containerStyle={{height: 50}}
                      style={{
                        backgroundColor: '#ececec',
                        borderBottomEndRadius: 0,
                        borderBottomStartRadius: 0,
                        borderBottomColor: '#9c9c9c',
                        borderBottomWidth: 1,
                      }}
                      itemStyle={{
                        justifyContent: 'flex-start',
                      }}
                      dropDownStyle={{backgroundColor: '#fafafa'}}
                      onChangeItem={(item) => setUserGender(item.value)}
                    />
                    <TextInput
                      label={I18n.t('bio')}
                      value={userDescription}
                      onChangeText={(text) => setUserDescription(text)}
                    />
                    <TextInput
                      label={I18n.t('country')}
                      value={userCountry}
                      onChangeText={(text) => setUserCountry(text)}
                    />
                    <TextInput
                      label={I18n.t('city')}
                      value={userCity}
                      onChangeText={(text) => setUserCity(text)}
                    />
                    <TextInput
                      label={I18n.t('address')}
                      value={userAddress}
                      onChangeText={(text) => setUserAddress(text)}
                    />
                    <TextInput
                      label={I18n.t('phone')}
                      value={userPhone}
                      onChangeText={(text) => setUserPhone(text)}
                    />

                    <View
                      style={{
                        height: 50,
                        backgroundColor: error !== '' ? '#a3cbf6' : 'white',
                        alignItems: 'center',
                        paddingTop: 4,
                      }}>
                      <Text style={{color: 'white', fontSize: 16}}>
                        {error}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Button
                        mode="compact"
                        onPress={() => updateProfile()}
                        style={{marginLeft: variables.deviceWidth / 2.2}}>
                        {I18n.t('update')}
                      </Button>
                      <View style={{height: 50, width: 40, paddingTop: 10}}>
                        <ActivityIndicator
                          animating={updatingProfile}
                          color="#007bff"
                          size="small"
                          style={styles.activityIndicator}
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </ScrollView>
            </Modal>
            <Modal
              visible={isStatisticVisible}
              onDismiss={() => setIsStatisticVisible(false)}
              contentContainerStyle={styles.modal}
              presentationStyle={'fullScreen'}>
              <ScrollView>
                <Card>
                  <Card.Title
                    rightStyle={{marginRight: 20}}
                    title={I18n.t('statistic')}
                    subtitle=""
                    right={() => {
                      return (
                        <TouchableOpacity onPress={() => hideModalStat()}>
                          <Avatar.Icon size={24} icon="close" />
                        </TouchableOpacity>
                      );
                    }}
                  />
                  <Card.Content>
                    <View style={{}}>
                      <Text>{I18n.t('statistic_marketing')}</Text>
                      <LineChart
                        data={{
                          labels: [
                            I18n.t('month_1'),
                            I18n.t('month_2'),
                            I18n.t('month_3'),
                            I18n.t('month_4'),
                            I18n.t('month_5'),
                            I18n.t('month_6'),
                            I18n.t('month_7'),
                            I18n.t('month_8'),
                            I18n.t('month_9'),
                            I18n.t('month_10'),
                            I18n.t('month_11'),
                            I18n.t('month_12'),
                          ],
                          datasets: [
                            {
                              data: props.user.marketingStat,
                            },
                          ],
                        }}
                        width={variables.deviceWidth * 0.95} // from react-native
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                          backgroundColor: '#0ebcef',
                          backgroundGradientFrom: '#4bbae7',
                          backgroundGradientTo: '#63aaf5',
                          decimalPlaces: 1, // optional, defaults to 2dp
                          color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                          labelColor: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                          style: {
                            borderRadius: 16,
                          },
                          propsForDots: {
                            r: '2',
                            strokeWidth: '1',
                            stroke: '#ffffff',
                          },
                        }}
                        bezier
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <Text>{I18n.t('loyalty_marketing')}</Text>
                      <LineChart
                        data={{
                          labels: [
                            I18n.t('month_1'),
                            I18n.t('month_2'),
                            I18n.t('month_3'),
                            I18n.t('month_4'),
                            I18n.t('month_5'),
                            I18n.t('month_6'),
                            I18n.t('month_7'),
                            I18n.t('month_8'),
                            I18n.t('month_9'),
                            I18n.t('month_10'),
                            I18n.t('month_11'),
                            I18n.t('month_12'),
                          ],
                          datasets: [
                            {
                              data: props.user.loyaltyStat,
                            },
                          ],
                        }}
                        width={variables.deviceWidth * 0.95} // from react-native
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                          backgroundColor: '#0ebcef',
                          backgroundGradientFrom: '#4bbae7',
                          backgroundGradientTo: '#63aaf5',
                          decimalPlaces: 1, // optional, defaults to 2dp
                          color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                          labelColor: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                          style: {
                            borderRadius: 16,
                          },
                          propsForDots: {
                            r: '2',
                            strokeWidth: '1',
                            stroke: '#ffffff',
                          },
                        }}
                        bezier
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      />
                    </View>
                  </Card.Content>
                </Card>
              </ScrollView>
            </Modal>
          </Portal>
        </Provider>
      </SafeAreaView>
    )
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
    isUpdate: (user) => dispatch(UserAction.isUpdate(user)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 70,
  },
  infoBox: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  modal: {
    /*height: variables.deviceHeight,*/
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    top: -variables.deviceStatusBar,
    // marginTop: -50,
    // height: variables.workingScreenHeigth,
  },
  stretch: {
    width: 300,
    height: 300,
    resizeMode: 'stretch',
  },
});
