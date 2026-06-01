import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../backend/firebase/firebaseConfig";
import { getUser } from "../../backend/firebase/services/getUser";

export const AuthContext = createContext(null);

function normalizarEmail(email) {
  return email?.trim().toLowerCase();
}

function perfilPertenceAoUsuario(perfil, user) {
  if (!perfil || !user) {
    return false;
  }

  return (
    perfil.id === user.uid ||
    normalizarEmail(perfil.email) === normalizarEmail(user.email)
  );
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const carregarPerfil = useCallback(async (user, perfilConhecido = null) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!user) {
      setUsuario(null);
      return null;
    }

    let perfil = perfilPertenceAoUsuario(perfilConhecido, user)
      ? perfilConhecido
      : null;

    if (!perfil) {
      perfil = await getUser({ id: user.uid });
    }

    if (!perfil && user.email) {
      perfil = await getUser({ email: normalizarEmail(user.email) });
    }

    if (requestIdRef.current === requestId) {
      setUsuario(perfil);
    }

    return perfil;
  }, []);

  const login = useCallback(
    async (email, senha, perfilConhecido = null) => {
      setLoading(true);
      setError(null);

      try {
        const credentials = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          senha,
        );
        setFirebaseUser(credentials.user);

        return await carregarPerfil(credentials.user, perfilConhecido);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [carregarPerfil],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUsuario(null);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsuario = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      return await carregarPerfil(auth.currentUser);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [carregarPerfil]);

  const definirUsuarioAtual = useCallback(
    async (perfilConhecido = null) => {
      setLoading(true);
      setError(null);

      try {
        setFirebaseUser(auth.currentUser);
        return await carregarPerfil(auth.currentUser, perfilConhecido);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [carregarPerfil],
  );

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) {
        return;
      }

      setLoading(true);
      setError(null);
      setFirebaseUser(user);

      try {
        await carregarPerfil(user);
      } catch (e) {
        if (isMounted) {
          setUsuario(null);
          setError(e);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [carregarPerfil]);

  const value = useMemo(
    () => ({
      firebaseUser,
      usuario,
      loading,
      error,
      login,
      logout,
      refreshUsuario,
      definirUsuarioAtual,
    }),
    [
      firebaseUser,
      usuario,
      loading,
      error,
      login,
      logout,
      refreshUsuario,
      definirUsuarioAtual,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
