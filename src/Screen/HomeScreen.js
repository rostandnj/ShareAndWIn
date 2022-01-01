import React, {useRef, useCallback, useEffect, useState} from 'react';

import {
  View,
  ActivityIndicator,
  TouchableHighlight,
  KeyboardAvoidingView,
  Text,
  Keyboard,
  StatusBar,
  Modal,
  Platform,
  StyleSheet,
  BackHandler,
  Share,
  TouchableOpacity,
} from 'react-native';
import {Portal, Provider, DefaultTheme} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {connect} from 'react-redux';
import {SearchBar} from 'react-native-elements';
import Config from '../var/config';
import variables from '../var/variables';
import I18n from './../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimeAgo from 'javascript-time-ago';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import API from '../api/fetch';
import {parse} from 'fecha';
import * as RootNavigation from '../rootNavigation';

// English.
import en from 'javascript-time-ago/locale/en';
import ProgressBar from 'react-native-progress/Bar';
import PostItem from '../Components/PostItem';
import CommentItem from '../Components/CommentItem';
import PostPage from '../Components/PostPage';
import UserAction from '../redux/actions/user';
TimeAgo.addLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007bff',
    accent: '#09dfe2',
  },
};
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];
const HomeScreen = (props) => {
  const [offers, setOffers] = useState([]);
  const [openOffer, setOpenOffer] = useState(null);
  const [openOfferIndex, setOpenOfferIndex] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const pageSize = 5;
  const [pageNo, setPageNo] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [visibleComment, setVisibleComment] = useState(false);
  const [dataComment, setDataComment] = useState([]);
  const [commentMsg, setCommentMsg] = useState('');
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [sendingComment, setSendingComment] = useState(false);
  const [showSubComment, setShowSubComment] = useState(-1);
  const [commentOffset, setCommentOffset] = useState(0);
  const [canLoadMoreComment, setCanLoadMoreComment] = useState(false);
  const [loadingMoreComment, setLoadingMoreComment] = useState(false);
  const [showSecondDialogReaction, setShowSecondDialogReaction] = useState(
    false,
  );
  const statusBarTransition = TRANSITIONS[0];
  const mainComments = useRef();

  // recycleView
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );

  const [dataProviderComment, setDataProviderComment] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );

  const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
  };

  const intToK = (num) => {
    if (num < 1000) {
      return num;
    }
    var si = [
      {v: 1e3, s: 'K'},
      {v: 1e6, s: 'M'},
      {v: 1e9, s: 'B'},
      {v: 1e12, s: 'T'},
      {v: 1e15, s: 'P'},
      {v: 1e18, s: 'E'},
    ];
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].v) {
        break;
      }
    }
    return (
      (num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
      si[i].s
    );
  };

  const layoutProvider = new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = variables.deviceWidth;
      dim.height = Platform.OS === 'ios' ? 460 : 460;
    },
  );

  const rowRenderer = (type, item, index) => {
    return (
      <PostItem
        offer={item}
        index={index}
        convertDate={convertDate}
        showModalComment={goToShowOffer}
        makeReaction={makeReaction}
        onShare={onShare}
      />
    );
  };

  const rowRendererComment = (type, item, index) => {
    const comment = item;
    return <CommentItem comment={comment} convertDate={convertDate} />;
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  useEffect(() => {
    let isMounted = true;
    if (!hasLoaded) {
      setLoading(true);
      API.get(
        Config.API_URL_BASE4 +
          Config.API_COMPANY_OFFERS +
          '?pageSize=' +
          pageSize +
          '&pageno=' +
          pageNo +
          '&sortby=id',
      )
        .then((res) => {
          let result = res.data.data.content;
          if (isMounted) {
            setHasLoaded(true);
            setLoading(false);
            setOffers(result);
            setTotalPage(res.data.data.totalPage);
            setPageNo(pageNo + 1);
            setDataProvider(
              new DataProvider((r1, r2) => {
                return r1 !== r2;
              }).cloneWithRows(result),
            );
          }
        })
        .then((res2) => {})
        .catch((error) => {
          setHasLoaded(true);
          setLoading(false);
          console.log(error.response?.data?.error);
          alert('Oups an error occur');
        });
      return () => {
        isMounted = false;
      };
    }
  }, []);
  const loadMore = () => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_OFFERS +
      '?pageSize=' +
      pageSize +
      '&pageno=' +
      pageNo +
      '&sortby=id';
    if (loadingMore === false && pageNo < totalPage) {
      setLoadingMore(true);
      API.get(url)
        .then((res) => {
          setLoadingMore(false);
          const result = res.data.data.content;
          result.forEach((e) => {
            offers.push(e);
          });
          setOffers(offers);
          setTotalPage(res.data.data.totalPage);
          setPageNo(pageNo + 1);
          setDataProvider(
            new DataProvider((r1, r2) => {
              return r1 !== r2;
            }).cloneWithRows(offers),
          );
        })
        .then((res2) => {})
        .catch((error) => {
          setLoadingMore(false);
          console.log(error.response?.data?.error);
          alert(error.response?.data?.error);
        });
    }
  };
  const convertDate = (date) => {
    return timeAgo.format(
      new Date(parse(date.split('.')[0], 'YY-MM-DDTHH:mm:ss')),
    );
  };
  const showModalComment = (index) => {
    setShowSecondDialogReaction(false);
    setCommentMsg('');
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_GET_COMMENT +
      '?offerId=' +
      offers[index].id +
      '&pageSize=' +
      pageSize +
      '&pageno=' +
      commentOffset +
      '&sortby=id';
    if (loading === false) {
      setOpenOffer(offers[index]);
      setOpenOfferIndex(index);
      setLoading(true);
      API.get(url)
        .then((res) => {
          setLoading(false);
          if (res.data.data.content !== undefined) {
            setDataComment(res.data.data.content);
            setCommentOffset(commentOffset + 1);
            if (res.data.data.content.length >= pageSize) {
              setCanLoadMoreComment(true);
            } else {
              setCanLoadMoreComment(false);
            }
            setDataProviderComment(
              new DataProvider((r1, r2) => {
                return r1 !== r2;
              }).cloneWithRows(res.data.data.content),
            );
          } else {
            console.log('no');
            setDataComment([]);
            setCanLoadMoreComment(false);
            setDataProviderComment(
              new DataProvider((r1, r2) => {
                return r1 !== r2;
              }).cloneWithRows([]),
            );
          }

          setVisibleComment(true);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          if (error.response !== undefined) {
            console.log(error.response?.data?.error);
            alert(error.response?.data?.error);
          } else {
            console.log(error);
            alert('Oups an error occurd');
          }
        });
    }
  };
  const loadMoreComment = () => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_GET_COMMENT +
      '?offerId=' +
      offers[openOfferIndex].id +
      '&pageSize=' +
      pageSize +
      '&pageno=' +
      commentOffset +
      '&sortby=id';
    if (loading === false && loadingMoreComment === false) {
      setLoadingMoreComment(true);
      API.get(url)
        .then((res) => {
          setLoadingMoreComment(false);
          if (res.data.data.content !== undefined) {
            const result = res.data.data.content;
            result.forEach((e) => {
              dataComment.push(e);
            });
            setDataComment(dataComment);
            setCommentOffset(commentOffset + 1);
            if (result.length >= pageSize) {
              setCanLoadMoreComment(true);
            } else {
              setCanLoadMoreComment(false);
            }
            setDataProviderComment(
              new DataProvider((r1, r2) => {
                return r1 !== r2;
              }).cloneWithRows(dataComment),
            );
          } else {
            setCanLoadMoreComment(false);
            console.log('no');
          }

          setVisibleComment(true);
        })
        .catch((error) => {
          setLoadingMoreComment(false);
          console.log(error);
          if (error.response !== undefined) {
            console.log(error.response?.data?.error);
            alert(error.response?.data?.error);
          } else {
            console.log(error);
            alert('Oups an error occurd');
          }
        });
    }
  };
  const hideDialogAction = () => {
    setOpenOffer(null);
    setOpenOfferIndex(null);
  };
  const hideModalComment = () => {
    setDataComment([]);
    setVisibleComment(false);
    setOpenOffer(null);
    setOpenOfferIndex(null);
    setCommentOffset(0);
  };
  const makeReaction = (code, id) => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_MAKE_REACTION +
      '?idOffer=' +
      id +
      '&idUser=' +
      props.user.id +
      '&flag=' +
      code;
    if (loading === false) {
      setLoading(true);
      API.get(url)
        .then((res) => {
          setLoading(false);
          //console.log(res.data.data.offer);
          offers[openOfferIndex] = res.data.data.offer;
          setOffers(offers);
          hideDialogAction();
          console.log(res.data);
          setShowSecondDialogReaction(false);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error.response?.data?.error);
          alert(error.response?.data?.error);
        });
    }
  };
  const makeReaction2 = (code) => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_MAKE_REACTION +
      '?idOffer=' +
      openOffer.id +
      '&idUser=' +
      props.user.id +
      '&flag=' +
      code;
    if (sendingComment === false) {
      setSendingComment(true);
      API.get(url)
        .then((res) => {
          setSendingComment(false);
          console.log(res.data.data.offer);
          setOpenOffer(res.data.data.offer);
          let off = offers;
          off[openOfferIndex] = res.data.data.offer;
          setOffers(offers);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error.response?.data?.error);
          alert(error.response?.data?.error);
        });
    }
  };
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const _keyboardDidShow = () => setKeyboardStatus('Keyboard Shown');
  const _keyboardDidHide = () => setKeyboardStatus('Keyboard Hidden');
  const commentItem = () => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_MAKE_COMMENT +
      '?idOffer=' +
      openOffer.id +
      '&idUser=' +
      props.user.id;
    if (sendingComment === false && commentMsg.length > 0) {
      setSendingComment(true);
      let send = {message: commentMsg};
      if (showSubComment !== -1) {
        send.parentId = showSubComment;
      }
      API.post(url, send)
        .then((res) => {
          setSendingComment(false);
          let da = dataComment;
          da.push(res.data.data);
          setDataComment(da);
          /*if (showSubComment !== -1) {
                                da.push(res.data.data);
                                setDataComment(da);
                              } else {
                                da.forEach((el) => {
                                  if (el.id === showSubComment) {
                                    el.push(res.data.data);
                                  }
                                });
                                setDataComment(da);
                              }*/

          //console.log(res.data.data.offer);
          let off = offers;
          off[openOfferIndex] = res.data.data.offer;
          setOffers(off);
          setOpenOffer(res.data.data.offer);
          setCommentMsg('');
          Keyboard.dismiss();
        })
        .then((res2) => {})
        .catch((error) => {
          setLoading(false);
          console.log(error.response?.data?.error);
          alert(error.response?.data?.error);
        });
    }
  };
  const onShare = async (item) => {
    try {
      const result = await Share.share({
        message: 'ShareAndWin offer | ' + item.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const goToSearch = (val) => {
    props.sendSearchData({type: 'search', keyword: val, from: 'home'});
    if (val.length > 0) {
      RootNavigation.navigate('search', {});
    }
  };
  const goToShowOffer = (val) => {
    val.from = 'home';
    props.sendOpenOffer(val);
    if (typeof val === 'object') {
      RootNavigation.navigate('offer', {});
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
      <View style={[styles.container]}>
        <StatusBar
          animated={true}
          backgroundColor="#0099ff"
          barStyle={statusBarStyle}
          showHideTransition={statusBarTransition}
          hidden={hidden}
        />
        <View
          style={{
            flex: 2,
            backgroundColor: '#0099ff',
            padding: 0,
            height: variables.deviceHeight / 4,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
          }}>
          <View
            style={{
              width: variables.deviceWidth,
              flexDirection: 'row',
              flex: 1,
              marginTop: Platform.OS === 'ios' ? 30 : 10,
            }}>
            <SearchBar
              containerStyle={{
                backgroundColor: '#0099ff',
                borderBottomColor: '#0099ff',
                borderTopColor: '#0099ff',
                flex: 4,
              }}
              inputContainerStyle={{backgroundColor: 'white'}}
              placeholder={I18n.t('find_and_see')}
              onChangeText={(itemValue) => setQuery(itemValue)}
              value={query}
            />
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={() => goToSearch(query)}>
              <Icon name="card-search" color="#fff" size={69} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              // backgroundColor: 'red',
              height: 4,
              width: variables.deviceWidth,
              flexDirection: 'row',
            }}>
            <ProgressBar
              indeterminate={loading}
              animated={true}
              borderWidth={0}
              borderRadius={0}
              progress={1}
              useNativeDriver={true}
              color={'#a4d0ef'}
              width={variables.deviceWidth}
            />
          </View>
          <View
            style={{
              flex: 8,
              backgroundColor: 'white',
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
                onEndReached={loadMore}
                /*renderFooter={renderFooter}*/
              />
            )}
            {loadingMore && (
              <View
                style={{
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <ActivityIndicator
                  animating={loadingMore}
                  color="#0099ff"
                  size="small"
                  style={styles.activityIndicator}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: variables.deviceWidth,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  logo: {
    width: 25,
    height: 25,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  activityIndicatorLoadingComment: {
    alignItems: 'center',
    marginLeft: 5,
    marginBottom: -5,
  },
  activityIndicatorComment: {
    alignItems: 'center',
    height: 80,
    marginTop: -20,
  },
  root: {
    backgroundColor: '#ffffff',
    /*marginTop: 10,*/
  },
  containerComment: {
    paddingLeft: 1,
    paddingRight: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerComment2: {
    paddingLeft: 1,
    paddingRight: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  contentFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 1,
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
  time: {
    fontSize: 11,
    color: '#808080',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
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

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    searchData: state.userState.searchData,
    openOffer: state.userState.openOffer,
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
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
