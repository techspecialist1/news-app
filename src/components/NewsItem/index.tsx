import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_CREAM,
  COLOR_RED,
  COLOR_WHITE,
} from '../../utils/colors';
import {moderateScale, width} from '../../utils/helper';
import {deleteIcon, pinIcon, unpinIcon} from '../../assets';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  title: string;
  pinned?: boolean;
  onPressDelete?: () => void;
  onPressPin: () => void;
};

const threshold = width * 0.45;

const NewsItemComponent = ({
  title,
  pinned,
  onPressDelete,
  onPressPin,
}: Props): JSX.Element => {
  const dragX = useSharedValue(0);

  const pinOpacity = useSharedValue(0);
  const deleteOpacity = useSharedValue(0);

  const gestureEvent = useAnimatedGestureHandler({
    onActive: e => {
      dragX.value = e.translationX;
      if (e.translationX < 0) {
        deleteOpacity.value = withTiming(1);
        pinOpacity.value = 0;
      } else {
        pinOpacity.value = withTiming(1);
        deleteOpacity.value = 0;
      }
    },
    onEnd: e => {
      if (threshold >= Math.abs(e.translationX)) {
        dragX.value = withTiming(0);
      } else {
        if (e.translationX < 0) {
          dragX.value = withTiming(-width);
          if (onPressDelete) {
            runOnJS(onPressDelete)();
          }
        } else {
          dragX.value = withTiming(0);
          if (onPressPin) {
            runOnJS(onPressPin)();
          }
        }
      }
    },
  });

  const itemContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragX.value,
        },
      ],
    };
  });

  const pinSwiperStyle = useAnimatedStyle(() => {
    return {
      opacity: pinOpacity.value,
    };
  });

  const deleteSwiperStyle = useAnimatedStyle(() => {
    return {
      opacity: deleteOpacity.value,
    };
  });

  return (
    <>
      {pinned ? null : (
        <View style={styles.deleteSwiper}>
          <Animated.View style={[styles.pinSwipeView, pinSwiperStyle]}>
            <Text style={styles.pinSwiperText}>Pin</Text>
          </Animated.View>
          <Animated.View style={[styles.deleteSwipeView, deleteSwiperStyle]}>
            <Text style={styles.pinSwiperText}>Delete</Text>
          </Animated.View>
        </View>
      )}
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={!pinned ? gestureEvent : () => null}>
          <Animated.View
            style={[
              styles.container,
              pinned ? styles.containerPinned : {},
              !pinned ? itemContainerStyle : {},
            ]}>
            <Text
              style={[styles.titleText, pinned ? styles.titleTextPinned : {}]}>
              {title}
            </Text>
            {!pinned ? (
              <>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={onPressDelete}>
                  <Image
                    source={deleteIcon}
                    style={[
                      styles.imageStyle,
                      pinned ? styles.pinnedImage : {},
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imageButton, styles.imageButton2]}
                  onPress={onPressPin}>
                  <Image
                    source={pinIcon}
                    style={[
                      styles.imageStyle,
                      pinned ? styles.pinnedImage : {},
                    ]}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.imageButton, styles.imageButtonPinned]}
                onPress={onPressPin}>
                <Image
                  source={unpinIcon}
                  style={[styles.imageStyle, pinned ? styles.pinnedImage : {}]}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </>
  );
};

export const NewsItem = React.memo(NewsItemComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_CREAM,
    width: width * 0.9,
    height: moderateScale(60),
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
    zIndex: 1,
  },
  containerPinned: {
    backgroundColor: COLOR_RED,
  },
  titleText: {
    color: COLOR_BLACK,
    flex: 0.8,
  },
  titleTextPinned: {
    color: COLOR_WHITE,
    flex: 0.8,
  },
  imageStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
  imageButton: {
    flex: 0.1,
  },
  imageButton2: {
    marginLeft: moderateScale(10),
  },
  pinnedImage: {
    tintColor: COLOR_WHITE,
  },
  imageButtonPinned: {
    flex: 0.2,
    alignItems: 'center',
  },
  deleteSwiper: {
    position: 'absolute',
    right: 0,
    zIndex: 0,
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pinSwiperText: {
    color: COLOR_WHITE,
  },
  pinSwipeView: {
    backgroundColor: COLOR_BLUE,
    width: width * 0.45,
    height: moderateScale(60),
    justifyContent: 'center',
    paddingLeft: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  deleteSwipeView: {
    backgroundColor: COLOR_RED,
    width: width * 0.45,
    height: moderateScale(60),
    justifyContent: 'center',
    paddingRight: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'flex-end',
  },
});
