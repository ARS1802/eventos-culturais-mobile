import { deleteApp } from "firebase/app";

import { app } from "../firebase/firebaseConfig";
import { getEvento } from "../firebase/services/getEvent";
import { getUser } from "../firebase/services/getUser";
import { registerEvent } from "../firebase/services/registerEvent";
import { registerUser } from "../firebase/services/registerUser";

/**
 * Exemplos de uso dos serviços do backend em ambiente Node.js.
 * Substitua `exampleAsset` pelo `asset` retornado pelo Expo ImagePicker.
 */
async function main(): Promise<void> {
  try {
    console.log("--- Exemplo: registrar usuário ---");
    const usuarioTeste = {
      name: "TesteDois",
      email: "emailteste2@gmail.com",
      password: "Teste222",
      role: "organizer",
    } as const;

    const resultadoCadastro = await registerUser(usuarioTeste);
    let uid = resultadoCadastro;

    if (resultadoCadastro === "EMAIL_EXISTS") {
      const usuarioExistente = await getUser({ email: usuarioTeste.email });

      if (!usuarioExistente) {
        throw new Error(
          "O email já existe no Auth, mas o perfil não foi encontrado no Firestore.",
        );
      }

      uid = usuarioExistente.id;
    }

    const errosCadastro = [
      "INVALID_EMAIL",
      "WEAK_PASSWORD",
      "AUTH_CONFIG_ERROR",
      "FIRESTORE_ERROR",
      "AUTH_ERROR",
    ];

    if (errosCadastro.includes(uid)) {
      throw new Error(`Falha ao registrar usuário: ${uid}`);
    }

    console.log("UID do usuário:", uid);

    const usuario = await getUser({ id: uid });
    console.log("Usuário encontrado:", usuario);

    console.log("--- Exemplo: registrar evento (com poster) ---");

    const exampleAsset = {
      uri: "file:///home/arthur/Downloads/Imagens/EstatuaUm.png",
      mimeType: "image/png",
      width: 1200,
      height: 1800,
      fileSize: 900,
    };

    const eventId = await registerEvent(
      {
        organizerId: uid,
        title: "7 - ESTATUA",
        description: "cool estatua grega!",
        themes: ["exposicao", "cultura_local"],
        startAt: new Date("2026-08-01T19:00:00Z"),
        endAt: new Date("2026-08-01T22:00:00Z"),
        status: "ongoing",
      },
      exampleAsset,
    );

    console.log("Evento criado (ID):", eventId);

    console.log("--- Exemplo: buscar evento pelo ID ---");
    const eventoEncontrado = await getEvento({ eventoId: eventId });
    console.log("Evento encontrado:", eventoEncontrado);

    console.log("--- Exemplo: buscar eventos pelo organizador ---");
    const eventosDoOrganizador = await getEvento({ organizerId: uid });
    console.log("Eventos do organizador:", eventosDoOrganizador);
  } catch (e) {
    console.error("Erro nos exemplos:", e);
  }
}

main();
