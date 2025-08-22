import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

// Screens & Context
import LoadingScreen from "./components/LoadingScreen";
import { PostsProvider } from "./context/PostsContext";
import { ThemeProvider } from "./context/ThemeContext";
import FeedScreen from "./screens/FeedScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UploadScreen from "./screens/UploadScreen";

export type RootStackParamList = {
  Feed: undefined;
  Profile: undefined;
  Upload: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  const [loadingFinished, setLoadingFinished] = useState(false);

  if (!loadingFinished) {
    return <LoadingScreen onFinish={() => setLoadingFinished(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PostsProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Feed"
                component={FeedScreen}
                options={({ navigation }) => ({
                  title: "Instagram Clone",
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Profile")}
                      style={{ marginRight: 10 }}
                    >
                      <Image
                        source={{ uri: "https://i.pravatar.cc/150" }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                      />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen name="Upload" component={UploadScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </PostsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
