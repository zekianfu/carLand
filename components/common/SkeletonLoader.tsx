import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface SkeletonElementProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: object;
}

const SkeletonElement: React.FC<SkeletonElementProps> = ({ width, height, borderRadius = 4, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // Adjust based on typical widths
  });

  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <View style={styles.shimmerEffect} />
      </Animated.View>
    </View>
  );
};

const MemoizedSkeletonElement = React.memo(SkeletonElement);

interface CarCardSkeletonProps {
    cardWidth?: number | string;
}

export const CarCardSkeleton: React.FC<CarCardSkeletonProps> = React.memo(({ cardWidth = '47%' }) => {
  // Approximate dimensions from CarCard
  const imageH = 110;
  const textLineH = 14;
  const textGap = 6;

  return (
    <View style={[styles.skeletonCardContainer, { width: cardWidth }]}>
      <SkeletonElement width="100%" height={imageH} borderRadius={0} />
      <View style={styles.skeletonTextContainer}>
        <SkeletonElement width="80%" height={textLineH} style={{ marginBottom: textGap }} />
        <SkeletonElement width="60%" height={textLineH} style={{ marginBottom: textGap }} />
        <SkeletonElement width="40%" height={textLineH} />
      </View>
    </View>
  );
});

const SkeletonLoader: React.FC = () => {
  return (
    <View>
      {/* ...skeleton UI... */}
    </View>
  );
}; // <--- Make sure this closing brace and semicolon are present

// Example for a list of car card skeletons
export const CarListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <View>
    {/* ... */}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0', // A bit darker base for shimmer
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '200%', // Make it wider to slide across
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Lighter shimmer color
    // For a gradient shimmer:
    // background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
  },
  // Styles for CarCardSkeleton to mimic CarCard structure
  skeletonCardContainer: {
    backgroundColor: '#f0f0f0', // Lighter background for the card itself
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    minHeight: 200,
    overflow: 'hidden',
  },
  skeletonTextContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Or 'flex-start' if mx is handled by card
    paddingHorizontal: 5, // Adjust if cards have their own horizontal margin
  }
});

export default MemoizedSkeletonElement; // Export the memoized version
