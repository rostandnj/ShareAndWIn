import React, {useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Config from '../var/config';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScaledImage from './ScaledImage';
import variables from '../var/variables';
import {parse} from 'fecha';
import TimeAgo from 'javascript-time-ago';

const PostItem = (props) => {
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
                props.offer.avatar?.uid,
            }}
            defaultSource={require('../Image/user.jpeg')}
          />
          <View style={stylesItem.infoWrapper}>
            <View style={stylesItem.namesWrapper}>
              <TouchableOpacity onPress={() => console.log('')}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {props.offer?.company?.name}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={stylesItem.extraInfoWrapper}>
              <Text style={{color: '#333', fontSize: 14}}>
                {props.convertDate(props.offer.publishedAt)}
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
          {props.offer?.title}
        </Text>
      </View>
      <View style={stylesItem.contentContainer}>
        <Text numberOfLines={2} style={stylesItem.paragraph}>
          {props.offer?.description}
        </Text>
      </View>

      <View style={stylesItem.imageContainer}>
        <ScaledImage
          height={400}
          source={
            Config.API_URL_BASE3 +
            Config.API_FILE_MEDIUM +
            props.offer.avatar?.uid
          }
          defaultSource={require('../Image/pre.gif')}
        />
      </View>
      <View horizontal={true} style={stylesItem.reactionContainer}>
        <Text style={{fontWeight: 'bold', color: 'gray'}}>
          {intToK(parseInt(props.offer?.likesNb, 10))}
        </Text>
        <TouchableOpacity
          onPress={() => props.makeReaction('LIKE', props.offer.id)}>
          <FontAwesome5Icon
            name="thumbs-up"
            color="#318bfb"
            backgroundColor="#fff"
            style={stylesItem.reactionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.makeReaction('INLOVE', props.offer.id)}>
          <FontAwesome5Icon
            name="heart"
            color="#e8304a"
            backgroundColor="white"
            style={stylesItem.reactionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.makeReaction('AMAZING', props.offer.id)}>
          <FontAwesome5Icon
            name="grin-squint"
            color="#e8304a"
            backgroundColor="white"
            style={stylesItem.reactionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.makeReaction('SAD', props.offer.id)}>
          <FontAwesome5Icon
            name="frown-open"
            color="#e8304a"
            backgroundColor="white"
            style={stylesItem.reactionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.makeReaction('ANGRY', props.offer.id)}>
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
          onPress={() => props.showModalComment(props.offer)}>
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
              {props.offer?.commentsNb}
            </Text>
          </FontAwesome5Icon>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.onShare(props.offer)}
          style={stylesItem.shareIcon}>
          <FontAwesome5Icon name="share-alt" color="gray">
            <Text style={{fontSize: 12, textAlignVertical: 'center'}}>
              {' '}
              {props.offer?.shareNb}
            </Text>
          </FontAwesome5Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default PostItem;
