import { registerUser } from "./registerUser.js";
import { resetPassword } from "./resetPassword.js";
import { userDoc } from "../models/firestoreReferences.js";
import { getUser } from "./getUser.js";

// const obj = await registerUser({
//   name: "UsuarioDeVerdade!",
//   email: "arthurramospvp@gmail.com",
//   password: "mulatinMeuAmor",
//   role: "visitor",
// });

// console.log(obj);
// //const usuarioCadastrado = userDoc(obj);

// Exemplo de uso da função resetPassword
const usuario = await resetPassword("arthurramospvp@gmail.com");
console.log(usuario);
