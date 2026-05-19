import readline from "node:readline";

import { deleteApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { terminate } from "firebase/firestore";

import { app, auth, db } from "../firebase/firebaseConfig";
import { deleteEvent } from "../firebase/services/deleteEvent";
import { deleteUser } from "../firebase/services/deleteUser";
import { getEvento } from "../firebase/services/getEvent";
import { getUser } from "../firebase/services/getUser";
import { registerEvent } from "../firebase/services/registerEvent";
import { registerUser } from "../firebase/services/registerUser";

process.env.TEST_MODE ??= "true";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const userCreationErrors = [
  "EMAIL_EXISTS",
  "INVALID_EMAIL",
  "WEAK_PASSWORD",
  "AUTH_CONFIG_ERROR",
  "FIRESTORE_ERROR",
  "AUTH_ERROR",
];

function pause(message = "Pressione Enter para continuar..."): Promise<void> {
  return new Promise((resolve) => {
    rl.question(`\n${message}`, () => resolve());
  });
}

async function runStep<T>(
  title: string,
  action: () => Promise<T>,
): Promise<T> {
  console.log(`\n=== ${title} ===`);

  try {
    return await action();
  } catch (error) {
    console.error(`Erro na etapa "${title}":`, error);
    throw error;
  }
}

function assertRegisterUserSuccess(result: string): string {
  if (userCreationErrors.includes(result)) {
    throw new Error(`Falha ao criar usuário: ${result}`);
  }

  return result;
}

function assertEventSuccess(result: string): string {
  if (result === "FIRESTORE_ERROR") {
    throw new Error("Falha ao criar evento: FIRESTORE_ERROR");
  }

  return result;
}

function assertResult(result: string, expected: string): void {
  if (result !== expected) {
    throw new Error(
      `Resultado inesperado. Esperado: ${expected}. Recebido: ${result}`,
    );
  }
}

async function closeResources(): Promise<void> {
  rl.close();

  try {
    await terminate(db);
  } catch (error) {
    console.warn("Não foi possível encerrar o Firestore:", error);
  }

  try {
    await deleteApp(app);
  } catch (error) {
    console.warn("Não foi possível encerrar o app Firebase:", error);
  }
}

async function main(): Promise<void> {
  const runId = Date.now();

  const visitorCredentials = {
    email: `visitante.teste.${runId}@sacada.test`,
    password: "Teste123!",
  };

  const organizerCredentials = {
    email: `organizador.teste.${runId}@sacada.test`,
    password: "Teste123!",
  };

  let visitorId = "";
  let organizerId = "";
  let eventId = "";

  try {
    visitorId = await runStep("1. Criar Usuário Visitante", async () => {
      const result = await registerUser({
        name: "Visitante Teste",
        email: visitorCredentials.email,
        password: visitorCredentials.password,
        role: "visitor",
      });

      const uid = assertRegisterUserSuccess(result);
      const visitor = await getUser({ id: uid });

      console.log("Usuário visitante criado:");
      console.log(visitor);

      return uid;
    });
    await pause();

    organizerId = await runStep("2. Criar Usuário Organizador", async () => {
      const result = await registerUser({
        name: "Curadoria Museu Brasileiro",
        email: organizerCredentials.email,
        password: organizerCredentials.password,
        role: "organizer",
      });

      const uid = assertRegisterUserSuccess(result);
      const organizer = await getUser({ id: uid });

      console.log("Usuário organizador criado:");
      console.log(organizer);

      return uid;
    });
    await pause();

    eventId = await runStep("3. Criar Evento", async () => {
      const asset = {
        uri: "file:///home/arthur/Downloads/Imagens/Museu.png",
        mimeType: "image/png",
        width: 1200,
        height: 1800,
      };

      const result = await registerEvent(
        {
          organizerId,
          title: "Museu Brasileiro",
          description:
            "Exposicao guiada sobre memoria, arte popular e patrimonio cultural brasileiro.",
          themes: ["cultura_local"],
          startAt: new Date("2026-08-15T18:00:00-03:00"),
          endAt: new Date("2026-08-15T21:00:00-03:00"),
          status: "ongoing",
        },
        asset,
      );

      const id = assertEventSuccess(result);
      const event = await getEvento({ eventoId: id });

      console.log("Evento criado com sucesso:");
      console.log(event);

      return id;
    });
    await pause();

    await runStep("4. Deletar Visitante", async () => {
      await signInWithEmailAndPassword(
        auth,
        visitorCredentials.email,
        visitorCredentials.password,
      );

      const result = await deleteUser(visitorId);
      assertResult(result, "USER_DELETED");

      console.log("Resultado da delecao do visitante:", result);
    });
    await pause();

    await runStep("5. Deletar Evento", async () => {
      await signInWithEmailAndPassword(
        auth,
        organizerCredentials.email,
        organizerCredentials.password,
      );

      const result = await deleteEvent(eventId);
      assertResult(result, "EVENT_DELETED");

      console.log("Resultado da delecao do evento:", result);
    });
    await pause();

    await runStep("6. Deletar Organizador", async () => {
      if (auth.currentUser?.uid !== organizerId) {
        await signInWithEmailAndPassword(
          auth,
          organizerCredentials.email,
          organizerCredentials.password,
        );
      }

      const result = await deleteUser(organizerId);
      assertResult(result, "USER_DELETED");

      console.log("Resultado da delecao do organizador:", result);
    });
  } finally {
    await closeResources();
  }
}

main().catch((error) => {
  console.error("Teste interativo encerrado com erro:", error);
  process.exitCode = 1;
});
