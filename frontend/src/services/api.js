// En producción se define VITE_API_URL (ver .env.example); en desarrollo se
// usa el backend local.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("golazo_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    // fetch solo falla así cuando no hay respuesta del servidor
    // (antes llegaba al usuario como "Failed to fetch").
    const sinConexion = new Error(
      "No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo de nuevo.",
    );
    sinConexion.status = 0;
    throw sinConexion;
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    // Los errores de validación (422) traen una lista, no un texto.
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
          ? "Revisa los datos ingresados e inténtalo de nuevo."
          : "Ocurrió un error al comunicarse con el servidor.";

    // El código permite distinguir una sesión inválida (401) de un fallo
    // temporal del servidor.
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, {
      method: "GET",
      ...options,
    }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: (endpoint, body = null, options = {}) =>
    request(endpoint, {
      method: "PATCH",
      ...(body !== null && {
        body: JSON.stringify(body),
      }),
      ...options,
    }),
};