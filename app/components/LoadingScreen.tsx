import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { Video, ResizeMode } from "expo-av";

type LoadingScreenProps = {
  onFinish: () => void;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: -1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [wiggleAnim]);

  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/intro.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
      />
      <Animated.Text
        style={[styles.startText, { transform: [{ rotate }] }]}
        onPress={onFinish}
      >
        🎮 Start Adventure 🎮
      </Animated.Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80,
  },
  startText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffcc00",
    textShadowColor: "#ff6600",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});
