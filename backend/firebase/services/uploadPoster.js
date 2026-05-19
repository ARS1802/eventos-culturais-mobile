import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebaseConfig.js";
import { collection, doc } from "firebase/firestore";
import { safeTitle } from "../../utils/formatters.js";
import { uriToBlob } from "../../utils/converters.js";

export async function uploadPoster(asset, evento) {
  if (!asset) {
    throw new Error("Nenhuma imagem foi selecionada.");
  }

  const mimeType = asset.mimeType || "image/jpeg";
  const blob = await uriToBlob(asset.uri);

  const extension = mimeType.split("/")[1] || "jpg";

  const novaImagemRef = doc(collection(db, "posters"));
  const eventTitle = safeTitle(evento.title);
  const fileName = `title=${eventTitle}_eventId=${evento.id}_id=${novaImagemRef.id}.${extension}`;

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
