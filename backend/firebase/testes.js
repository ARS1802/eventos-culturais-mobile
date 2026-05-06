import { adminDb } from "./adminConfig.js";
const postarRapido = (d) => adminDb.collection("testes").add(d);
const ref = await postarRapido({
  descricao: "HELLO WORLD ADMIN!",
  criadoEm: new Date(),
});

console.log("Documento criado com ID:", ref.id);
