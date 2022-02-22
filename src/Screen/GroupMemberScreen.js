import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import Config from '../var/config';
import API from '../api/fetch';
import ViewMoreText from 'react-native-view-more-text';
import {Button as ButtonPaper, Portal, Provider} from 'react-native-paper';
import variables from '../var/variables';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import AsyncStorage from '@react-native-community/async-storage';
import TimeAgo from 'javascript-time-ago';
import {parse} from 'fecha';
import I18n from '../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScaledImage from '../Components/ScaledImage';
import {CollapsibleHeaderTabView} from 'react-native-tab-view-collapsible-header';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import UserAction from '../redux/actions/user';
import {connect} from 'react-redux';
import * as RootNavigation from '../rootNavigation';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
const defaultUser = variables.defaultUser;

const GroupMemberScreen = (props) => {
  const [members, setMembers] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );
  const layoutProvider = new LayoutProvider(
    (index) => {
      if (index === 0) {
        return 1;
      } else {
        return 0;
      }
    },
    (type, dim) => {
      dim.width = variables.deviceWidth;
      dim.height = Platform.OS === 'ios' ? 80 : 80;
    },
  );
  const rowRenderer = (type, item, index) => {
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
  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  const memberLength = React.useRef(0);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        RootNavigation.navigate('groups', {});
        setMembers([]);
        setLoading(false);
        setPageNo(0);
        setLoadingMore(false);
        setDataProvider(
          new DataProvider((r1, r2) => {
            return r1 !== r2;
          }).cloneWithRows([], 0),
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let cancel;
    let started = true;
    const fetchData = async () => {
      // console.log('loading offer comment');
      try {
        setLoading(true);
        const url =
          Config.API_URL_BASE4 +
          Config.API_GROUP_MEMBERS +
          props.openGroup.id +
          '&pageSize=' +
          pageSize +
          '&pageno=0' +
          '&sortby=id';
        const response = await API.get(url, {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
        });
        let result = response.data.data.content;
        if (started) {
          if (result) {
            memberLength.current = result.length;
            setLoading(false);
            setMembers(result);
            setTotalPage(response.data.data.totalPage);
            if (memberLength.current > 0) {
              if (memberLength.current >= pageSize) {
                setCanLoadMore(true);
                // console.log('good');
              } else {
                setCanLoadMore(false);
              }
              setDataProvider(
                new DataProvider((r1, r2) => {
                  return r1 !== r2;
                }).cloneWithRows(result, 0),
              );
            }
          }
        }
        setLoading(false);
      } catch (error) {
        if (started) {
          setLoading(false);
        }
        console.log(error);
        // console.log(error.response.data);
        // console.log(error.response?.data?.error);
        alert('Oups an error occur');
      }
    };

    fetchData();

    return () => cancel();
  }, [pageSize, props, props.openGroup]);
  const loadMore = () => {
    let url =
      Config.API_URL_BASE4 +
      Config.API_GROUP_MEMBERS +
      props.openGroup.id +
      '&pageSize=' +
      pageSize +
      '&pageno=' +
      (pageNo + 1).toString() +
      '&sortby=id';
    if (loadingMore === false && pageNo + 1 <= totalPage) {
      setLoadingMore(true);
      API.get(url)
        .then((res) => {
          setLoadingMore(false);
          const result = res.data.data.content;
          if (result) {
            if (result.length >= pageSize) {
              setCanLoadMore(true);
            } else {
              setCanLoadMore(false);
            }
            if (result.length >= pageSize) {
              setCanLoadMore(true);
            } else {
              setCanLoadMore(false);
            }
            result.forEach((e) => {
              members.push(e);
            });
            setMembers(members);
            setTotalPage(res.data.data.totalPage);
            setPageNo(pageNo + 1);
            setDataProvider(
              new DataProvider((r1, r2) => {
                return r1 !== r2;
              }).cloneWithRows(members),
            );
          } else {
            setCanLoadMore(false);
          }
        })
        .then((res2) => {})
        .catch((error) => {
          setLoadingMore(false);
          console.log(error.response?.data?.error);
          alert(error.response?.data?.error);
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
              animating={loading || loadingMore}
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
                fontSize: 18,
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              <Icon name="account-group" color="#fff" style={{fontSize: 20}} />
              {'    ' + props.openGroup.name}
            </Text>
          </View>
        </View>
        <SafeAreaView style={{flex: 1, padding: 5, paddingTop: 20}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
            }}>
            {!!members && members.length > 0 && dataProvider.getSize() > 0 && (
              <RecyclerListView
                layoutProvider={layoutProvider}
                dataProvider={dataProvider}
                rowRenderer={rowRenderer}
                renderAheadOffset={Platform.OS === 'ios' ? 15 * 380 : 15 * 365}
                onEndReachedThreshold={
                  Platform.OS === 'ios'
                    ? variables.deviceHeight * 2
                    : variables.deviceHeight
                }
                //onEndReached={loadingMore}
                //renderFooter={renderFooter}
              />
            )}
            {canLoadMore && (
              <TouchableOpacity
                onPress={() => loadMore()}
                style={{
                  alignItems: 'center',
                  backgroundColor: '#007bff',
                  padding: 10,
                  width: 'auto',
                  borderRadius: 5,
                }}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>
                  {I18n.t('loading_more')}
                  {loadingMore && (
                    <ActivityIndicator
                      animating={true}
                      color="#fff"
                      size="small"
                      style={[
                        styles.activityIndicatorLoadingComment,
                        {height: 10},
                      ]}
                    />
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  content: {
    marginLeft: 12,
    flex: 1,
  },

  activityIndicatorLoadingComment: {
    alignItems: 'center',
    marginLeft: 5,
    marginBottom: -5,
  },
  containerComment: {
    paddingLeft: 1,
    paddingRight: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#f3f3f3',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 5,
    // backgroundColor: 'red',
    flexDirection: 'row',
    height: 50,
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
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  time: {
    fontSize: 11,
    color: '#808080',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginLeft: 0,
  },
  image2: {
    width: 25,
    height: 25,
    borderRadius: 15,
    marginLeft: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    searchData: state.userState.searchData,
    openOffer: state.userState.openOffer,
    openGroup: state.userState.openGroup,
    isLogin: state.userState.isLogin,
    lang: state.userState.lang,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendSearchData: (data) => dispatch(UserAction.updateSearchData(data)),
    sendOpenOffer: (data) => dispatch(UserAction.updateOpenOffer(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupMemberScreen);
