import React, {useEffect, useRef, useState} from 'react';
import {useCallback} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  KeyboardAvoidingView,
  Text,
  Image,
  Share,
  Keyboard,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {connect} from 'react-redux';
import {
  Button as ButtonPaper,
  Card,
  Paragraph,
  Avatar,
  IconButton,
  Portal,
  Provider,
  DefaultTheme,
} from 'react-native-paper';
import {SearchBar} from 'react-native-elements';
import API from '../api/fetch';
import Config from '../var/config';
import variables from '../var/variables';
import I18n from './../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {parse} from 'fecha';
import TimeAgo from 'javascript-time-ago';
import ViewMoreText from 'react-native-view-more-text';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import FastImage from 'react-native-fast-image';
import en from 'javascript-time-ago/locale/en';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ScaledImage from '../Components/ScaledImage';
import ProgressBar from 'react-native-progress/Bar';
import axios from 'axios';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const defaultUser = variables.defaultUser;
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
const GroupPostScreen = (props) => {
  const [offers, setOffers] = useState([]);
  const [openOffer, setOpenOffer] = useState(null);
  const [openOfferIndex, setOpenOfferIndex] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [commentLimit, setCommentLimit] = useState(15);
  const [pageNo, setPageNo] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [numberOfLines, setNumberOfLines] = useState(5);
  const [visibleAction, setVisibleAction] = useState(false);
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
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0],
  );
  const mainComments = useRef();
  const onPressFunction = () => {
    console.log('press');
    mainComments.current.scrollToEnd({animating: false, index: 17});
  };

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

  const layoutProviderComment = new LayoutProvider(
    (index) => {
      if (index === 0) {
        return 1;
      } else {
        return ViewTypes.FULL;
      }
    },
    (type, dim) => {
      dim.width = variables.deviceWidth;
      dim.height = Platform.OS === 'ios' ? 65 : 65;
    },
  );

  const renderViewLess = (onPress) => {
    return (
      <Text style={{color: '#898c8c'}} onPress={onPress}>
        {I18n.t('view_less')}
      </Text>
    );
  };
  const renderViewMore = (onPress) => {
    return (
      <Text style={{color: '#898c8c'}} onPress={onPress}>
        {I18n.t('view_more')}
      </Text>
    );
  };

  const rowRenderer = (type, item, index) => {
    return (
      <View style={stylesItem.item}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'green',
            height: 70,
          }}>
          <View style={stylesItem.customListView}>
            <Image
              style={stylesItem.avatar}
              source={{
                uri:
                  Config.API_URL_BASE3 +
                  Config.API_FILE_MINI +
                  item.avatar?.uid,
              }}
              defaultSource={require('../Image/user.jpeg')}
            />
            <View style={stylesItem.infoWrapper}>
              <View style={stylesItem.namesWrapper}>
                <TouchableOpacity onPress={() => console.log('')}>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    {item?.company?.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={stylesItem.extraInfoWrapper}>
                <Text style={{color: '#333', fontSize: 14}}>
                  {convertDate(item.publishedAt)}
                </Text>
                <Text style={{fontSize: 16, marginHorizontal: 5}}>·</Text>
                <FontAwesome5Icon color="#333" name="globe-asia" />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => console.log('')}
            style={{width: 25, alignItems: 'center', marginBottom: 5}}>
            <Icon name="dots-vertical" color="#000" style={{fontSize: 20}} />
          </TouchableOpacity>
        </View>
        <View style={stylesItem.contentContainerTitle}>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginTop: 1,
              color: '#393939',
            }}>
            {item?.title}
          </Text>
        </View>
        <View style={stylesItem.contentContainer}>
          <Text numberOfLines={2} style={stylesItem.paragraph}>
            {item?.description}
          </Text>
        </View>

        <View style={stylesItem.imageContainer}>
          <ScaledImage
            height={400}
            source={
              Config.API_URL_BASE3 + Config.API_FILE_MEDIUM + item.avatar?.uid
            }
            defaultSource={require('../Image/pre.gif')}
          />
        </View>
        <View horizontal={true} style={stylesItem.reactionContainer}>
          <Text style={{fontWeight: 'bold', color: 'gray'}}>
            {intToK(parseInt(item?.likesNb))}
          </Text>
          <TouchableOpacity onPress={() => makeReaction('LIKE', item.id)}>
            <FontAwesome5Icon
              name="thumbs-up"
              color="#318bfb"
              backgroundColor="#fff"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => makeReaction('INLOVE', item.id)}>
            <FontAwesome5Icon
              name="heart"
              color="#e8304a"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => makeReaction('AMAZING', item.id)}>
            <FontAwesome5Icon
              name="grin-squint"
              color="#e8304a"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => makeReaction('SAD', item.id)}>
            <FontAwesome5Icon
              name="frown-open"
              color="#e8304a"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => makeReaction('ANGRY', item.id)}>
            <FontAwesome5Icon
              lineBreakMode={false}
              name="angry"
              color="#e8304a"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesItem.commentIcon}
            onPress={() => showModalComment(index)}>
            <FontAwesome5Icon
              lineBreakMode={false}
              name="comment-alt"
              color="gray"
              backgroundColor="white"
              style={{...stylesItem.reactionIcon, fontSize: 14}}>
              <Text
                style={{
                  fontSize: 12,
                  textAlignVertical: 'center',
                  fontWeight: 'bold',
                }}>
                {' '}
                {item?.commentsNb}
              </Text>
            </FontAwesome5Icon>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onShare(item)}
            style={stylesItem.shareIcon}>
            <FontAwesome5Icon name="share-alt" color="gray">
              <Text style={{fontSize: 12, textAlignVertical: 'center'}}>
                {' '}
                {item?.shareNb}
              </Text>
            </FontAwesome5Icon>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const rowRendererComment = (type, item, index) => {
    const comment = item;
    return (
      <View style={styles.containerComment}>
        <TouchableOpacity
          disabled={comment.comments.length === 0}
          onPress={() => displaySubComment(comment.id)}>
          <Image
            style={styles.image}
            source={{
              uri:
                comment.user !== null && comment.user.photo !== null
                  ? Config.API_URL_BASE3 +
                    Config.API_FILE_MINI +
                    comment.user.photo.uid
                  : defaultUser,
            }}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.name}>
              {comment?.user?.firstName + ' ' + comment?.user?.lastName}
            </Text>
            <Text style={styles.time}>{convertDate(comment.createdAt)}</Text>
          </View>
          <ViewMoreText
            numberOfLines={2}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}>
            <Text
              onPress={() => displaySubComment(comment.id)}
              rkType="primary3 mediumLine">
              {comment.message}
            </Text>
          </ViewMoreText>
          <View style={styles.contentFooter}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                marginTop: 0,
              }}>
              <Text style={{marginRight: 15}}>{comment.comments.length}</Text>
              <ButtonPaper
                style={{
                  height: 10,
                  marginRight: -30,
                }}
                mode={'text'}
                icon={'comment'}
              />
              <Text
                style={{
                  marginRight: 15,
                  display: 'none',
                }}>
                {comment.likesNb !== null ? comment.likesNb : 0}
              </Text>

              <ButtonPaper
                style={{
                  height: 10,
                  marginRight: -30,
                  display: 'none',
                }}
                mode={'text'}
                icon={'thumb-up'}
                onPress={() => alert('rr')}
              />
            </View>
          </View>
          {comment.comments.length > 0 && showSubComment === comment.id && (
            <View
              style={{
                flex: 1,
              }}>
              <FlatList
                data={comment.comments}
                keyExtractor={(item2, index2) => {
                  return index2.toString();
                }}
                renderItem={(it) => {
                  const comment2 = it.item;
                  return (
                    <View style={styles.containerComment2}>
                      <TouchableOpacity onPress={() => {}}>
                        <Image
                          style={styles.image2}
                          source={{
                            uri:
                              comment2.user !== null
                                ? Config.API_URL_BASE3 +
                                  Config.API_FILE_MINI +
                                  comment2.user.photo.uid
                                : defaultUser,
                          }}
                        />
                      </TouchableOpacity>
                      <View style={styles.content}>
                        <View style={styles.contentHeader}>
                          <Text style={styles.name}>
                            {comment2?.user?.firstName +
                              ' ' +
                              comment2?.user?.lastName}
                          </Text>
                          <Text style={styles.time}>
                            {convertDate(comment2.createdAt)}
                          </Text>
                        </View>
                        <ViewMoreText
                          numberOfLines={2}
                          renderViewMore={renderViewMore}
                          renderViewLess={renderViewLess}>
                          <Text rkType="primary3 mediumLine">
                            {comment2.message}
                          </Text>
                        </ViewMoreText>
                        <View style={styles.contentFooter}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row-reverse',
                              marginTop: 0,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  const offerLength = React.useRef(0);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let cancel;
    let started = true;
    const fetchData = async () => {
      console.log('fetch first');
      try {
        setLoading(true);
        setPageNo(0);
        let url = '';
        if (props.searchData.type === 'search') {
          url =
            Config.API_URL_BASE4 +
            Config.API_SEARCH_OFFER +
            '?key=' +
            encodeURI(props.searchData.keyword) +
            '&pageSize=' +
            pageSize +
            '&pageno=0' +
            '&sortby=id';
        } else {
        }
        console.log(props.searchData);
        const response = await API.get(url, {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
        });
        let result = response.data.data.content;
        if (started) {
          if (result) {
            offerLength.current = result.length;
            setLoading(false);
            setOffers(result);
            setTotalPage(response.data.data.totalPage);
            if (offerLength.current > 0) {
              setDataProvider(
                new DataProvider((r1, r2) => {
                  return r1 !== r2;
                }).cloneWithRows(result, 0),
              );
            }
          }
        }
      } catch (error) {
        if (started) {
          setLoading(false);
        }
        console.log(error.response?.data?.error);
        alert('Oups an error occur');
      }
    };

    fetchData();

    return () => cancel();
  }, [pageSize, props.searchData, props.searchData.keyword]);

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
  const loadMore = () => {
    let url = '';
    if (props.searchData.type === 'search') {
      url =
        Config.API_URL_BASE4 +
        Config.API_SEARCH_OFFER +
        '?key=' +
        encodeURI(props.searchData.keyword) +
        '&pageSize=' +
        pageSize +
        '&pageno=' +
        (pageNo + 1).toString() +
        '&sortby=id';
    } else {
    }
    console.log(url);
    console.log(totalPage);
    console.log(pageNo);
    if (loadingMore === false && pageNo < totalPage) {
      console.log('more');
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
  const keyExtractor = (item, index) => item.id.toString();
  const showDialogAction = (index) => {
    setVisibleAction(true);
    setOpenOffer(offers[index]);
    setOpenOfferIndex(index);
  };
  const showDialogAction2 = (index) => {
    setShowSecondDialogReaction(true);
    setOpenOffer(offers[index]);
    setOpenOfferIndex(index);
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
            if (result.length >= commentLimit) {
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
    setVisibleAction(false);
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
  const renderItem = (index, item) => {
    return (
      <Card
        style={{
          alignItems: 'center',
          borderWidth: 0,
        }}>
        <Card.Title
          style={{backgroundColor: '#3aa7f3', width: '100%'}}
          titleStyle={{color: '#fff', fontSize: 18, marginLeft: '-3%'}}
          subtitleStyle={{color: '#000', fontSize: 14}}
          title={item?.company?.name}
          right={(props) => (
            <IconButton
              {...props}
              icon="dots-vertical"
              color={'#fff'}
              onPress={() => {}}
            />
          )}
        />
        <Card.Content style={{width: '100%', marginLeft: '-3%'}}>
          <Paragraph
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              marginTop: 8,
              color: '#393939',
            }}>
            {item?.title.substr(0, 100)}
          </Paragraph>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
            }}
            numberOfLines={numberOfLines}
            ellipsizeMode="middle">
            {item?.description}
          </Text>
        </Card.Content>
        <Card.Cover
          source={{
            uri:
              Config.API_URL_BASE3 + Config.API_FILE_MEDIUM + item.avatar?.uid,
          }}
        />
        <Card.Actions
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: '2%',
          }}>
          <ButtonPaper
            contentStyle={{
              width: (variables.deviceWidth * 0.9) / 4,
            }}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="thumb-up"
            mode="outlined"
            onPress={() => showDialogAction(index)}>
            {item?.likesNb}
          </ButtonPaper>
          <ButtonPaper
            contentStyle={{width: (variables.deviceWidth * 0.9) / 4}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="share"
            mode="outlined"
            onPress={() => onShare(item)}>
            {item?.shareNb}
          </ButtonPaper>
          <ButtonPaper
            contentStyle={{width: (variables.deviceWidth * 0.9) / 4}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="eye"
            mode="outlined"
            onPress={() => console.log('Pressed')}>
            {item?.viewsNb}
          </ButtonPaper>
          <ButtonPaper
            contentStyle={{width: (variables.deviceWidth * 0.9) / 4}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="comment"
            mode="outlined"
            onPress={() => showModalComment(index)}>
            {item?.commentsNb}
          </ButtonPaper>
        </Card.Actions>
      </Card>
    );
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
          //console.log(res.data.data.offer);
          setOpenOffer(res.data.data.offer);
          let off = offers;
          off[openOfferIndex] = res.data.data.offer;
          setOffers(offers);
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
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const _keyboardDidShow = () => setKeyboardStatus('Keyboard Shown');
  const _keyboardDidHide = () => setKeyboardStatus('Keyboard Hidden');
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);
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
  const displaySubComment = (index) => {
    if (index === showSubComment) {
      setShowSubComment(-1);
    } else {
      setShowSubComment(index);
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
              height: 40,
              marginTop: Platform.OS === 'ios' ? 30 : 10,
            }}>
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
              {I18n.t('offers')}
            </Text>
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
            {!!offers && offers.length > 0 && dataProvider.getSize() > 0 && (
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
            <Provider theme={theme}>
              <Portal>
                {openOffer !== null && (
                  <Modal
                    style={{
                      backgroundColor: 'white',
                      margin: 0, // This is the important style you need to set
                      alignItems: undefined,
                      justifyContent: undefined,
                    }}
                    statusBarTranslucent={false}
                    visible={visibleComment}
                    presentationStyle={'fullScreen'}
                    onRequestClose={hideModalComment}
                    onDismiss={hideModalComment}>
                    <KeyboardAvoidingView
                      keyboardVerticalOffset={Platform.OS === 'ios' ? -10 : 35}
                      style={{flex: 1}}
                      behavior={'position'}
                      enabled={true}>
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
                            paddingTop: 10,
                          }}>
                          <ButtonPaper
                            loading={sendingComment}
                            containerStyle={{width: 50, height: 50}}
                            labelStyle={{fontSize: 22, fontWeight: 'bold'}}
                            onPress={() => hideModalComment()}
                            icon="arrow-left"
                            color="#000"
                            mode={'text'}
                          />
                        </View>
                        <View
                          style={{
                            width: variables.deviceWidth - 120,
                            flexDirection: 'row-reverse',
                            marginTop: 20,
                          }}>
                          <Text
                            style={{
                              flex: 1,
                              marginTop: 0,
                              flexWrap: 'wrap',
                              fontSize: 18,
                              fontWeight: 'bold',
                              textAlign: 'center',
                            }}>
                            {openOffer?.company?.name}
                          </Text>
                          <ActivityIndicator
                            animating={false}
                            color="#007bff"
                            size="small"
                            style={styles.activityIndicatorComment}
                          />
                        </View>
                        <View
                          style={{
                            width: 60,
                            flexDirection: 'row',
                            marginTop: 0,
                            paddingTop: 0,
                          }}>
                          <ButtonPaper
                            style={{paddingTop: 5}}
                            onPress={() => hideModalComment()}
                            mode={'text'}>
                            <Icon
                              name="dots-horizontal"
                              size={32}
                              color="#000"
                            />
                          </ButtonPaper>
                        </View>
                      </View>
                      <View
                        ref={mainComments}
                        style={{
                          height:
                            Platform.OS === 'ios'
                              ? variables.deviceHeight - 150
                              : variables.deviceHeight -
                                110 -
                                variables.deviceSoftMenuHeight,
                        }}>
                        <FlatList
                          maxToRenderPerBatch={7}
                          initialNumToRender={6}
                          ListHeaderComponent={() => {
                            return (
                              <View style={stylesItem.item}>
                                <View style={stylesItem.contentContainerTitle}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                      marginTop: 1,
                                      color: '#393939',
                                    }}>
                                    {openOffer?.title}
                                  </Text>
                                </View>
                                <View style={stylesItem.contentContainerModal}>
                                  <Text style={stylesItem.paragraph}>
                                    {openOffer?.description}
                                  </Text>
                                </View>
                                <View style={stylesItem.imageContainer}>
                                  <ScaledImage
                                    height={400}
                                    source={
                                      Config.API_URL_BASE3 +
                                      Config.API_FILE_MEDIUM +
                                      openOffer.avatar?.uid
                                    }
                                    defaultSource={require('../Image/pre.gif')}
                                  />
                                </View>
                                <View style={stylesItem.reactionContainer}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      color: 'gray',
                                    }}>
                                    {intToK(parseInt(openOffer?.likesNb))}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => makeReaction2('LIKE')}>
                                    <FontAwesome5Icon
                                      name="thumbs-up"
                                      color="#318bfb"
                                      backgroundColor="#fff"
                                      style={stylesItem.reactionIcon}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => makeReaction2('INLOVE')}>
                                    <FontAwesome5Icon
                                      name="heart"
                                      color="#e8304a"
                                      backgroundColor="white"
                                      style={stylesItem.reactionIcon}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => makeReaction2('AMAZING')}>
                                    <FontAwesome5Icon
                                      name="grin-squint"
                                      color="#e8304a"
                                      backgroundColor="white"
                                      style={stylesItem.reactionIcon}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => makeReaction2('SAD')}>
                                    <FontAwesome5Icon
                                      name="frown-open"
                                      color="#e8304a"
                                      backgroundColor="white"
                                      style={stylesItem.reactionIcon}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => makeReaction2('ANGRY')}>
                                    <FontAwesome5Icon
                                      lineBreakMode={false}
                                      name="angry"
                                      color="#e8304a"
                                      backgroundColor="white"
                                      style={stylesItem.reactionIcon}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={stylesItem.commentIcon}>
                                    <FontAwesome5Icon
                                      lineBreakMode={false}
                                      name="comment-alt"
                                      color="gray"
                                      backgroundColor="white"
                                      style={{
                                        ...stylesItem.reactionIcon,
                                        fontSize: 14,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          textAlignVertical: 'center',
                                          fontWeight: 'bold',
                                        }}>
                                        {' '}
                                        {openOffer?.commentsNb}
                                      </Text>
                                    </FontAwesome5Icon>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => onShare(openOffer)}
                                    style={stylesItem.shareIcon}>
                                    <FontAwesome5Icon
                                      name="share-alt"
                                      color="gray">
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          textAlignVertical: 'center',
                                        }}>
                                        {' '}
                                        {openOffer?.shareNb}
                                      </Text>
                                    </FontAwesome5Icon>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          }}
                          ListFooterComponentStyle={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                          }}
                          ListFooterComponent={() => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}>
                                {canLoadMoreComment === true && (
                                  <TouchableOpacity
                                    onPress={() => {
                                      loadMoreComment();
                                    }}
                                    style={{
                                      alignItems: 'center',
                                      backgroundColor: '#ddd',
                                      padding: 5,
                                      width: 'auto',
                                      borderRadius: 5,
                                    }}>
                                    <Text style={{fontSize: 12}}>
                                      {I18n.t('loading_more')}
                                      {loadingMoreComment && (
                                        <ActivityIndicator
                                          animating={true}
                                          color="#007bff"
                                          size="small"
                                          style={
                                            styles.activityIndicatorLoadingComment
                                          }
                                        />
                                      )}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            );
                          }}
                          style={styles.root}
                          data={dataComment}
                          ItemSeparatorComponent={() => {
                            return <View style={styles.separator} />;
                          }}
                          keyExtractor={(item) => {
                            return item.id;
                          }}
                          renderItem={(item, ind) => {
                            const comment = item.item;
                            return (
                              <View style={styles.containerComment}>
                                <TouchableOpacity
                                  // disabled={comment.comments.length === 0}
                                  onPress={() => displaySubComment(comment.id)}>
                                  <FastImage
                                    style={styles.image}
                                    source={{
                                      uri:
                                        comment.user !== null &&
                                        comment.user.photo !== null
                                          ? Config.API_URL_BASE3 +
                                            Config.API_FILE_MINI +
                                            comment.user.photo.uid
                                          : defaultUser,
                                      priority: FastImage.priority.low,
                                      cache: FastImage.cacheControl.immutable,
                                    }}
                                  />
                                </TouchableOpacity>
                                <View style={styles.content}>
                                  <View style={styles.contentHeader}>
                                    <Text style={styles.name}>
                                      {comment?.user?.firstName +
                                        ' ' +
                                        comment?.user?.lastName}
                                    </Text>
                                    <Text style={styles.time}>
                                      {convertDate(comment.createdAt)}
                                    </Text>
                                  </View>
                                  <ViewMoreText
                                    numberOfLines={2}
                                    renderViewMore={renderViewMore}
                                    renderViewLess={renderViewLess}>
                                    <Text
                                      onPress={() =>
                                        displaySubComment(comment.id)
                                      }
                                      rkType="primary3 mediumLine">
                                      {comment.message}
                                    </Text>
                                  </ViewMoreText>
                                  <View style={styles.contentFooter}>
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                        marginTop: 0,
                                      }}>
                                      <Text style={{marginRight: 15}}>
                                        {comment.comments.length}
                                      </Text>
                                      <TouchableOpacity
                                        disabled={comment.comments.length === 0}
                                        onPress={() =>
                                          displaySubComment(comment.id)
                                        }>
                                        <ButtonPaper
                                          style={{height: 10, marginRight: -30}}
                                          mode={'text'}
                                          icon={'comment'}
                                        />
                                      </TouchableOpacity>
                                      <Text
                                        style={{
                                          marginRight: 15,
                                          display: 'none',
                                        }}>
                                        {comment.likesNb !== null
                                          ? comment.likesNb
                                          : 0}
                                      </Text>

                                      <ButtonPaper
                                        style={{
                                          height: 10,
                                          marginRight: -30,
                                          display: 'none',
                                        }}
                                        mode={'text'}
                                        icon={'thumb-up'}
                                        onPress={() => alert('rr')}
                                      />
                                    </View>
                                  </View>
                                  {comment.comments.length > 0 &&
                                    showSubComment === comment.id && (
                                      <View
                                        style={{
                                          flex: 1,
                                        }}>
                                        <FlatList
                                          data={comment.comments}
                                          keyExtractor={(item2, index2) => {
                                            return index2.toString();
                                          }}
                                          renderItem={(it) => {
                                            const comment2 = it.item;
                                            return (
                                              <View
                                                style={
                                                  styles.containerComment2
                                                }>
                                                <TouchableOpacity
                                                  onPress={() => {
                                                    console.log(0);
                                                  }}>
                                                  <FastImage
                                                    style={styles.image2}
                                                    source={{
                                                      uri:
                                                        comment2.user !== null
                                                          ? Config.API_URL_BASE3 +
                                                            Config.API_FILE_MINI +
                                                            comment2.user.photo
                                                              .uid
                                                          : defaultUser,
                                                      priority:
                                                        FastImage.priority.low,
                                                      cache:
                                                        FastImage.cacheControl
                                                          .immutable,
                                                    }}
                                                  />
                                                </TouchableOpacity>
                                                <View style={styles.content}>
                                                  <View
                                                    style={
                                                      styles.contentHeader
                                                    }>
                                                    <Text style={styles.name}>
                                                      {comment2?.user
                                                        ?.firstName +
                                                        ' ' +
                                                        comment2?.user
                                                          ?.lastName}
                                                    </Text>
                                                    <Text style={styles.time}>
                                                      {convertDate(
                                                        comment2.createdAt,
                                                      )}
                                                    </Text>
                                                  </View>
                                                  <ViewMoreText
                                                    numberOfLines={2}
                                                    renderViewMore={
                                                      renderViewMore
                                                    }
                                                    renderViewLess={
                                                      renderViewLess
                                                    }>
                                                    <Text rkType="primary3 mediumLine">
                                                      {comment2.message}
                                                    </Text>
                                                  </ViewMoreText>
                                                  <View
                                                    style={
                                                      styles.contentFooter
                                                    }>
                                                    <View
                                                      style={{
                                                        flex: 1,
                                                        flexDirection:
                                                          'row-reverse',
                                                        marginTop: 0,
                                                      }}
                                                    />
                                                  </View>
                                                </View>
                                              </View>
                                            );
                                          }}
                                        />
                                      </View>
                                    )}
                                </View>
                              </View>
                            );
                          }}
                        />
                      </View>
                      <View style={stylesItem.commentContainer}>
                        <FastImage
                          source={{
                            uri:
                              Config.API_URL_BASE3 +
                              Config.API_FILE_MINI +
                              props.user?.photo?.uid,
                            priority: FastImage.priority.low,
                            cache: FastImage.cacheControl.immutable,
                          }}
                          defaultSource={require('../Image/pre.gif')}
                          style={stylesItem.commentAvatar}
                        />
                        <View style={stylesItem.commentInput}>
                          <TextInput
                            style={[stylesItem.commentInputWrapper]}
                            placeholder={
                              showSubComment === -1
                                ? I18n.t('comment_post')
                                : I18n.t('respond_to_comment')
                            }
                            placeholderTextColor="#000"
                            keyboardType="default"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
                            underlineColorAndroid="#f000"
                            returnKeyType="next"
                            label="Message"
                            value={commentMsg}
                            onChangeText={(text) => setCommentMsg(text)}
                          />
                        </View>
                        <ButtonPaper
                          loading={sendingComment}
                          color={'#007bff'}
                          compact={true}
                          mode={'text'}
                          icon={'send'}
                          onPress={() => commentItem()}
                        />
                      </View>
                    </KeyboardAvoidingView>
                  </Modal>
                )}
              </Portal>
            </Provider>
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
    isLogin: state.userState.isLogin,
    lang: state.userState.lang,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupPostScreen);
