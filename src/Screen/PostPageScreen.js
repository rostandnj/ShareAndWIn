import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Share,
} from 'react-native';
import variables from '../var/variables';
import {Button as ButtonPaper} from 'react-native-paper';
import ScaledImage from './../Components/ScaledImage';
import Config from '../var/config';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import I18n from '../i18n/i18n';
import FastImage from 'react-native-fast-image';
import ViewMoreText from 'react-native-view-more-text';
import {useFocusEffect} from '@react-navigation/native';
import * as RootNavigation from '../rootNavigation';
import {DataProvider} from 'recyclerlistview';
import axios from 'axios';
import API from '../api/fetch';
import UserAction from '../redux/actions/user';
import {connect} from 'react-redux';
import {parse} from 'fecha';
import TimeAgo from 'javascript-time-ago';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import ScaledImageSimple from '../Components/ScaledImageSimple';
const defaultUser = variables.defaultUser;

const PostPageScreen = (props) => {
  const [showSubComment, setShowSubComment] = useState(-1);
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const [openOffer, setOpenOffer] = useState(null);
  const [dataComment, setDataComment] = useState([]);
  const [commentMsg, setCommentMsg] = useState('');
  const [hidden, setHidden] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [sendingComment, setSendingComment] = useState(false);
  const [commentOffset, setCommentOffset] = useState(0);
  const [canLoadMoreComment, setCanLoadMoreComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [showSecondDialogReaction, setShowSecondDialogReaction] = useState(
    false,
  );
  const timeAgo = new TimeAgo('en-US');
  const mainComments = useRef();
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
  const offerLength = React.useRef(0);
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
  const displaySubComment = (index) => {
    if (index === showSubComment) {
      setShowSubComment(-1);
    } else {
      setShowSubComment(index);
    }
  };
  const makeReaction2 = (code) => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_MAKE_REACTION +
      '?idOffer=' +
      props.openOffer.id +
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
          props.sendOpenOffer(res.data.data.offer);
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
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        RootNavigation.navigate(props.openOffer.from, {});
        setDataComment([]);
        setLoading(false);
        setLoadingMore(false);
        setDataProviderComment(
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
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
      console.log('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
      console.log('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let cancel;
    let started = true;
    const fetchData = async () => {
      console.log('loading offer comment');
      try {
        setLoading(true);
        setCommentOffset(0);
        const url =
          Config.API_URL_BASE4 +
          Config.API_COMPANY_GET_COMMENT +
          '?offerId=' +
          props.openOffer.id +
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
            offerLength.current = result.length;
            setLoading(false);
            setDataComment(result);
            setTotalPage(response.data.data.totalPage);
            if (offerLength.current > 0) {
              setDataProviderComment(
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
        console.log(error.response?.data?.error);
        alert('Oups an error occur');
      }
    };

    fetchData();

    return () => cancel();
  }, [pageSize, props, props.openOffer]);
  const loadMore = () => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_GET_COMMENT +
      '?offerId=' +
      props.openOffer.id +
      '&pageSize=' +
      pageSize +
      '&pageno=' +
      (pageNo + 1).toString() +
      '&sortby=id';

    console.log(url);
    console.log(totalPage);
    console.log(pageNo);
    if (loadingMore === false && pageNo + 1 < totalPage) {
      console.log('more');
      setLoadingMore(true);
      API.get(url)
        .then((res) => {
          setLoadingMore(false);
          const result = res.data.data.content;
          result.forEach((e) => {
            dataComment.push(e);
          });
          setDataComment(dataComment);
          setTotalPage(res.data.data.totalPage);
          setPageNo(pageNo + 1);
          setDataProviderComment(
            new DataProvider((r1, r2) => {
              return r1 !== r2;
            }).cloneWithRows(dataComment),
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
  const commentItem = () => {
    const url =
      Config.API_URL_BASE4 +
      Config.API_COMPANY_MAKE_COMMENT +
      '?idOffer=' +
      props.openOffer.id +
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
          setOpenOffer(res.data.data.offer);
          props.sendOpenOffer(res.data.data.offer);
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
  const convertDate = (date) => {
    return timeAgo.format(
      new Date(parse(date.split('.')[0], 'YY-MM-DDTHH:mm:ss')),
    );
  };

  return (
    <View>
      {props.openOffer !== undefined && (
        <View style={{flex: 1}}>
          <View
            style={{
              height: 50,
              width: variables.deviceWidth,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: Platform.OS === 'ios' ? 40 : 0,
              backgroundColor: '#0099ff',
            }}>
            <View
              style={{
                width: 60,
                flexDirection: 'row',
                marginTop: 0,
                paddingTop: 5,
              }}>
              <ButtonPaper
                loading={sendingComment || loading || loadingMore}
                containerStyle={{width: 40, height: 40}}
                labelStyle={{fontSize: 22, fontWeight: 'bold'}}
                onPress={() => {
                  console.log(props.openOffer.from);
                  RootNavigation.navigate(
                    props.openOffer.from === undefined
                      ? 'home'
                      : props.openOffer.from,
                    {},
                  );
                }}
                icon="arrow-left"
                color="#fff"
                mode={'text'}
              />
            </View>
            <View
              style={{
                width: variables.deviceWidth - 40,
                flexDirection: 'row',
                marginTop: 10,
                paddingRight: 15,
              }}>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  flexWrap: 'wrap',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#fff',
                }}>
                {props.openOffer?.company?.name}
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
            ref={mainComments}
            style={{
              height:
                Platform.OS === 'ios'
                  ? variables.workingScreenHeigth - 60 - 70 - 30
                  : variables.deviceHeight -
                    50 -
                    variables.deviceStatusBar -
                    70,
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
                        {props.openOffer?.title}
                      </Text>
                    </View>
                    <View style={stylesItem.contentContainerModal}>
                      <Text style={stylesItem.paragraph}>
                        {props.openOffer?.description}
                      </Text>
                    </View>
                    <View style={stylesItem.imageContainer}>
                      <ScaledImageSimple
                        height={400}
                        source={
                          Config.API_URL_BASE3 +
                          Config.API_FILE_MEDIUM +
                          props.openOffer.avatar?.uid
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
                        {intToK(parseInt(props.openOffer?.likesNb, 10))}
                      </Text>
                      <TouchableOpacity onPress={() => makeReaction2('LIKE')}>
                        <FontAwesome5Icon
                          name="thumbs-up"
                          color="#318bfb"
                          backgroundColor="#fff"
                          style={stylesItem.reactionIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => makeReaction2('INLOVE')}>
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
                      <TouchableOpacity onPress={() => makeReaction2('SAD')}>
                        <FontAwesome5Icon
                          name="frown-open"
                          color="#e8304a"
                          backgroundColor="white"
                          style={stylesItem.reactionIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => makeReaction2('ANGRY')}>
                        <FontAwesome5Icon
                          lineBreakMode={false}
                          name="angry"
                          color="#e8304a"
                          backgroundColor="white"
                          style={stylesItem.reactionIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={stylesItem.commentIcon}>
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
                            {props.openOffer?.commentsNb}
                          </Text>
                        </FontAwesome5Icon>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => onShare(props.openOffer)}
                        style={stylesItem.shareIcon}>
                        <FontAwesome5Icon name="share-alt" color="gray">
                          <Text
                            style={{
                              fontSize: 12,
                              textAlignVertical: 'center',
                            }}>
                            {' '}
                            {props.openOffer?.shareNb}
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
                          {loadingMore && (
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
                            comment.user !== null && comment.user.photo !== null
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
                          <Text style={{marginRight: 15}}>
                            {comment.comments.length}
                          </Text>
                          <TouchableOpacity
                            //disabled={comment.comments.length === 0}
                            onPress={() => displaySubComment(comment.id)}>
                            <ButtonPaper
                              style={{height: 10, marginRight: -30}}
                              mode={'text'}
                              color={'#acacac'}
                              icon={'comment'}
                            />
                          </TouchableOpacity>
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
                                  <View style={styles.containerComment2}>
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
                                                comment2.user.photo.uid
                                              : defaultUser,
                                          priority: FastImage.priority.low,
                                          cache:
                                            FastImage.cacheControl.immutable,
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
              }}
            />
          </View>
          <View style={[stylesItem.commentContainer]}>
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
                    ? '  ' + I18n.t('comment_post')
                    : '  ' + I18n.t('respond_to_comment')
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
        </View>
      )}
      {props.openOffer === undefined && (
        <View>
          <Text>loading</Text>
        </View>
      )}
    </View>
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
    backgroundColor: '#fff',
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
    height: 40,
    justifyContent: 'center',
    borderRadius: 2,
    // paddingHorizontal: 5,
    // paddingVertical: 3,
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
    paddingBottom: 10,
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    flexWrap: 'nowrap',
    height: 50,
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
    openOffer: state.userState.openOffer,
    isLogin: state.userState.isLogin,
    lang: state.userState.lang,
    data: state.signin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendOpenOffer: (data) => dispatch(UserAction.updateOpenOffer(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostPageScreen);
