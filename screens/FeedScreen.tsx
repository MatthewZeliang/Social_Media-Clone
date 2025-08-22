import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { PostsContext } from "../context/PostsContext";

export default function FeedScreen() {
  const { posts } = useContext(PostsContext);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: "#fff" }}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.postContainer}>
          <View style={styles.userRow}>
            <Image source={{ uri: "https://i.pravatar.cc/150" }} style={styles.userImage} />
            <Text style={styles.username}>{item.username}</Text>
          </View>
          <Image source={{ uri: item.imageUri }} style={styles.postImage} />
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  userRow: { flexDirection: "row", alignItems: "center", padding: 10 },
  userImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: "bold", fontSize: 16 },
  postImage: { width: "100%", height: 300, resizeMode: "cover" },
  caption: { paddingHorizontal: 10, paddingTop: 5 },
});
