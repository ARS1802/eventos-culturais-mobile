import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { tamanhoArquivoValido } from "../utils/validation";
import colors from "../assets/colors";

export function ImagePickerButton({
  cor = colors.blueContrast,
  texto = "Upload cartaz 📷",
  onPick,
  style,
  allowsEditing = true,
  quality = 0.7,
}) {
  const [loading, setLoading] = useState(false);

  async function handlePick() {
    try {
      setLoading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Permissão negada" +
            "Permita acesso às fotos nas configurações do dispositivo.",
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        quality,
        selectionLimit: 1,
      });

      if (result.cancelled === true) {
        setLoading(false);
        return;
      }

      // Handle both legacy and new result shapes
      let asset = null;
      if (result.assets && result.assets.length) asset = result.assets[0];
      else if (result.uri) asset = { uri: result.uri };

      if (asset?.fileSize != null) {
        if (!tamanhoArquivoValido(asset.fileSize, 150)) {
          alert("A imagem não pode ser maior que 150MB.");
          setLoading(false);
          return;
        }
      }

      if (onPick && asset) onPick(asset);
    } catch (e) {
      console.error("ImagePicker error:", e);
      alert("Erro " + "Não foi possível selecionar a imagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: cor }, style]}
      onPress={handlePick}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.texto}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
