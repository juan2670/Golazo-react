const API_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("golazo_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      "Ocurrió un error al comunicarse con el servidor.";

    throw new Error(message);
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