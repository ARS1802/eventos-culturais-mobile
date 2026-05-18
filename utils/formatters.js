export function getLoginErrorMessage(error) {
  if (error?.code === "auth/invalid-email") {
    return "Email inválido.";
  }

  if (error?.code === "auth/invalid-credential") {
    return "Email ou senha incorretos.";
  }

  if (
    error?.code === "auth/user-not-found" ||
    error?.code === "auth/wrong-password"
  ) {
    return "Email ou senha incorretos.";
  }

  if (error?.code === "auth/user-disabled") {
    return "Esta conta foi desativada.";
  }

  if (error?.code === "auth/network-request-failed") {
    return "Não foi possível conectar ao Firebase. Verifique sua internet.";
  }

  if (error?.code === "auth/configuration-not-found") {
    return "A autenticação ainda não foi configurada no Firebase.";
  }

  return "Não foi possível entrar. Tente novamente.";
}
