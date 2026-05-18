import { getUser } from "./services/getUser.js";
import { registerEvent } from "./services/registerEvent.js";
import { registerUser } from "./services/registerUser.js";
/**
 * Exemplos de uso dos serviços do backend
 * - Substitua `exampleAsset` pelo `asset` retornado pelo Expo ImagePicker
 */

async function main() {
  // useAuth is a React hook and can't be called in this Node script.
  // Remove its usage when running outside React.
  try {
    console.log("--- Exemplo: registrar usuário ---");
    const uid = await registerUser({
      name: "Teste",
      email: "emailteste3@gmail.com",
      password: "Teste333",
      role: "organizer",
    });

    console.log("UID do usuário:", uid);

    console.log("--- Exemplo: registrar evento (com poster) ---");

    // Exemplo de `asset` com URI local (file://) — ajuste conforme seu arquivo local
    // Este é o asset que o ImagePickerButton normalmente passa: { uri, mimeType, width, height, fileSize }
    const exampleAsset = {
      uri: "file:///home/arthur/Downloads/Imagens/CinemaBrasileiro.png",
      mimeType: "image/png",
      width: 1200,
      height: 1800,
      fileSize: 123456,
    };

    // Registrar evento SEM enviar asset (opção segura para execução em Node)
    const eventId = await registerEvent(
      {
        organizerId: typeof uid === "string" ? uid : "",
        title: "CINEMA BRASILEIRO!",
        description: "Deus e o diabo na terra do sol",
        themes: ["cinema", "cultura_local"],
        startAt: new Date("2026-08-01T19:00:00Z"),
        endAt: new Date("2026-08-01T22:00:00Z"),
        status: "ongoing",
      },
      exampleAsset,
    );

    console.log("Evento criado (ID):", eventId);
  } catch (e) {
    console.error("Erro nos exemplos:", e);
  }
}

main();
