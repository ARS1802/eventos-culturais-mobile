import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
/* 
    ==================================

    FirestoreDataConverter -> converte objetos js em um documento do fs
    QueryDocumentSnapshot & SnapshotOptions -> receber snapshots do documento no fs
        snapshots garantem consistencia.
    
    =================================
 */

export type EventTheme =
  | "musica"
  | "teatro"
  | "cinema"
  | "danca"
  | "literatura"
  | "cultura_local"
  | "exposicao"
  | "outros";

export type EventStatus = "ongoing" | "ended";

//EventPoster se encarrega da imagem do cartaz no firebase Storage.
export interface EventPoster {
  url: string;
  path: string;
  width: number;
  height: number;
  contentType: string;
  updatedAt: Date;
}

export interface ReviewStats {
  count: number;
  ratingSum: number;
  ratingAverage: number;
}
/* ===========================================================
    Modelo de documento no firestore
        events/{eventId}

        {
        id: "eventId",
        organizerId: "uid_do_organizador",

        title: "Mostra de Cinema Cearense",
        description: "Evento cultural com exibição de filmes locais.",
        themes: ["cinema", "cultura_local"],

        startAt: Timestamp,
        endAt: Timestamp | null,

        poster: {
            url: "https://...",
            path: "event-posters/uid/eventId.png"
        },

        status: "published",

        reviewStats: {
            count: 0,
            ratingSum: 0,
            ratingAverage: 0
        },

        createdAt: Timestamp,
        updatedAt: Timestamp
        }
    ===========================================================
 */
export interface CulturalEvent {
  id: string;
  organizerId: string;

  title: string;
  description: string;
  themes: EventTheme[];

  startAt: Date;
  endAt?: Date | null;

  poster?: EventPoster | null;

  status: EventStatus;

  reviewStats: ReviewStats;

  createdAt: Date;
  updatedAt: Date;
}

export const culturalEventConverter: FirestoreDataConverter<CulturalEvent> = {
  toFirestore(event: CulturalEvent) {
    return {
      organizerId: event.organizerId,
      title: event.title,
      description: event.description,
      themes: event.themes,
      startAt: event.startAt,
      endAt: event.endAt ?? null,
      poster: event.poster ?? null,
      status: event.status,
      reviewStats: event.reviewStats,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions) {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      organizerId: data.organizerId,
      title: data.title,
      description: data.description,
      themes: data.themes ?? [],
      startAt: data.startAt?.toDate?.() ?? new Date(),
      endAt: data.endAt?.toDate?.() ?? null,
      poster: data.poster ?? null,
      status: data.status,
      reviewStats: data.reviewStats ?? {
        count: 0,
        ratingSum: 0,
        ratingAverage: 0,
      },
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    };
  },
};
