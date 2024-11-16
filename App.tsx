import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {fetchNewsFromServer} from './src/network';
import {useInterval} from './src/hooks/useInterval';
import {COLOR_BLACK, COLOR_WHITE} from './src/utils/colors';
import {NewsItem, RefreshButton} from './src/components';
import {moderateScale} from './src/utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

type dataTypes = {
  title: string;
  pinned: boolean;
  id: number;
  read: boolean;
};

type pinnedMessageType = {
  title: string;
  id: number;
};

type refType = {
  startAnimation: () => void;
};

function App(): JSX.Element {
  const [refreshPressed, setRefreshPressed] = useState(true);
  const [newsDataState, setNewsDataState] = useState<dataTypes[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<pinnedMessageType>({
    title: '',
    id: -1,
  });
  const [reloadNews, setReloadNews] = useState<boolean>(false);
  const pinnedMessageExists = pinnedMessage?.title?.length;
  const [isErrorOnFetching, setIsErrorOnFetching] = useState<boolean>(false);

  const refreshRef = useRef<refType>(null);

  useEffect(() => {
    SplashScreen.hide();
    setRefreshPressed(false);
  }, []);

  useEffect(() => {
    (async () => {
      const pinnedNews = await AsyncStorage.getItem('pinnedNews');
      if (pinnedNews) {
        setPinnedMessage(JSON.parse(pinnedNews));
      } else {
        fetchNewsFromServer(setReloadNews, reloadNews, setIsErrorOnFetching);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const newsData = await AsyncStorage.getItem('news');
      if (newsData) {
        setNewsDataState(
          JSON.parse(newsData)
            ?.filter((item: dataTypes) => !item?.read)
            ?.map((item: dataTypes) => ({...item, read: true})),
        );
        setRefreshPressed(false);
        refreshRef?.current?.startAnimation();
      }
    })();
  }, [reloadNews]);

  const reloadNewsFunction = async () => {
    const newsDataAsync = await AsyncStorage.getItem('news');
    if (newsDataAsync?.length && newsDataAsync !== '[]') {
      const parsedData = JSON.parse(newsDataAsync);
      parsedData?.splice(0, 10);
      await AsyncStorage.setItem('news', JSON.stringify(parsedData));
      setReloadNews(prev => !prev);
    } else {
      fetchNewsFromServer(setReloadNews, reloadNews, setIsErrorOnFetching);
    }
  };

  useInterval(
    async () => {
      const cloneState = [...newsDataState];
      if (cloneState?.length) {
        cloneState?.splice(0, 10);
      }
      reloadNewsFunction();
    },
    !refreshPressed ? 10000 : null,
  );

  const pinnedComponent = () =>
    pinnedMessageExists ? (
      <NewsItem
        pinned={true}
        title={pinnedMessage?.title}
        onPressPin={() => {
          AsyncStorage.removeItem('pinnedNews');
          setPinnedMessage({title: '', id: -1});
        }}
      />
    ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Top News Articles!</Text>
        {newsDataState?.length ? (
          <RefreshButton
            ref={refreshRef}
            onPressRefresh={() => {
              reloadNewsFunction();
              setRefreshPressed(true);
              refreshRef?.current?.startAnimation();
            }}
          />
        ) : null}
      </View>
      <View style={styles.secondaryContainer}>
        {pinnedComponent()}

        {newsDataState?.length ? (
          <FlatList
            data={newsDataState?.slice(0, 10) as ArrayLike<dataTypes>}
            renderItem={({item, index}: {item: dataTypes; index: number}) => (
              <NewsItem
                key={'key:' + index}
                title={item?.title?.substring(0, 60) + '...'}
                onPressPin={() => {
                  AsyncStorage.setItem('pinnedNews', JSON.stringify(item));
                  setPinnedMessage(item);
                }}
                onPressDelete={() => {
                  setNewsDataState(prev => {
                    const cloneState = [...prev];
                    cloneState.splice(index, 1);
                    return cloneState;
                  });
                }}
              />
            )}
          />
        ) : (
          <View style={styles.fetchingContainer}>
            <Text style={styles.fetchingText}>
              {isErrorOnFetching ? 'Something went wrong...' : 'Fetching...'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    padding: moderateScale(10),
  },
  secondaryContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: COLOR_BLACK,
    fontSize: moderateScale(20),
    marginBottom: moderateScale(10),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  fetchingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fetchingText: {
    color: COLOR_BLACK,
  },
});

export default App;
