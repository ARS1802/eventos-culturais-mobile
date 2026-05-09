import type { CulturalEvent } from "../models/CulturalEvent.js";
import type { Review } from "../models/Review.js";
import type { UserProfile } from "../models/UserProfile.js";
import { setDoc } from "firebase/firestore";
import {
  adimin_eventDoc,
  adimin_reviewDoc,
  adimin_userDoc,
  eventDoc,
  reviewDoc,
  userDoc,
} from "../models/firestoreReferences.js";

const agora = new Date();

const visitanteId = "visitanteId-especifico";
const organizadorId = "usuario-organizador-teste";
const eventoId = "eventoId-especifico";
const reviewId = `${eventoId}_${visitanteId}`;

const visitante: UserProfile = {
  id: visitanteId,
  name: "Joãozin Mulatin normal",
  email: "joaozinMulatao@email.com",
  role: "visitor",
  createdAt: agora,
  updatedAt: agora,
};

const organizador: UserProfile = {
  id: organizadorId,
  name: "Coletivo Sacada Cultural normal",
  email: "contato@sacadacultural.com",
  role: "organizer",
  createdAt: agora,
  updatedAt: agora,
};

const evento: CulturalEvent = {
  id: eventoId,
  organizerId: organizador.id,
  title: "ESPECIFICO",
  description: "mexendo nas regras do firestore",
  themes: ["cinema", "cultura_local"],
  startAt: new Date("2026-06-15T19:00:00-03:00"),
  endAt: new Date("2026-06-15T22:00:00-03:00"),
  poster: {
    url: "https://example.com/eventos/mostra-cinema-cearense.png",
    path: `event-posters/${organizador.id}/${eventoId}.png`,
  },
  status: "ended",
  reviewStats: {
    count: 99,
    ratingSum: 5,
    ratingAverage: 5,
  },
  createdAt: agora,
  updatedAt: agora,
};

const review: Review = {
  id: reviewId,
  eventId: evento.id,
  visitorId: visitante.id,
  organizerId: organizador.id,
  rating: 5,
  comment: "Evento muito bem organizado e com otima curadoria normal",
  visitorName: visitante.name,
  createdAt: agora,
  updatedAt: agora,
};

try {
  const visitanteRef = await userDoc(visitante.id);
  const eventsRef = await eventDoc(evento.id);
  //console.log(visitanteRef);
  await setDoc(visitanteRef, visitante);
  await setDoc(eventsRef, evento);
  console.log("Documento criado com sucesso com o ID: " + visitante.id);
  console.log("Documento criado com sucesso com o ID: " + evento.id);
} catch (e) {
  console.error("Erro ao salvar: ", e);
}

async function adimin_criarDadosDeTeste() {
  if (review.rating < 1 || review.rating > 5) {
    throw new Error("A avaliacao precisa estar entre 1 e 5.");
  }

  await Promise.all([
    userDoc(visitante.id),
    userDoc(organizador.id),
    eventDoc(evento.id),
    reviewDoc(review.id),
  ]);

  console.log("Dados de teste enviados para o Firestore.(non-adimin)");
}

adimin_criarDadosDeTeste().catch((error) => {
  console.error("Erro ao enviar dados de teste:", error);
  process.exitCode = 1;
});
