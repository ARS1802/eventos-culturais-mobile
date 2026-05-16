import * as fs from "fs/promises";
import { Blob } from "buffer"; // No Node.js moderno (v18+), o Blob é global, mas pode ser importado se necessário.
import { adminStorage } from "./adminConfig.js";
import { ref, uploadBytes } from "firebase/storage";
/**
 * Converte um caminho de arquivo local do Node.js em um Blob.
 * * @param path - O caminho do arquivo no sistema (ex: '/user/documents/image.png').
 * @param mimeType - O tipo do arquivo (ex: 'image/png'). Opcional, mas recomendado.
 * @returns Uma Promise que resolve em um Blob.
 */
const bucket = adminStorage.bucket(
  "gs://sacadacultural-1987b.firebasestorage.app",
);
const file = bucket.file("120x120-II.png");
async function pathToBlob(path: string, mimeType?: string): Promise<Blob> {
  try {
    // Lê o arquivo como um Buffer
    const buffer = await fs.readFile(path);
    await file.save(buffer, {
      metadata: { contentType: "image/png" },
    });
    // Converte o Buffer para Blob
    const blob = new Blob([buffer], { type: mimeType });
    return blob;
  } catch (error) {
    console.error("Erro ao ler o arquivo e converter para Blob:", error);
    throw error;
  }
}

// --- Exemplo de Uso ---
const blobA = await pathToBlob(
  "/media/arthur/Novo volume/ARTHUR/Unifor/2026/Dev Mobile/OcorrenciasEspacosCulturais/Issues/120x120-II.png",
  "image/png",
);
// const blobB = await pathToBlob(
//   "file:///home/arthur/Imagens/120x120-II.png",
//   "image/png",
// );
console.log(blobA);
