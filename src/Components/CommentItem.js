import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Config from '../var/config';
import ViewMoreText from 'react-native-view-more-text';
import {Button as ButtonPaper} from 'react-native-paper';
import variables from '../var/variables';
import I18n from '../i18n/i18n';
const defaultUser = variables.defaultUser;

const CommentItem = (props) => {
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
    <View style={styles.containerComment}>
      <TouchableOpacity
        disabled={props.comment.comments.length === 0}
        onPress={() => displaySubComment(props.comment.id)}>
        <Image
          style={styles.image}
          source={{
            uri:
              props.comment.user !== null && props.comment.user.photo !== null
                ? Config.API_URL_BASE3 +
                  Config.API_FILE_MINI +
                  props.comment.user.photo.uid
                : defaultUser,
          }}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.name}>
            {props.comment?.user?.firstName +
              ' ' +
              props.comment?.user?.lastName}
          </Text>
          <Text style={styles.time}>
            {props.convertDate(props.comment.createdAt)}
          </Text>
        </View>
        <ViewMoreText
          numberOfLines={2}
          renderViewMore={renderViewMore}
          renderViewLess={renderViewLess}>
          <Text
            onPress={() => displaySubComment(props.comment.id)}
            rkType="primary3 mediumLine">
            {props.comment.message}
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
              {props.comment.comments.length}
            </Text>
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
              {props.comment.likesNb !== null ? props.comment.likesNb : 0}
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
        {props.comment.comments.length > 0 &&
          showSubComment === props.comment.id && (
            <View
              style={{
                flex: 1,
              }}>
              <FlatList
                data={props.comment.comments}
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
export default CommentItem;
