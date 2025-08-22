import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Post, PostsContext } from "../context/PostsContext";
import { ThemeContext } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const imageSize = screenWidth / numColumns;

export default function ProfileScreen() {
  const { posts } = useContext(PostsContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [bio, setBio] = useState("Life is better with photos ✨📸");
  const [songUri, setSongUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync().catch(() => {});
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  // Play selected song
  const playSong = async () => {
    if (!songUri) return;
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: songUri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  // Pick audio file
  const pickSong = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
      if ("uri" in result && typeof result.uri === "string") {
        setSongUri(result.uri);
      }
    } catch (error) {
      console.error("Error picking song:", error);
    }
  };

  const userPosts: Post[] = posts.filter((p) => !p.isVideo);
  const userReels: Post[] = posts.filter((p) => p.isVideo);
  const currentPosts = activeTab === "posts" ? userPosts : userReels;

  const backgroundColor = theme === "dark" ? "#121212" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#000";

  return (
    <FlatList
      data={currentPosts}
      keyExtractor={(item) => item.id + (item.isVideo ? "-video" : "-img")}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <Image source={{ uri: item.imageUri }} style={{ width: imageSize, height: imageSize }} />
      )}
      ListHeaderComponent={
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Image source={{ uri: "https://i.pravatar.cc/150" }} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={[styles.username, { color: textColor }]}>johndoe</Text>
              <TextInput
                style={[styles.bioInput, { color: textColor, borderColor: textColor }]}
                value={bio}
                onChangeText={setBio}
                multiline
              />

              {/* Song */}
              <View style={{ flexDirection: "row", marginTop: 4, alignItems: "center" }}>
                <TouchableOpacity onPress={playSong}>
                  <Text style={{ color: "#1DB954" }}>
                    {songUri ? "▶ Play Song" : "Add a song"}
                  </Text>
                </TouchableOpacity>
                {!songUri && (
                  <TouchableOpacity onPress={pickSong} style={{ marginLeft: 10 }}>
                    <Text style={{ color: "#ff6ec7" }}>+ Select Song</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={[styles.statNumber, { color: textColor }]}>{posts.length}</Text>
                  <Text style={{ color: textColor }}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statNumber, { color: textColor }]}>123</Text>
                  <Text style={{ color: textColor }}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statNumber, { color: textColor }]}>456</Text>
                  <Text style={{ color: textColor }}>Following</Text>
                </View>
              </View>
            </View>

            {/* Settings Button */}
            <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: 10 }}>
              <Text style={{ color: "#ff6ec7" }}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => setActiveTab("posts")} style={styles.tab}>
              <Text style={{ color: activeTab === "posts" ? "#ff6ec7" : textColor }}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("reels")} style={styles.tab}>
              <Text style={{ color: activeTab === "reels" ? "#ff6ec7" : textColor }}>Reels</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      style={{ backgroundColor }}
    />
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", padding: 16, alignItems: "center" },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  userInfo: { flex: 1, marginLeft: 16 },
  username: { fontSize: 18, fontWeight: "bold" },
  bioInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    marginVertical: 4,
    minHeight: 40,
  },
  statsRow: { flexDirection: "row", marginTop: 8 },
  stat: { alignItems: "center", marginRight: 16 },
  statNumber: { fontWeight: "bold", fontSize: 16 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  tab: { paddingVertical: 6 },
});
