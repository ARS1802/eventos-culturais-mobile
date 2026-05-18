import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebaseConfig.js";
import { collection, doc } from "firebase/firestore";

export async function uploadPoster(asset, evento) {
  if (!asset) {
    throw new Error("Nenhuma imagem foi selecionada.");
  }

  const mimeType = asset.mimeType || "image/jpeg";
  // dynamic import of shared converters to avoid static compile-time dependency
  const isFileUri = asset.uri && String(asset.uri).startsWith("file://");
  let blob;

  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node &&
    isFileUri
  ) {
    // Node runtime + file:// -> use uriToBlobNode from project's utils
    const pathMod = await import("node:path");
    const { pathToFileURL } = await import("node:url");
    const convertersPath = pathMod.join(
      process.cwd(),
      "utils",
      "converters.js",
    );
    const mod = await import(pathToFileURL(convertersPath).href);
    const uriToBlobNode = mod.uriToBlobNode ?? mod.uriToBlob;
    blob = await uriToBlobNode(asset.uri);
  } else {
    // Fallback: try loading central utils via relative path (works in bundler/web)
    let mod;
    try {
      // Use a non-constant string to avoid static analysis including the utils file
      const relPath = "../../../" + "utils/converters.js";
      mod = await import(relPath);
    } catch (e) {
      // If relative import fails (e.g., running in Node), fallback to project utils path
      const pathMod = await import("node:path");
      const { pathToFileURL } = await import("node:url");
      const convertersPath = pathMod.join(
        process.cwd(),
        "utils",
        "converters.js",
      );
      mod = await import(pathToFileURL(convertersPath).href);
    }

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
