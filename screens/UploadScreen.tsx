import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PostsContext } from "../context/PostsContext";

export default function UploadScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");

  const { addPost } = useContext(PostsContext);

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to access your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to access your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Post image with caption
  const handlePost = () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please select or take an image to post.");
      return;
    }

    const newPost = {
      id: uuidv4(),
      imageUri,
      caption,
      username: "johndoe",
    };

    addPost(newPost);
    setImageUri(null);
    setCaption("");
    navigation.navigate("Feed");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>New Post</Text>

      {/* Image preview */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: "#888" }}>No image selected</Text>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Pick from Gallery" onPress={pickImage} />
        <Button title="Take Photo" onPress={takePhoto} />
      </View>

      {/* Caption input */}
      <TextInput
        placeholder="Write a caption... #hashtags"
        style={styles.captionInput}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <Button title="Post" onPress={handlePost} disabled={!imageUri} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#ff6ec7" },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    height: 300,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  captionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
});
