import React, {useState} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import variables from '../var/variables';
import {Button as ButtonPaper} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScaledImage from './ScaledImage';
import Config from '../var/config';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import I18n from '../i18n/i18n';
import FastImage from 'react-native-fast-image';
import ViewMoreText from 'react-native-view-more-text';
const defaultUser = variables.defaultUser;

const PostPage = (props) => {
  const [showSubComment, setShowSubComment] = useState(-1);
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
  return (
    <>
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
            loading={props.sendingComment}
            containerStyle={{width: 50, height: 50}}
            labelStyle={{fontSize: 22, fontWeight: 'bold'}}
            onPress={() => props.hideModalComment()}
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
            {props.openOffer?.company?.name}
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
            onPress={() => props.hideModalComment()}
            mode={'text'}>
            <Icon name="dots-horizontal" size={32} color="#000" />
          </ButtonPaper>
        </View>
      </View>
      <View
        ref={props.mainComments}
        style={{
          height:
            Platform.OS === 'ios'
              ? variables.deviceHeight - 150
              : variables.deviceHeight - 100 - variables.deviceSoftMenuHeight,
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
                  <ScaledImage
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
                    {props.intToK(parseInt(props.openOffer?.likesNb, 10))}
                  </Text>
                  <TouchableOpacity onPress={() => props.makeReaction2('LIKE')}>
                    <FontAwesome5Icon
                      name="thumbs-up"
                      color="#318bfb"
                      backgroundColor="#fff"
                      style={stylesItem.reactionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => props.makeReaction2('INLOVE')}>
                    <FontAwesome5Icon
                      name="heart"
                      color="#e8304a"
                      backgroundColor="white"
                      style={stylesItem.reactionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => props.makeReaction2('AMAZING')}>
                    <FontAwesome5Icon
                      name="grin-squint"
                      color="#e8304a"
                      backgroundColor="white"
                      style={stylesItem.reactionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.makeReaction2('SAD')}>
                    <FontAwesome5Icon
                      name="frown-open"
                      color="#e8304a"
                      backgroundColor="white"
                      style={stylesItem.reactionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => props.makeReaction2('ANGRY')}>
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
                    onPress={() => props.onShare(props.openOffer)}
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
                {props.canLoadMoreComment === true && (
                  <TouchableOpacity
                    onPress={() => {
                      props.loadMoreComment();
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
                      {props.loadingMoreComment && (
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
          data={props.dataComment}
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
                      {comment?.user?.firstName + ' ' + comment?.user?.lastName}
                    </Text>
                    <Text style={styles.time}>
                      {props.convertDate(comment.createdAt)}
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
                        disabled={comment.comments.length === 0}
                        onPress={() => displaySubComment(comment.id)}>
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
                                      cache: FastImage.cacheControl.immutable,
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
                                      {props.convertDate(comment2.createdAt)}
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
            value={props.commentMsg}
            onChangeText={(text) => props.setCommentMsg(text)}
          />
        </View>
        <ButtonPaper
          loading={props.sendingComment}
          color={'#007bff'}
          compact={true}
          mode={'text'}
          icon={'send'}
          onPress={() => props.commentItem()}
        />
      </View>
    </>
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
    padding: 5,
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
export default PostPage;
