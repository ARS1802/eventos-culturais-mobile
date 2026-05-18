import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebaseConfig.js";
import { collection, doc } from "firebase/firestore";

async function fileUriToBlobNode(uri, mimeType) {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { Blob: NodeBlob } = await import("buffer");

  const filePath = fileURLToPath(uri);
  const buffer = await readFile(filePath);
  const BlobConstructor = typeof Blob === "function" ? Blob : NodeBlob;

  return new BlobConstructor([buffer], { type: mimeType });
}

export async function uploadPoster(asset, evento) {
  if (!asset) {
    throw new Error("Nenhuma imagem foi selecionada.");
  }

  const mimeType = asset.mimeType || "image/jpeg";
  const isFileUri = asset.uri && String(asset.uri).startsWith("file://");
  const isNodeRuntime =
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node;
  let blob;

  if (isNodeRuntime) {
    if (isFileUri) {
      blob = await fileUriToBlobNode(asset.uri, mimeType);
    } else {
      const response = await fetch(asset.uri);
      blob = await response.blob();
    }
  } else {
    const relPath = "../../../" + "utils/converters.js";
    const mod = await import(relPath);
    const uriToBlob = mod.uriToBlob;
    blob = await uriToBlob(asset.uri);
  }

  const extension = mimeType.split("/")[1] || "jpg";

  const novaImagemRef = doc(collection(db, "posters"));

  const fileName = `${evento.id}_${novaImagemRef.id}.${extension}`;

  const imageRef = ref(storage, `/${fileName}`);

  await uploadBytes(imageRef, blob, {
    contentType: mimeType,
  });

  const downloadURL = await getDownloadURL(imageRef);

  return {
    url: downloadURL,
    path: imageRef.fullPath,
    fileName,
    mimeType,
    width: asset.width,
    height: asset.height,
  };
}
