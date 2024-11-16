import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {COLOR_RED} from '../../utils/colors';
import {refreshIcon} from '../../assets';
import {moderateScale} from '../../utils/helper';

type Props = {
  onPressRefresh: () => void;
};

export const RefreshButton = forwardRef(({onPressRefresh}: Props, ref) => {
  const animatedRef = useRef<AnimatedCircularProgress>(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        startAnimation() {
          animatedRef?.current?.reAnimate(10, 100, 10000);
        },
      };
    },
    [],
  );
  return (
    <View>
      <AnimatedCircularProgress
        ref={animatedRef}
        size={moderateScale(50)}
        width={moderateScale(5)}
        duration={10000}
        fill={100}
        tintColor={COLOR_RED}>
        {() => (
          <TouchableOpacity onPress={onPressRefresh}>
            <Image source={refreshIcon} style={styles.imageStyle} />
          </TouchableOpacity>
        )}
      </AnimatedCircularProgress>
    </View>
  );
});

const styles = StyleSheet.create({
  imageStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
});
