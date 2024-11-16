import {Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 850;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.25): number =>
  size + (scale(size) - size) * factor;
const isIOS = () => Platform.OS === 'ios';
const isAndroid = () => Platform.OS === 'android';

const isArrayEmpty = (array: Array<object>) => (array?.length ? true : false);

export {
  isArrayEmpty,
  isIOS,
  isAndroid,
  scale,
  verticalScale,
  moderateScale,
  width,
  height,
};
