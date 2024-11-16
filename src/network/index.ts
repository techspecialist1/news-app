import {BASE_URL, NEWS_API_KEY} from '../utils/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Item = {
  title: string;
};

const fetchNewsFromServer = async (
  setReloadNews: (prev: boolean) => void,
  reloadNews: boolean,
  setIsErrorOnFetching: (text: boolean) => void,
) => {
  try {
    const response = await fetch(
      BASE_URL + 'apiKey=' + NEWS_API_KEY + '&pageSize=100',
    );
    const data = await response.json();
    const newsTitles = data?.articles?.map((item: Item, index: number) => ({
      read: false,
      title: item?.title,
      pinned: false,
      id: index,
    }));
    await AsyncStorage.setItem('news', JSON.stringify(newsTitles));
    setReloadNews?.(!reloadNews);
    setIsErrorOnFetching(false);
    return;
  } catch (e) {
    console.log('Error : ', e);
    setIsErrorOnFetching(true);
  }
};

export {fetchNewsFromServer};
