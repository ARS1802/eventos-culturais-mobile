import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uriToBlob } from "../../utils/converters.js";

function getImageExtension(mimeType) {
  const extension = mimeType.split("/")[1]?.split(";")[0];

  if (extension === "jpeg") {
    return "jpg";
  }

  return extension || "jpg";
}

export async function uploadPoster(asset, evento) {
  if (!asset) {
    throw new Error("Nenhuma imagem foi selecionada.");
  }

  const eventId = evento?.id?.trim?.();
  const organizerId = evento?.organizerId?.trim?.();

  if (!eventId) {
    throw new Error("ID do evento é obrigatório para enviar o cartaz.");
  }

  if (!organizerId) {
    throw new Error("ID do organizador é obrigatório para enviar o cartaz.");
  }

  const mimeType = asset.mimeType || "image/jpeg";
  const blob = await uriToBlob(asset.uri);
  const extension = getImageExtension(mimeType);
  const fileName = `poster.${extension}`;
  const imageRef = ref(
    storage,
    `event-posters/${organizerId}/${eventId}/${fileName}`,
  );

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
