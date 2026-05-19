export async function uriToBlob(uri) {
  if (!uri) throw new Error("URI é obrigatório");

  const response = await fetch(uri);

  if (!response.ok && response.status >= 400) {
    throw new Error(`Não foi possível ler a imagem: ${response.status}`);
  }

  return await response.blob();
}
