import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
  SectionList,
  FlatList,
  Alert,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import variables from '../var/variables';
import API from '../api/fetch';
import Config from '../var/config';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressBar from 'react-native-progress/Bar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SceneMap, TabBar} from 'react-native-tab-view';
import {HScrollView} from 'react-native-head-tab-view';
import {CollapsibleHeaderTabView} from 'react-native-tab-view-collapsible-header';
import {DefaultTheme, Portal, Provider} from 'react-native-paper';

import {
  Button as ButtonPaper,
  Card,
  IconButton,
  Paragraph,
} from 'react-native-paper';
import I18n from '../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScaledImage from '../Components/ScaledImage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import ViewMoreText from 'react-native-view-more-text';
const Tab = createMaterialTopTabNavigator();
const defaultUser =
  'data:image/png;base64,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';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007bff',
    accent: '#09dfe2',
  },
};
const GroupScreen = () => {
  const SECTIONS = [
    {
      title: I18n.t('suggested'),
      horizontal: true,
      data: [],
    },
  ];
  const [sections, setSections] = useState(SECTIONS);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMoreGroup, setLoadingMoreGroup] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [pageMyGroupNo, setPageMyGroupNo] = useState(0);
  const [pageNoGroupMember, setPageNoGroupMember] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [lastGroupSize, setLastGroupSize] = useState(0);
  const [lastMemberGroupSize, setLastMemberGroupSize] = useState(0);
  const [membersGroup, setMembersGroup] = useState(0);
  const [lastSuggested, setLastSuggested] = useState(0);
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [suggestedGroup, setSuggestedGroup] = useState([]);
  const [suggestedGroupStarted, setSuggestedGroupStarted] = useState(false);
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );
  const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
  };
  const layoutProvider = new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = variables.deviceWidth * 0.95;
      dim.height = Platform.OS === 'ios' ? 95 : 95;
    },
  );

  const [dataProvider2, setDataProvider2] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );
  const layoutProvider2 = new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = variables.deviceWidth * 0.51;
      dim.height = Platform.OS === 'ios' ? 190 : 190;
    },
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([{key: 'first', title: I18n.t('my_groups')}]);
  const [modalSuggestedVisible, setModalSuggestedVisible] = useState(false);
  const [modalGroupMemberVisible, setModalGroupMemberVisible] = useState(false);
  const [displayedSuggestedGroup, setDisplayedSuggestedGroup] = useState(null);
  const [displayedMemberGroup, setDisplayedMemberGroup] = useState(null);
  const layoutProviderUser = new LayoutProvider(
    (index) => {
      if (index === 0) {
        return 1;
      } else {
        return ViewTypes.FULL;
      }
    },
    (type, dim) => {
      dim.width = variables.deviceWidth;
      dim.height = Platform.OS === 'ios' ? 80 : 80;
    },
  );

  const [dataProviderUser, setDataProviderUser] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );

  const [openOffer, setOpenOffer] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then((uid) => {
      setUserId(JSON.parse(uid).userId);
      if (!hasLoaded) {
        setLoading(true);
        let url =
          Config.API_URL_BASE4 +
          Config.API_USER_GROUPS +
          JSON.parse(uid).userId +
          '&pageSize=' +
          pageSize +
          '&pageno=' +
          pageMyGroupNo +
          '&sortby=id';
        API.get(url)
          .then((res) => {
            let result = res.data.data.content;
            console.log(result.length);
            setHasLoaded(true);
            setLoading(false);
            setLastGroupSize(result.length);
            setGroups(result);
            setPageMyGroupNo(pageMyGroupNo + 1);
            setDataProvider(dataProvider.cloneWithRows(result));
          })
          .then((res2) => {})
          .catch((error) => {
            setHasLoaded(true);
            setLoading(false);
            console.log(error);
          });

        changingScreen(1);

        /*API.get(
          Config.API_URL_BASE4 +
            Config.API_ALL_GROUPS +
            '?pageSize=' +
            pageSize +
            '&pageno=' +
            pageNo +
            '&sortby=id',
        )
          .then((res) => {
            let result = res.data.data.content;
            setHasLoaded(true);
            setLoading(false);
            setSuggestedGroup(result);
            let s = sections;
            s.data = result;
            setSections(s);
            //setTotalPage(res.data.data.totalPage);
            //setPageNo(pageNo + 1);
          })
          .then((res2) => {})
          .catch((error) => {
            setHasLoaded(true);
            setLoading(false);
            console.log(error.response?.data?.error);
            alert('Oups an error occur');
          });*/
      }
    });
  }, [hasLoaded]);
  const rowRendererOld = (type, item, index) => {
    return (
      <View style={{width: variables.deviceWidth * 0.499, height: 210}}>
        <Card
          style={{
            alignItems: 'center',
            borderWidth: 0,
            backgroundColor: '#fdfdfd',
            borderRadius: 5,
            margin: 2,
          }}>
          <Card.Cover
            source={{
              uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
            }}
            style={{
              padding: 0,
              margin: 0,
              borderRadius: 0,
              height: 120,
              width: variables.deviceWidth * 0.499 - 4,
            }}
            defaultSource={require('../Image/pre.gif')}
          />
          <Card.Content
            style={{
              width: '100%',
              marginLeft: '-3%',
              marginBottom: 1,
              marginTop: 10,
              height: 40,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}} numberOfLines={1}>
              {item?.name}
            </Text>
          </Card.Content>
          <Card.Actions
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingLeft: '2%',
              paddingRight: '2%',
              paddingBottom: '2%',
              marginTop: -15,
            }}>
            <ButtonPaper
              contentStyle={{
                width: (variables.deviceWidth * 0.45) / 2,
              }}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="account-group"
              mode="outlined"
              onPress={() => console.log(index)}>
              {item.numberOfMembers === null ? 0 : item.numberOfMembers}
            </ButtonPaper>
            <ButtonPaper
              contentStyle={{width: (variables.deviceWidth * 0.45) / 2}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="message-text"
              mode="outlined"
              onPress={() => console.log('Pressed')}>
              0
            </ButtonPaper>
          </Card.Actions>
        </Card>
      </View>
    );
  };
  const ListItemOriginal = ({item}) => {
    return (
      <View style={styles.item}>
        <Image
          source={{
            uri: item.uri,
          }}
          style={styles.itemPhoto}
          resizeMode="cover"
        />
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
    );
  };
  const ListItem = ({item}, index) => {
    return (
      <Card
        style={{
          alignItems: 'center',
          borderWidth: 0,
          backgroundColor: '#fdfdfd',
          borderRadius: 5,
          margin: 2,
          width: variables.deviceWidth * 0.499,
        }}>
        <Card.Cover
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          style={{
            padding: 0,
            margin: 0,
            borderRadius: 0,
            height: 120,
            width: variables.deviceWidth * 0.499 - 4,
          }}
          defaultSource={require('../Image/pre.gif')}
        />
        <Card.Content
          style={{
            width: '100%',
            marginLeft: '-3%',
            marginBottom: 1,
            marginTop: 10,
            height: 40,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}} numberOfLines={1}>
            {item?.name}
          </Text>
        </Card.Content>
        <Card.Actions
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: '2%',
            paddingRight: '2%',
            paddingBottom: '2%',
            marginTop: -15,
          }}>
          <ButtonPaper
            contentStyle={{
              width: (variables.deviceWidth * 0.45) / 2,
            }}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="account-group"
            mode="outlined"
            onPress={() => console.log(index)}>
            {item.numberOfMembers === null ? 0 : item.numberOfMembers}
          </ButtonPaper>
          <ButtonPaper
            contentStyle={{width: (variables.deviceWidth * 0.45) / 2}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="message-text"
            mode="outlined"
            onPress={() => console.log('Pressed')}>
            0
          </ButtonPaper>
        </Card.Actions>
      </Card>
    );
  };
  const rowRendererUser = (type, item, index) => {
    const user = item.user;
    return (
      <View style={styles.containerComment}>
        <TouchableOpacity disabled={true}>
          <Image
            style={styles.image}
            source={{
              uri:
                user !== null && user.photo !== null
                  ? Config.API_URL_BASE3 + Config.API_FILE_MINI + user.photo.uid
                  : defaultUser,
            }}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.name}>
              {user?.firstName + ' ' + user?.lastName}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const rowRenderer2 = (type, item, index) => {
    return (
      <Card
        style={{
          alignItems: 'center',
          borderWidth: 0,
          backgroundColor: '#fdfdfd',
          borderRadius: 5,
          margin: 2,
          width: variables.deviceWidth * 0.499,
        }}>
        <Card.Cover
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          style={{
            padding: 0,
            margin: 0,
            borderRadius: 0,
            height: 100,
            width: variables.deviceWidth * 0.499 - 4,
          }}
          defaultSource={require('../Image/pre.gif')}
        />
        <Card.Content
          style={{
            width: '100%',
            marginLeft: '-3%',
            marginBottom: 1,
            marginTop: 10,
            height: 40,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={{fontSize: 12, fontWeight: 'normal'}} numberOfLines={1}>
            {item?.description}
          </Text>
        </Card.Content>
        <Card.Actions
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: '2%',
            paddingRight: '2%',
            paddingBottom: '2%',
            marginTop: 1,
          }}>
          <ButtonPaper
            contentStyle={{width: variables.deviceWidth * 0.45}}
            labelStyle={{fontSize: 11}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            mode="outlined"
            onPress={() => displaySuggestedGroup(item)}>
            {I18n.t('show')}
          </ButtonPaper>
        </Card.Actions>
      </Card>
    );
  };
  const rowRenderer = (type, item, index) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 0,
          width: '100%',
          borderBottomColor: '#efefef',
          borderTopColor: '#efefef',
          borderBottomWidth: 1,
          borderTopWidth: 1,
          paddingVertical: 5,
          paddingHorizontal: 5,
        }}>
        <Image
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          defaultSource={require('../Image/pre.gif')}
          style={{
            width: '25%',
            height: 80,
            alignSelf: 'center',
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              height: '40%',
              marginHorizontal: 5,
              marginVertical: 0,
              backgroundColor: 'transparent',
              paddingTop: 0,
            }}>
            <Text
              numberOfLines={1}
              style={{
                // flex: 1,
                fontSize: 16,
                fontWeight: 'bold',
                // fontFamily: 'sans-serif',
                marginBottom: 2,
                color: '#000',
              }}>
              {item?.name.length <= 35 ? item?.name : item?.name.substr(0, 55)}
            </Text>
            <Text
              style={{fontSize: 12, fontWeight: 'normal'}}
              numberOfLines={1}>
              {item?.description}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              height: 50,
              marginHorizontal: 5,
              paddingTop: 0,
              alignItems: 'flex-end',
              backgroundColor: 'transparent',
              marginTop: 10,
            }}>
            <ButtonPaper
              contentStyle={{width: 50}}
              labelStyle={{fontSize: 12}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="message-text"
              mode="text"
              onPress={() => console.log('Pressed')}>
              {item.numberOfOffers === null ? 0 : item.numberOfOffers}
            </ButtonPaper>
            <Text>{''}</Text>
            <ButtonPaper
              contentStyle={{width: 50}}
              style={{marginRight: 10}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="account-group"
              mode="text"
              onPress={() => displayMemberGroup(item)}>
              {item.numberOfMembers === null ? 0 : item.numberOfMembers}
            </ButtonPaper>
          </View>
        </View>
      </View>
    );
  };
  const loadMoreGroup = () => {
    if (!loadingMoreGroup) {
      console.log(pageMyGroupNo);
      setLoadingMoreGroup(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_USER_GROUPS +
        userId +
        '&pageSize=' +
        pageSize +
        '&pageno=' +
        pageMyGroupNo +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data.content;
          result.forEach((e) => {
            groups.push(e);
          });
          setGroups(groups);
          setDataProvider(dataProvider.cloneWithRows(groups));
          setLoadingMoreGroup(false);
          setPageMyGroupNo(pageMyGroupNo + 1);
          setLastGroupSize(result.length);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoadingMoreGroup(false);
          console.log(error);
        });
    }
  };
  const loadMoreSuggested = () => {
    if (!loadingMoreGroup && lastSuggested >= pageSize) {
      setLoadingMoreGroup(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_ALL_GROUPS +
        '?pageSize=' +
        pageSize +
        '&pageno=' +
        pageNo +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data.content;
          setLastSuggested(result.length);
          setLoadingMoreGroup(false);
          result.forEach((e) => {
            suggestedGroup.push(e);
          });
          setSuggestedGroup(suggestedGroup);
          setDataProvider2(dataProvider2.cloneWithRows(suggestedGroup));
          setPageNo(pageNo + 1);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoadingMoreGroup(false);
          console.log(error);
          console.log(error.response);
        });
    }
  };
  const renderMyGroupFooter = () => {
    if (lastGroupSize >= pageSize) {
      return (
        <View
          style={{
            height: 60,
            width: variables.deviceWidth,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <ButtonPaper
            contentStyle={{height: 35}}
            labelStyle={{fontSize: 11}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            mode="outlined"
            onPress={() => loadMoreGroup()}>
            {I18n.t('loading_more')}
          </ButtonPaper>
        </View>
      );
    } else {
      return <></>;
    }
  };
  const renderSuggestedFooter = () => {
    if (lastSuggested >= pageSize) {
      return (
        <View
          style={{
            height: 50,
            width: variables.deviceWidth,
            alignItems: 'center',
            paddingTop: 15,
          }}>
          <ButtonPaper
            contentStyle={{}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            mode="text"
            onPress={() => loadMoreSuggested()}>
            {I18n.t('loading_more')}
          </ButtonPaper>
        </View>
      );
    } else {
      return <></>;
    }
  };
  function MyGroup() {
    return (
      <View style={[styles.scene, {backgroundColor: '#fff'}]}>
        {dataProvider2.getSize() > 0 && (
          <RecyclerListView
            layoutProvider={layoutProvider}
            isHorizontal={false}
            dataProvider={dataProvider}
            rowRenderer={rowRenderer}
            // onEndReached={loadMoreGroup}
            renderFooter={renderMyGroupFooter}
          />
        )}
      </View>
    );
  }

  function SuggestedGroup() {
    return (
      <View style={[styles.scene, {backgroundColor: '#fff'}]}>
        {dataProvider.getSize() > 0 && (
          <RecyclerListView
            layoutProvider={layoutProvider2}
            isHorizontal={false}
            dataProvider={dataProvider2}
            rowRenderer={rowRenderer2}
            renderAheadOffset={90}
            // onEndReached={loadMoreGroup}
            renderFooter={renderSuggestedFooter}
          />
        )}
      </View>
    );
  }

  const initialLayout = {width: variables.deviceWidth};

  const changingScreen = (index) => {
    setIndex(index);
    if (index === 1 && !suggestedGroupStarted) {
      setLoading(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_ALL_GROUPS +
        '?pageSize=' +
        pageSize +
        '&pageno=' +
        pageNo +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data.content;
          setLoading(false);
          setSuggestedGroup(result);
          setDataProvider2(dataProvider2.cloneWithRows(result));
          setLastSuggested(result.length);
          setPageNo(pageNo + 1);
          setSuggestedGroupStarted(true);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error.response?.data?.error);
          alert('Oups an error occur');
        });
    }
  };

  const SecondRoute = () => (
    <HScrollView index={1}>
      <View style={[styles.scene, {backgroundColor: '#fff'}]}>
        {dataProvider.getSize() > 0 && (
          <RecyclerListView
            layoutProvider={layoutProvider2}
            isHorizontal={false}
            dataProvider={dataProvider2}
            rowRenderer={rowRenderer2}
            renderAheadOffset={90}
            // onEndReached={loadMoreGroup}
            renderFooter={renderSuggestedFooter}
          />
        )}
      </View>
    </HScrollView>
  );

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return (
          <HScrollView index={0}>
            <View style={[styles.scene, {backgroundColor: '#fff'}]}>
              {dataProvider && dataProvider.getSize() > 0 && (
                <RecyclerListView
                  layoutProvider={layoutProvider}
                  isHorizontal={false}
                  dataProvider={dataProvider}
                  rowRenderer={rowRenderer}
                  // onEndReached={loadMoreGroup}
                  renderFooter={renderMyGroupFooter}
                />
              )}
            </View>
          </HScrollView>
        );
      default:
        return null;
    }
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#b3b3b3'}}
      style={{backgroundColor: '#b3b3b3'}}
    />
  );
  const displaySuggestedGroup = (group) => {
    if (group !== null) {
      setDisplayedSuggestedGroup(group);
      setModalSuggestedVisible(!modalSuggestedVisible);
    }
  };
  const displayMemberGroup = (group) => {
    if (group !== null) {
      setDisplayedMemberGroup(group);
      //setMembersGroup([]);
      setModalGroupMemberVisible(!modalGroupMemberVisible);
      setLoading(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_GROUP_MEMBERS +
        group.id +
        '&pageSize=' +
        pageSize +
        '&pageno=0' +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data.content;
          setLoading(false);
          setMembersGroup(result);
          setDataProviderUser(dataProviderUser.cloneWithRows(result));
          setLastMemberGroupSize(result.length);
          setPageNoGroupMember(pageNoGroupMember + 1);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };
  const loadMemberGroup = () => {
    if (
      displayedMemberGroup !== null &&
      !loading &&
      lastMemberGroupSize >= pageSize
    ) {
      setLoading(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_GROUP_MEMBERS +
        displayedMemberGroup.id +
        '&pageSize=' +
        pageSize +
        '&pageno=' +
        pageNoGroupMember +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data.content;
          setLoading(false);
          if (result !== undefined) {
            result.forEach((el) => {
              membersGroup.push(el);
            });
            setMembersGroup(membersGroup);
            setDataProviderUser(dataProviderUser.cloneWithRows(membersGroup));
            setLastMemberGroupSize(result.length);
            setPageNoGroupMember(pageNoGroupMember + 1);
          } else {
            setLastMemberGroupSize(0);
          }
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };
  const hideSuggestedGroup = () => {
    //setDisplayedSuggestedGroup(null);
    setModalSuggestedVisible(false);
  };
  const hideMemberGroup = () => {
    //setDisplayedSuggestedGroup(null);
    setModalGroupMemberVisible(false);
    setMembersGroup([]);
    setPageNoGroupMember(0);
  };
  const renderMemberGroupFooter = () => {
    if (lastMemberGroupSize >= pageSize) {
      return (
        <View
          style={{
            height: 50,
            width: variables.deviceWidth,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <ButtonPaper
            contentStyle={{height: 35}}
            labelStyle={{fontSize: 11}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            mode="outlined"
            onPress={() => loadMemberGroup()}>
            {I18n.t('loading_more')}
          </ButtonPaper>
        </View>
      );
    } else {
      return <></>;
    }
  };

  const subscribe = () => {
    if (displayedSuggestedGroup !== null && !loading) {
      setLoading(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_GROUP_SUBSCRIBE +
        userId +
        '&idGroup=' +
        displayedSuggestedGroup.id;
      API.get(url)
        .then((res) => {
          let result = res.data.data;
          setLoading(false);
          let test = false;
          groups.forEach((el) => {
            if (el.id === displayedSuggestedGroup.id) {
              test = true;
            }
          });
          if (test === false) {
            groups.push(displayedSuggestedGroup);
            setGroups(groups);
            setDataProvider(dataProvider.cloneWithRows(groups));
          }
          let index = 0;
          suggestedGroup.forEach((el, i) => {
            if (el.id === displayedSuggestedGroup.id) {
              index = i;
            }
          });
          suggestedGroup.splice(index, 1);
          setSuggestedGroup(suggestedGroup);
          setDataProvider2(dataProvider2.cloneWithRows(suggestedGroup));
          setModalSuggestedVisible(false);
          Alert.alert(I18n.t('operation_done'));
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="#0099ff"
          barStyle="default"
          showHideTransition="fade"
          hidden={false}
        />
        <View
          style={{
            height: 50,
            width: variables.deviceWidth,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // padding: 4,
            backgroundColor: '#0099ff',
            paddingTop: 0,
            marginTop: Platform.OS === 'ios' ? 32 : 0,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row-reverse',
              marginTop: 20,
            }}>
            <ActivityIndicator
              animating={loading || loadingMoreGroup}
              color="#fff"
              size="small"
              style={styles.activityIndicatorComment}
            />
            <Text
              style={{
                flex: 1,
                marginTop: 0,
                marginLeft: 10,
                flexWrap: 'wrap',
                fontSize: 22,
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              {I18n.t('groups')}
            </Text>
          </View>
        </View>
        <SafeAreaView style={{flex: 1, paddingTop: 0}}>
          {displayedSuggestedGroup !== null && (
            <Modal
              presentationStyle={'fullScreen'}
              animationType="fade"
              transparent={false}
              visible={modalSuggestedVisible}
              onRequestClose={() => hideSuggestedGroup()}>
              <View style={styles.centeredView}>
                <View
                  style={{
                    height: 60,
                    width: variables.deviceWidth,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // padding: 4,
                    paddingTop: 0,
                    marginTop: Platform.OS === 'ios' ? 30 : 0,
                  }}>
                  <View
                    style={{
                      width: 60,
                      flexDirection: 'row',
                      marginTop: 0,
                      paddingTop: 0,
                    }}>
                    <ButtonPaper
                      loading={loading}
                      style={{paddingTop: 5}}
                      onPress={() => hideSuggestedGroup()}
                      mode={'text'}>
                      <Icon name="arrow-left" size={32} color="#000" />
                    </ButtonPaper>
                  </View>
                  <View
                    style={{
                      width: variables.deviceWidth - 120,
                      flexDirection: 'row',
                      marginTop: 20,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 1,
                        marginTop: 0,
                        flexWrap: 'wrap',
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      {displayedSuggestedGroup?.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalView}>
                  <View style={stylesItem.item}>
                    <View
                      style={[
                        stylesItem.contentContainerModal,
                        {marginTop: 10},
                      ]}>
                      <Text style={stylesItem.paragraph}>
                        {displayedSuggestedGroup?.description}
                      </Text>
                    </View>
                    <View style={stylesItem.imageContainer}>
                      <ScaledImage
                        source={
                          Config.API_URL_BASE3 +
                          Config.API_FILE_MEDIUM +
                          displayedSuggestedGroup.avatar?.uid
                        }
                        defaultSource={require('../Image/pre.gif')}
                      />
                    </View>
                    <View style={stylesItem.reactionContainer}>
                      <ButtonPaper
                        contentStyle={{
                          width: (variables.deviceWidth * 0.45) / 2,
                        }}
                        uppercase={false}
                        compact={true}
                        color={'#007bff'}
                        mode="outlined"
                        onPress={() => subscribe()}>
                        {I18n.t('subscribe')}
                      </ButtonPaper>
                    </View>
                    <View
                      style={[
                        stylesItem.reactionContainer,
                        {flexDirection: 'row-reverse'},
                      ]}>
                      <ButtonPaper
                        contentStyle={{
                          width: (variables.deviceWidth * 0.45) / 2,
                          backgroundColor: '#b8b8b8',
                        }}
                        uppercase={false}
                        compact={true}
                        color={'#FFF'}
                        mode="outlined"
                        onPress={() => hideSuggestedGroup()}>
                        {I18n.t('close')}
                      </ButtonPaper>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          )}
          {displayedMemberGroup !== null && (
            <Modal
              presentationStyle={'fullScreen'}
              animationType="fade"
              transparent={false}
              visible={modalGroupMemberVisible}
              onRequestClose={() => hideMemberGroup()}>
              <View style={styles.centeredView}>
                <View
                  style={{
                    height: 60,
                    width: variables.deviceWidth,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // padding: 4,
                    paddingTop: 0,
                    marginTop: Platform.OS === 'ios' ? 30 : 0,
                  }}>
                  <View
                    style={{
                      width: 60,
                      flexDirection: 'row',
                      marginTop: 0,
                      paddingTop: 0,
                    }}>
                    <ButtonPaper
                      loading={loading}
                      containerStyle={{width: 50, height: 50}}
                      labelStyle={{fontSize: 22, fontWeight: 'bold'}}
                      color={'#000'}
                      style={{paddingTop: 10, color: '#000'}}
                      onPress={() => hideMemberGroup()}
                      icon="arrow-left"
                      mode={'text'}
                    />
                  </View>
                  <View
                    style={{
                      width: variables.deviceWidth - 120,
                      flexDirection: 'row',
                      marginTop: 20,
                    }}>
                    <ButtonPaper
                      contentStyle={{width: 50}}
                      style={{marginRight: 10, marginTop: -5}}
                      uppercase={false}
                      compact={true}
                      color={'#000'}
                      icon="account-group"
                      mode="text">
                      {' '}
                    </ButtonPaper>
                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 1,
                        marginTop: 0,
                        flexWrap: 'wrap',
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      {displayedMemberGroup?.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalView}>
                  <View style={stylesItem.item}>
                    <View
                      style={[
                        stylesItem.contentContainerModal,
                        {marginTop: 0},
                      ]}>
                      <View
                        style={{
                          height: variables.deviceHeight - 120,
                          width: variables.deviceWidth,
                          padding: 20,
                        }}>
                        {dataProviderUser.getSize() > 0 && (
                          <RecyclerListView
                            layoutProvider={layoutProviderUser}
                            dataProvider={dataProviderUser}
                            rowRenderer={rowRendererUser}
                            renderAheadOffset={
                              Platform.OS === 'ios' ? 15 * 380 : 15 * 365
                            }
                            onEndReachedThreshold={
                              Platform.OS === 'ios'
                                ? variables.deviceHeight * 2
                                : variables.deviceHeight
                            }
                            //onEndReached={loadMore}
                            renderFooter={renderMemberGroupFooter}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          )}
          <CollapsibleHeaderTabView
            renderScrollHeader={() => (
              <View
                style={{
                  height:
                    dataProvider2 && dataProvider2.getSize() > 0 ? 205 : 0,
                  backgroundColor: '#f3f3f3',
                  paddingTop:
                    dataProvider2 && dataProvider2.getSize() > 0 ? 2 : 0,
                }}>
                {dataProvider2 && dataProvider2.getSize() > 0 && (
                  <RecyclerListView
                    layoutProvider={layoutProvider2}
                    isHorizontal={true}
                    dataProvider={dataProvider2}
                    rowRenderer={rowRenderer2}
                    renderAheadOffset={90}
                    onEndReached={loadMoreSuggested}
                    swipeEnabled={false}
                    onEndReachedThreshold={20}
                    //renderFooter={renderSuggestedFooter}
                  />
                )}
              </View>
            )}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
          />
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    margin: 10,
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
  scene: {
    flex: 1,
  },
  containerHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 70,
  },
  textWhite: {
    color: 'black',
    marginVertical: 10,
  },
  tabContainer: {
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 2,
    alignItems: 'center',
    elevation: 5,
    width: variables.deviceWidth,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginLeft: 0,
  },
  containerComment: {
    paddingLeft: 1,
    paddingRight: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#b3b1b1',
  },
});
const stylesItem = StyleSheet.create({
  customListView: {
    padding: 10,
    width: variables.deviceWidth - 40,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  infoWrapper: {
    marginLeft: 8,
    marginBottom: 5,
  },
  namesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {height: 0, width: 0},
    marginBottom: 10,
    flexDirection: 'column',
  },
  commentInputWrapper: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  paragraph: {
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 5,
    // backgroundColor: 'red',
    flexDirection: 'row',
    height: 80,
    paddingTop: 5,
    paddingBottom: 1,
  },
  contentContainerModal: {
    paddingHorizontal: 5,
    // backgroundColor: 'red',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 1,
  },
  contentContainerComment: {
    paddingHorizontal: 5,
    backgroundColor: 'red',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 1,
    minHeight: 100,
  },
  contentContainerTitle: {
    paddingHorizontal: 5,
    // backgroundColor: 'red',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 0,
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionContainer: {
    // position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    height: 70,
    padding: 15,
    backgroundColor: '#d6d6d630',
  },
  reactionIcon: {
    fontSize: 20,
    padding: 10,
  },
  shareIcon: {
    position: 'absolute',
    fontSize: 16,
    padding: 15,
    right: 20,
  },
  commentIcon: {
    position: 'relative',
    fontSize: 14,
    marginLeft: 30,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 10,
    borderColor: 'red',
    borderStyle: 'dashed',
    flexWrap: 'nowrap',
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  commentInput: {
    borderWidth: 0.3,
    borderColor: 'gray',
    borderRadius: 20,
    marginLeft: 5,
    height: 35,
    width: variables.deviceWidth - 15 * 2 - 65,
  },
  btnSendComment: {
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
  },
});
export default GroupScreen;
