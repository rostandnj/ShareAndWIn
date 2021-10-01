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
} from 'react-native';
import variables from '../var/variables';
import API from '../api/fetch';
import Config from '../var/config';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressBar from 'react-native-progress/Bar';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
  Button as ButtonPaper,
  Card,
  IconButton,
  Paragraph,
} from 'react-native-paper';
import I18n from '../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createMaterialTopTabNavigator();
function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}
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
  const [totalPage, setTotalPage] = useState(0);
  const [lastGroupSize, setLastGroupSize] = useState(0);
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
      dim.height = Platform.OS === 'ios' ? 90 : 90;
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
      dim.width = variables.deviceWidth * 0.95;
      dim.height = Platform.OS === 'ios' ? 90 : 90;
    },
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: I18n.t('my_groups')},
    {key: 'second', title: I18n.t('suggested')},
  ]);
  useEffect(() => {
    AsyncStorage.getItem('user').then((uid) => {
      setUserId(JSON.parse(uid).userId);
      if (!hasLoaded) {
        setLoading(true);
        let url =
          Config.API_URL_BASE4 +
          Config.API_USER_GROUPS +
          JSON.parse(uid).userId +
          '?pageSize=' +
          pageSize +
          '&pageno=' +
          pageMyGroupNo +
          '&sortby=id';
        API.get(url)
          .then((res) => {
            let result = res.data.data;
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
            alert('Oups an error occure');
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
  const CardItem = ({item}) => {
    let categoryColor = '#00ff00';
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Image
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          style={{
            width: 40,
            height: 40,
            alignSelf: 'center',
            marginLeft: 10,
            borderRadius: 5,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 50,
            width: '90%',
            marginHorizontal: 10,
            marginVertical: 8,
          }}>
          <Text
            style={{
              // flex: 1,
              fontSize: 22,
              fontWeight: '200',
              // fontFamily: 'sans-serif',
              marginBottom: 4,
              color: '#c13030',
            }}>
            {item?.name}
          </Text>
          <Text style={{alignItems: 'flex-end', color: categoryColor}}>
            {'eee'}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 50,
            width: '90%',
            marginHorizontal: 20,
            marginVertical: 10,
            alignItems: 'flex-end',
            // marginLe,
          }}>
          <Text
            style={{
              // flex: 1,
              marginBottom: 4,
              fontSize: 18,
              fontWeight: '100',
              // fontFamily: 'roboto',
            }}>
            {'100$'}
          </Text>
          <Text
            style={{alignItems: 'flex-end', color: '#808080', fontSize: 12}}>
            {'1'}
          </Text>
        </View>
      </View>
    );
  };
  const rowRenderer2 = (type, item, index) => {
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
          paddingVertical: 10,
        }}>
        <Image
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          defaultSource={require('../Image/pre.gif')}
          style={{
            width: '25%',
            height: 70,
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
              height: '50%',
              marginHorizontal: 5,
              marginVertical: 0,
              backgroundColor: 'transparent',
              paddingTop: 0,
            }}>
            <Text
              style={{
                // flex: 1,
                fontSize: 20,
                fontWeight: '100',
                // fontFamily: 'sans-serif',
                marginBottom: 4,
                color: '#000',
              }}>
              {item?.name.length <= 35 ? item?.name : item?.name.substr(0, 35)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              height: 40,
              marginHorizontal: 5,
              paddingTop: 0,
              alignItems: 'flex-end',
              backgroundColor: 'transparent',
              // marginLe,
            }}>
            <ButtonPaper
              contentStyle={{width: 50}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="message-text"
              mode="text"
              onPress={() => console.log('Pressed')}>
              0
            </ButtonPaper>
            <ButtonPaper
              contentStyle={{width: 50}}
              style={{marginRight: 10}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="account-group"
              mode="text"
              onPress={() => console.log(index)}>
              {item.numberOfMembers === null ? 0 : item.numberOfMembers}
            </ButtonPaper>
          </View>
        </View>
      </View>
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
          paddingVertical: 10,
        }}>
        <Image
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          defaultSource={require('../Image/pre.gif')}
          style={{
            width: '25%',
            height: 70,
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
              height: '50%',
              marginHorizontal: 5,
              marginVertical: 0,
              backgroundColor: 'transparent',
              paddingTop: 0,
            }}>
            <Text
              style={{
                // flex: 1,
                fontSize: 20,
                fontWeight: '100',
                // fontFamily: 'sans-serif',
                marginBottom: 4,
                color: '#000',
              }}>
              {item?.name.length <= 35 ? item?.name : item?.name.substr(0, 35)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              height: 40,
              marginHorizontal: 5,
              paddingTop: 0,
              alignItems: 'flex-end',
              backgroundColor: 'transparent',
              // marginLe,
            }}>
            <ButtonPaper
              contentStyle={{width: 50}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="message-text"
              mode="text"
              onPress={() => console.log('Pressed')}>
              0
            </ButtonPaper>
            <ButtonPaper
              contentStyle={{width: 50}}
              style={{marginRight: 10}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="account-group"
              mode="text"
              onPress={() => console.log(index)}>
              {item.numberOfMembers === null ? 0 : item.numberOfMembers}
            </ButtonPaper>
          </View>
        </View>
      </View>
    );
  };
  const loadMoreGroup = () => {
    if (!loadingMoreGroup) {
      setLoadingMoreGroup(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_USER_GROUPS +
        userId +
        '?pageSize=' +
        pageSize +
        '&pageno=' +
        pageMyGroupNo +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data;
          result.forEach((e) => {
            groups.push(e);
          });
          setGroups(groups);
          setDataProvider(dataProvider.cloneWithRows(groups));
          setLoadingMoreGroup(false);
          setPageMyGroupNo(pageMyGroupNo + 1);
          console.log(groups.length);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoadingMoreGroup(false);
          console.log(error);
        });
    }
  };
  const loadMoreSuggested = () => {
    if (!loadingMoreGroup) {
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
          console.log(result.length);
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
  const FirstRoute = () => (
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

  const SecondRoute = () => (
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

  const initialLayout = {width: variables.deviceWidth};

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const changingScreen = (index) => {
    setIndex(index);
    if (index === 1 && !suggestedGroupStarted) {
      setLoading(true);
      API.get(
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
          alert('Oups an error occure');
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
            <Text
              style={{
                flex: 1,
                marginTop: 0,
                flexWrap: 'wrap',
                fontSize: 22,
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              {I18n.t('groups')}
            </Text>
            <ActivityIndicator
              animating={false}
              color="#007bff"
              size="small"
              style={styles.activityIndicatorComment}
            />
          </View>
        </View>
        <View
          style={{
            // backgroundColor: 'red',
            height: 4,
            width: variables.deviceWidth,
            flexDirection: 'row',
          }}>
          <ProgressBar
            indeterminate={loading || loadingMoreGroup}
            animated={true}
            borderWidth={0}
            borderRadius={0}
            progress={1}
            useNativeDriver={true}
            color={'#a4d0ef'}
            width={variables.deviceWidth}
          />
        </View>
        <SafeAreaView style={{flex: 1}}>
          <Tab.Navigator>
            <Tab.Screen name="first" component={HomeScreen} />
            <Tab.Screen name="second" component={SettingsScreen} />
          </Tab.Navigator>
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
});

const stylesOLd = StyleSheet.create({
  center: {
    height: variables.deviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    width: variables.deviceWidth,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: variables.deviceWidth,
  },
});
export default GroupScreen;
