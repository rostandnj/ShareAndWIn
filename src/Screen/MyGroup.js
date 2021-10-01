import React, {useState} from 'react';
import {View, StyleSheet, Text, Platform, Image} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import variables from '../var/variables';
import Config from '../var/config';
import {Button as ButtonPaper} from 'react-native-paper';
import I18n from '../i18n/i18n';
import API from '../api/fetch';

const MyGroup = () => {
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
      dim.width = variables.deviceWidth * 0.95;
      dim.height = Platform.OS === 'ios' ? 90 : 90;
    },
  );
  const [lastGroupSize, setLastGroupSize] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const rowRenderer = (type, item, index) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 0,
          width: '100%',
          borderBottomColor: '#efefef',
          borderTopColor: '#efefef',
          borderBottomWidth: 1,
          borderTopWidth: 1,
          paddingVertical: 10,
        }}>
        <Image
          source={{
            uri: Config.API_URL_BASE3 + Config.API_FILE + item.avatar?.uid,
          }}
          defaultSource={require('../Image/pre.gif')}
          style={{
            width: '25%',
            height: 70,
            alignSelf: 'center',
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              height: '50%',
              marginHorizontal: 5,
              marginVertical: 0,
              backgroundColor: 'transparent',
              paddingTop: 0,
            }}>
            <Text
              style={{
                // flex: 1,
                fontSize: 20,
                fontWeight: '100',
                // fontFamily: 'sans-serif',
                marginBottom: 4,
                color: '#000',
              }}>
              {item?.name.length <= 35 ? item?.name : item?.name.substr(0, 35)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              height: 40,
              marginHorizontal: 5,
              paddingTop: 0,
              alignItems: 'flex-end',
              backgroundColor: 'transparent',
              // marginLe,
            }}>
            <ButtonPaper
              contentStyle={{width: 50}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="message-text"
              mode="text"
              onPress={() => console.log('Pressed')}>
              0
            </ButtonPaper>
            <ButtonPaper
              contentStyle={{width: 50}}
              style={{marginRight: 10}}
              uppercase={false}
              compact={true}
              color={'#007bff'}
              icon="account-group"
              mode="text"
              onPress={() => console.log(index)}>
              {item.numberOfMembers === null ? 0 : item.numberOfMembers}
            </ButtonPaper>
          </View>
        </View>
      </View>
    );
  };
  const renderMyGroupFooter = () => {
    if (lastGroupSize >= pageSize) {
      return (
        <View
          style={{
            height: 50,
            width: variables.deviceWidth,
            alignItems: 'center',
            paddingTop: 15,
          }}>
          <ButtonPaper
            contentStyle={{}}
            uppercase={false}
            compact={true}
            color={'#007bff'}
            mode="text"
            onPress={() => loadMoreGroup()}>
            {I18n.t('loading_more')}
          </ButtonPaper>
        </View>
      );
    } else {
      return <></>;
    }
  };
  const loadMoreGroup = () => {
    if (!loadingMoreGroup) {
      setLoadingMoreGroup(true);
      let url =
        Config.API_URL_BASE4 +
        Config.API_USER_GROUPS +
        userId +
        '?pageSize=' +
        pageSize +
        '&pageno=' +
        pageMyGroupNo +
        '&sortby=id';
      API.get(url)
        .then((res) => {
          let result = res.data.data;
          result.forEach((e) => {
            groups.push(e);
          });
          setGroups(groups);
          setDataProvider(dataProvider.cloneWithRows(groups));
          setLoadingMoreGroup(false);
          setPageMyGroupNo(pageMyGroupNo + 1);
          console.log(groups.length);
        })
        .then((res2) => {})
        .catch((error) => {
          setLoadingMoreGroup(false);
          console.log(error);
        });
    }
  };
  return (
    <View style={[styles.scene, {backgroundColor: '#fff'}]}>
      {dataProvider.getSize() > 0 && (
        <RecyclerListView
          layoutProvider={layoutProvider}
          isHorizontal={false}
          dataProvider={dataProvider}
          rowRenderer={rowRenderer}
          // onEndReached={loadMoreGroup}
          renderFooter={renderMyGroupFooter}
        />
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
});

export default MyGroup;
