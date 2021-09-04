import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
  SectionList,
  FlatList,
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
  const ListItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Image
          source={{
            uri: item.uri,
          }}
          style={styles.itemPhoto}
          resizeMode="cover"
        />
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
      <View style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={{flex: 1}}>
          <SectionList
            contentContainerStyle={{paddingHorizontal: 10}}
            stickySectionHeadersEnabled={false}
            sections={SECTIONS}
            renderSectionHeader={({section}) => (
              <>
                <Text style={styles.sectionHeader}>{section.title}</Text>
                {section.horizontal ? (
                  <FlatList
                    horizontal
                    data={section.data}
                    renderItem={({item}) => <ListItem item={item} />}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : null}
              </>
            )}
            renderItem={({item, section}) => {
              if (section.horizontal) {
                return null;
              }
              return <ListItem item={item} />;
            }}
          />
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

const SECTIONS = [
  {
    title: 'Made for you',
    horizontal: true,
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/10/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1002/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1006/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1008/200',
      },
    ],
  },
  {
    title: 'Punk and hardcore',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1011/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1012/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1013/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1015/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1016/200',
      },
    ],
  },
  {
    title: 'Based on your recent listening',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1020/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1024/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1027/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1035/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1038/200',
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  sectionHeader: {
    fontWeight: '800',
    fontSize: 18,
    color: '#f4f4f4',
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    margin: 10,
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
});

const stylesOLd = StyleSheet.create({
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
