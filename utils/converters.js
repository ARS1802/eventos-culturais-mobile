function criarReplacerCircular() {
  const objetosVisitados = new WeakSet();

  return (chave, valor) => {
    if (typeof valor === "function") {
      return "[Função]";
    }

    if (typeof valor === "object" && valor !== null) {
      if (objetosVisitados.has(valor)) {
        return "[Objeto circular]";
      }

      objetosVisitados.add(valor);
    }

    return valor;
  };
}

export function formatarValor(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não disponível";
  }

  if (valor instanceof Date) {
    return valor.toLocaleString("pt-BR");
  }

  if (typeof valor?.toDate === "function") {
    return valor.toDate().toLocaleString("pt-BR");
  }

  if (typeof valor === "object") {
    try {
      return JSON.stringify(valor, criarReplacerCircular(), 2);
    } catch {
      return String(valor);
    }
  }

  return String(valor);
}

export function converterParaObjeto(valor) {
  if (typeof valor === "object" && valor !== null) {
    return valor;
  }

  return { valor };
}
