import { uriToBlob } from "../../../utils/converters.js";
import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
console.log(uriToBlob);
let path = "file:///home/arthur/Imagens/120x120-II.png";
const blob = await uriToBlob(path);
console.log(blob);

export async function uploadImage(asset) {
  if (!asset) {
    throw new Error("Nenhuma imagem foi selecionada.");
  }

  const mimeType = asset.mimeType || "image/jpeg";

  const blob = await uriToBlob(asset.uri);

  const extension = mimeType.split("/")[1] || "jpg";
  const fileName = `${Date.now()}.${extension}`;

  const imageRef = ref(storage, `/teste.png`);

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
const asset = { uri: path, mimeType: "image/png" };
const img = await uploadImage(asset);
console.log(img);
