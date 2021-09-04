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
  ScrollView,
  Button,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {connect} from 'react-redux';
import {
  Button as ButtonPaper,
  Card,
  Paragraph,
  Avatar,
  IconButton,
  Dialog,
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
import RecyclerListViewWithHeader from '../Components/RecyclerListViewWithHeader';
import FastImage from 'react-native-fast-image';

// English.
import en from 'javascript-time-ago/locale/en';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ScaledImage from '../Components/ScaledImage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProgressBar from 'react-native-progress/Bar';

TimeAgo.addLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;
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
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];
const HomeScreen = (props) => {
  const [offers, setOffers] = useState([]);
  const [openOffer, setOpenOffer] = useState(null);
  const [openOfferIndex, setOpenOfferIndex] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [pageSize, setPageSize] = useState(15);
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
      dim.height = Platform.OS === 'ios' ? 490 : 490;
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
          <Text numberOfLines={4} style={stylesItem.paragraph}>
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
        })
        .then((res2) => {})
        .catch((error) => {
          setHasLoaded(true);
          setLoading(false);
          console.log(error.response?.data?.error);
          alert('Oups an error occure');
        });
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
  const handleSearch = (text) => {};
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '5%',
        }}
      />
    );
  };
  const emptyList = () => {
    if (!loading && offers.length === 0) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
          }}>
          <Text>no offer found</Text>
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          height: 0,
        }}
      />
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
            alert('Oups an error occured');
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
            alert('Oups an error occured');
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
            <TouchableHighlight
              style={{
                flex: 1,
              }}
              onPress={() => console.log()}>
              <Icon name="card-search" color="#fff" size={69} />
            </TouchableHighlight>
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
              color={'#fff'}
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
                            paddingTop: 0,
                          }}>
                          <ButtonPaper
                            loading={sendingComment}
                            style={{paddingTop: 5}}
                            onPress={() => hideModalComment()}
                            mode={'text'}>
                            <Icon name="arrow-left" size={32} color="#000" />
                          </ButtonPaper>
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
                            <Icon name="dots-vertical" size={32} color="#000" />
                          </ButtonPaper>
                        </View>
                      </View>
                      <View
                        ref={mainComments}
                        style={{
                          height:
                            Platform.OS === 'ios'
                              ? variables.deviceHeight - 150
                              : variables.deviceHeight - 110,
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

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    isLogin: state.userState.isLogin,
    lang: state.userState.lang,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
