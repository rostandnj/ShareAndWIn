import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
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
const defaultUser = variables.defaultUser;

const NotificationScreen = () => {
  const [notifications, setNotofications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastNotifSize, setLastNotifSize] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
    const comment = item;
    return (
      <View
        style={[
          styles.containerComment,
          {
            backgroundColor:
              comment.enumNotifState === 'SEEN' ? '#fff' : '#e3e3e3',
          },
        ]}>
        <TouchableOpacity onPress={() => console.log('o')}>
          <Image
            style={styles.image}
            source={{
              uri:
                comment.uid !== null
                  ? Config.API_URL_BASE3 + Config.API_FILE_MINI + comment.uid
                  : defaultUser,
            }}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.name}>{comment?.subject}</Text>
            <Text style={styles.time}>{convertDate(comment?.createdAt)}</Text>
          </View>
          <ViewMoreText numberOfLines={2}>
            <Text onPress={() => console.log(0)} rkType="primary3 mediumLine">
              {comment.enumNotifType === 'GROUP'
                ? I18n.t('group_notification')
                : I18n.t('chat_notification')}
            </Text>
          </ViewMoreText>
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

  const timeAgo = new TimeAgo('en-US');
  const convertDate = (date) => {
    return timeAgo.format(
      new Date(parse(date.split('.')[0], 'YY-MM-DDTHH:mm:ss')),
    );
  };
  useEffect(() => {
    AsyncStorage.getItem('user').then((uid) => {
      setUserId(JSON.parse(uid).userId);
      if (!hasLoaded) {
        setLoading(true);
        let url =
          Config.API_URL_BASE4 +
          Config.API_USER_NOTIFICATION +
          JSON.parse(uid).userId +
          '&pageSize=' +
          pageSize +
          '&pageno=' +
          pageNo +
          '&sortby=id';
        console.log(url);
        API.get(url)
          .then((res) => {
            let result = res.data.data;
            setHasLoaded(true);
            setLoading(false);
            setLastNotifSize(result.content.length);
            if (result.content.length >= pageSize) {
              setCanLoadMore(true);
            }
            setNotofications(result.content);
            setPageNo(pageNo + 1);
            setDataProvider(dataProvider.cloneWithRows(result.content));
          })
          .then((res2) => {})
          .catch((error) => {
            setHasLoaded(true);
            setLoading(false);
            console.log(error);
          });
      }
    });
  }, [hasLoaded]);
  const loadMore = () => {
    if (!loading) {
      setLoading(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_USER_NOTIFICATION +
        userId +
        '&pageSize=' +
        pageSize +
        '&pageno=' +
        pageNo +
        '&sortby=id';
      console.log(url);
      API.get(url)
        .then((res) => {
          let result = res.data.data.content;
          setLoading(false);
          setLastNotifSize(result.length);
          if (result.length >= pageSize) {
            setCanLoadMore(true);
          } else {
            setCanLoadMore(false);
          }
          result.forEach((e) => {
            notifications.push(e);
          });
          setNotofications(notifications);
          setPageNo(pageNo + 1);
          setDataProvider(
            new DataProvider((r1, r2) => {
              return r1 !== r2;
            }).cloneWithRows(notifications),
          );
        })
        .then((res2) => {})
        .catch((error) => {
          setHasLoaded(true);
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
              animating={loading}
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
              {I18n.t('icon_notification')}
            </Text>
          </View>
        </View>
        <SafeAreaView style={{flex: 1, padding: 5, paddingTop: 20}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
            }}>
            {dataProvider.getSize() > 0 && (
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
                  backgroundColor: '#ddd',
                  padding: 5,
                  width: 'auto',
                  borderRadius: 5,
                }}>
                <Text style={{fontSize: 12}}>
                  {I18n.t('loading_more')}
                  {loading && (
                    <ActivityIndicator
                      animating={true}
                      color="#007bff"
                      size="small"
                      style={styles.activityIndicatorLoadingComment}
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

export default NotificationScreen;
