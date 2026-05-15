const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.com$/;

/*
  REGEX_SENHA_FORTE

  Regras:
  - mínimo 8 caracteres
  - pelo menos 1 letra maiúscula
  - pelo menos 1 número
*/

const REGEX_SENHA_FORTE = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export function validarEmail(email) {
  if (!email?.trim()) {
    return "Email é obrigatório";
  }

  if (email.includes(" ")) {
    return "Email não pode conter espaços";
  }

  if (!email.includes("@")) {
    return "Email deve conter @";
  }

  if ((email.match(/@/g) || []).length !== 1) {
    return "Email deve conter apenas 1 @";
  }

  if (!REGEX_EMAIL.test(email)) {
    return "Formato de email inválido";
  }

  return "";
}

export function validarSenha(senha) {
  if (!senha) {
    return "Senha é obrigatória";
  }

  // if (!REGEX_SENHA_FORTE.test(senha)) {

  //   if (senha.length < 8) {
  //     return "Senha deve ter no mínimo 8 caracteres";
  //   }

  //   if (!/[A-Z]/.test(senha)) {
  //     return "Senha deve ter pelo menos 1 letra maiúscula";
  //   }

  //   if (!/\d/.test(senha)) {
  //     return "Senha deve ter pelo menos 1 número";
  //   }

  //   return "Senha inválida";
  // }

  return "";
}

export function validarConfirmacaoSenha(senha, confirmarSenha) {
  if (!confirmarSenha) {
    return "Confirme sua senha";
  }

  if (senha !== confirmarSenha) {
    return "As senhas não coincidem";
  }

  return "";
}

export function validarNome(nome) {
  if (!nome?.trim()) {
    return "Nome é obrigatório";
  }

  if (nome.trim().length < 3) {
    return "Nome deve ter pelo menos 3 caracteres";
  }

  return "";
}
