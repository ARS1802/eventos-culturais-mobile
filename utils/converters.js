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

//===imports para ler arquivo local===
// import { readFile } from "node:fs/promises";
// import { fileURLToPath } from "node:url";
//===================================

//Usada para upload de imagens ao Storage!
export async function uriToBlob(uri) {
  // uso em ambiente web/HTTP
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
}

/**
 * Suporta `file://` em Node.js. Faz import dinâmico dos módulos Node
 * para não quebrar o bundle do Expo/Web.
 * Uso: em ambientes Node onde `fetch` não entende `file://`.
 */
export async function uriToBlobNode(uri) {
  if (!uri) throw new Error("URI é obrigatório");

  if (uri.startsWith("file://")) {
    const { readFile } = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    const path = fileURLToPath(uri);
    const buffer = await readFile(path);

    try {
      return new Blob([buffer]);
    } catch (err) {
      const { Blob: NodeBlob } = await import("buffer");
      return new NodeBlob([buffer]);
    }
  }

  // fallback para HTTP/HTTPS
  const response = await fetch(uri);
  return await response.blob();
}

// import * as ImagePicker from "expo-image-picker";
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
