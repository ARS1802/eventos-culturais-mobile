function isTestMode() {
  const testMode = process.env.TEST_MODE?.toLowerCase();

  return testMode === "true" || testMode === "1";
}

async function localFileToBlob(uri) {
  const [{ readFile }, { fileURLToPath }] = await Promise.all([
    import("node:fs/promises"),
    import("node:url"),
  ]);
  const filePath = uri.startsWith("file://") ? fileURLToPath(uri) : uri;
  const fileBuffer = await readFile(filePath);

  return new Blob([fileBuffer]);
}

export async function uriToBlob(uri) {
  if (!uri) throw new Error("URI é obrigatório");

  if (isTestMode() && (uri.startsWith("file://") || uri.startsWith("/"))) {
    return await localFileToBlob(uri);
  }

  const response = await fetch(uri);

  if (!response.ok && response.status >= 400) {
    throw new Error(`Não foi possível ler a imagem: ${response.status}`);
  }

  return await response.blob();
}
