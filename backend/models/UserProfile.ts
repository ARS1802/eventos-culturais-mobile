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

/*  ===================================
    Modelo de documento no firestore
        users/{uid} -> uid retornado por firebaseAuth()
    {
        id: "uid_do_auth",
        name: "Ana Silva",
        email: "ana@email.com",
        role: "visitor", // ou "organizer"
        createdAt: Timestamp,
        updatedAt: Timestamp
    }
    ====================================
*/

export type UserRole = "visitor" | "organizer";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore(user: UserProfile) {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions) {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    };
  },
};
