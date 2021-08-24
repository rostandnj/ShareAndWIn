import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ScaledImage from './ScaledImage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as navigation from '../rootNavigation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {permission} from '../constants';
import Config, {API_COMPANY_MAKE_COMMENT} from '../var/config';

class PagePostItem extends Component {
  constructor(props) {
    super(props);
  }
  onPressHandle() {
    const {comments} = this.props.item;
    navigation.navigate('CommentsPopUp', {
      comments,
    });
  }
  onPressPostOptionsIconHandler() {
    const {item} = this.props;
    navigation.navigate('PostOptions', {
      postDetail: item,
    });
  }
  onPressPostImageHandler(postId) {
    navigation.navigate('PagePostDetail', {
      postId,
    });
  }
  onPressShareHandler() {
    const {item} = this.props;
    navigation.navigate('SharePost', {
      id: item.id,
    });
  }
  onPressProfileHandler(userId) {
    const user = {id: 'gggg'};
    if (userId === user.id) {
      return navigation.navigate('Profile');
    }
    navigation.push('ProfileX', {
      userId,
    });
  }
  render() {
    const {item} = this.props;
    return (
      <View style={stylesItem.item}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={stylesItem.customListView}>
            <Image
              style={stylesItem.avatar}
              source={{
                uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
              }}
            />
            <View style={stylesItem.infoWrapper}>
              <View style={stylesItem.namesWrapper}>
                <TouchableOpacity
                  onPress={this.onPressProfileHandler.bind(this, item?.id)}>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    {item?.company?.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={stylesItem.extraInfoWrapper}>
                <Text style={{color: '#333', fontSize: 14}}>{'12h'}</Text>
                <Text style={{fontSize: 16, marginHorizontal: 5}}>·</Text>
                <FontAwesome5Icon color="#333" name="globe-asia" />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={this.onPressPostOptionsIconHandler.bind(this)}
            style={{width: 25, alignItems: 'center'}}>
            <Icon name="ellipsis-h" color="#000" />
          </TouchableOpacity>
        </View>
        <View style={stylesItem.contentContainer}>
          <Text style={stylesItem.paragraph}>{item?.description}</Text>
        </View>
        <TouchableOpacity
          onPress={this.onPressPostImageHandler.bind(this, item.id)}>
          <View style={stylesItem.imageContainer}>
            <ScaledImage
              height={300}
              source={Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid}
            />
          </View>
        </TouchableOpacity>
        <View horizontal={true} style={stylesItem.reactionContainer}>
          <TouchableOpacity>
            <Icon
              name="thumbs-up"
              color="#318bfb"
              backgroundColor="#fff"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="heart"
              color="#e8304a"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="grin-squint"
              color="#f7ca51"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="surprise"
              color="#f7ca51"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="sad-tear"
              color="#f7ca51"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              lineBreakMode={false}
              name="angry"
              color="#dc4311"
              backgroundColor="white"
              style={stylesItem.reactionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressHandle.bind(this)}>
            <Icon
              lineBreakMode={false}
              name="comment-alt"
              color="gray"
              backgroundColor="white"
              style={{...stylesItem.reactionIcon, fontSize: 14}}>
              <Text style={{fontSize: 12}}> {item?.commentsNb} comments</Text>
            </Icon>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onPressShareHandler.bind(this)}
            style={stylesItem.shareIcon}>
            <Icon name="share-alt" color="gray">
              <Text style={{fontSize: 12, textAlignVertical: 'center'}}>
                {' '}
                Share
              </Text>
            </Icon>
          </TouchableOpacity>
        </View>
        <View style={stylesItem.commentContainer}>
          <Image
            source={{
              uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
            }}
            style={stylesItem.commentAvatar}
          />
          <View style={stylesItem.commentInput}>
            <TouchableOpacity
              onPress={this.onPressHandle.bind(this)}
              style={stylesItem.commentInputWrapper}>
              <Text>Comment...</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Icon
              style={stylesItem.btnSendComment}
              name="paper-plane"
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default PagePostItem;
const screenWidth = Math.round(Dimensions.get('window').width);
const stylesItem = StyleSheet.create({
  customListView: {
    padding: 15,
    width: screenWidth - 40,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  infoWrapper: {
    marginLeft: 8,
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
    flexDirection: 'row',
  },
  commentInputWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  paragraph: {},
  contentContainer: {
    paddingHorizontal: 15,
  },
  imageContainer: {
    marginTop: 5,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionContainer: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  reactionIcon: {
    fontSize: 20,
    padding: 10,
  },
  shareIcon: {
    position: 'absolute',
    fontSize: 14,
    padding: 10,
    right: 0,
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
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 20,
    marginLeft: 10,
    height: 30,
    width: screenWidth - 15 * 2 - 60,
  },
  btnSendComment: {
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
  },
});
