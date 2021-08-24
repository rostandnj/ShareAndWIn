import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import variables from '../var/variables';
import API from '../api/fetch';
import Config from '../var/config';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Button as ButtonPaper,
  Card,
  IconButton,
  Paragraph,
} from 'react-native-paper';
import I18n from '../i18n/i18n';

const GroupScreen = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(15);
  const [pageNo, setPageNo] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
  );
  const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
  };
  const layoutProvider = new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = variables.deviceWidth * 0.499;
      dim.height = Platform.OS === 'ios' ? 210 : 210;
    },
  );
  useEffect(() => {
    AsyncStorage.getItem('user').then((uid) => {
      setUserId(JSON.parse(uid).userId);
      if (!hasLoaded) {
        setLoading(true);
        let url =
          Config.API_URL_BASE4 +
          Config.API_USER_GROUPS +
          JSON.parse(uid).userId;
        API.get(url)
          .then((res) => {
            let result = res.data.data;
            setHasLoaded(true);
            setLoading(false);
            setGroups(result);

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
            console.log(error);
          });
      }
    });
  }, [hasLoaded]);
  const rowRenderer = (type, item, index) => {
    return (
      <Card
        style={{
          alignItems: 'center',
          borderWidth: 0,
          backgroundColor: '#fdfdfd',
          borderRadius: 5,
          margin: 2,
        }}>
        <Card.Cover
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          style={{
            padding: 0,
            margin: 0,
            borderRadius: 0,
            height: 120,
            width: variables.deviceWidth * 0.499 - 4,
          }}
          defaultSource={require('../Image/pre.gif')}
        />
        <Card.Content
          style={{
            width: '100%',
            marginLeft: '-3%',
            marginBottom: 1,
            marginTop: 10,
            height: 40,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}} numberOfLines={1}>
            {item?.name}
          </Text>
        </Card.Content>
        <Card.Actions
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: '2%',
            paddingRight: '2%',
            paddingBottom: '2%',
            marginTop: -15,
          }}>
          <ButtonPaper
            contentStyle={{
              width: (variables.deviceWidth * 0.45) / 2,
            }}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="account-group"
            mode="outlined"
            onPress={() => console.log(index)}>
            {item.numberOfMembers === null ? 0 : item.numberOfMembers}
          </ButtonPaper>
          <ButtonPaper
            contentStyle={{width: (variables.deviceWidth * 0.45) / 2}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            icon="message-text"
            mode="outlined"
            onPress={() => console.log('Pressed')}>
            0
          </ButtonPaper>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.center} behavior="height" enabled>
      <ScrollView>
        <View style={[styles.container]}>
          <View
            style={{
              backgroundColor: '#fff',
              height: variables.deviceHeight - 50,
              width: variables.deviceWidth,
              marginBottom: 50,
            }}>
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                backgroundColor: '#47a2f3',
                paddingTop: Platform.OS === 'ios' ? 30 : 5,
              }}>
              <IconButton
                icon="account-group"
                color={'#fff'}
                onPress={() => {}}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginTop: 10,
                }}>
                {I18n.t('groups')}
              </Text>
              <ActivityIndicator
                animating={loading}
                color="#fff"
                size="small"
                style={styles.activityIndicator}
              />
            </View>
            {dataProvider.getSize() > 0 && (
              <RecyclerListView
                layoutProvider={layoutProvider}
                isHorizontal={false}
                dataProvider={dataProvider}
                rowRenderer={rowRenderer}
                renderAheadOffset={Platform.OS === 'ios' ? 15 * 380 : 15 * 365}
                onEndReachedThreshold={
                  Platform.OS === 'ios'
                    ? variables.deviceHeight * 2
                    : variables.deviceHeight
                }
                /*renderFooter={renderFooter}*/
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  center: {
    height: variables.deviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    width: variables.deviceWidth,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: variables.deviceWidth,
  },
});
export default GroupScreen;
