import * as ImagePicker from "expo-image-picker";

function criarReplacerCircular() {
  const objetosVisitados = new WeakSet();

  return (chave, valor) => {
    if (typeof valor === "function") {
      return "[Função]";
    }

    if (typeof valor === "object" && valor !== null) {
      if (objetosVisitados.has(valor)) {
        return "[Objeto circular]";
      }

      objetosVisitados.add(valor);
    }

    return valor;
  };
}

export function formatarValor(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não disponível";
  }

  if (valor instanceof Date) {
    return valor.toLocaleString("pt-BR");
  }

  if (typeof valor?.toDate === "function") {
    return valor.toDate().toLocaleString("pt-BR");
  }

  if (typeof valor === "object") {
    try {
      return JSON.stringify(valor, criarReplacerCircular(), 2);
    } catch {
      return String(valor);
    }
  }

  return String(valor);
}

export function converterParaObjeto(valor) {
  if (typeof valor === "object" && valor !== null) {
    return valor;
  }

  return { valor };
}

/**
 * Converte uma URI local ou remota em Blob no runtime do Expo/React Native.
 * Evita módulos `node:*`, que não existem no app Android/iOS.
 */
export async function uriToBlob(uri) {
  if (!uri) throw new Error("URI é obrigatório");

  const response = await fetch(uri);

  if (!response.ok && response.status >= 400) {
    throw new Error(`Não foi possível ler a imagem: ${response.status}`);
  }

  return await response.blob();
}

export async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Permissão para acessar a galeria foi negada.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  const mimeType = asset.mimeType || "image/jpeg";

  if (!mimeType.startsWith("image/")) {
    throw new Error("O arquivo selecionado não é uma imagem.");
  }

  return asset;
}
