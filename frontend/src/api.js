const API_BASE_URL = "http://localhost:3000/";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = { ...options, headers };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
      throw new Error("Sesión expirada");
    }
    if (response.status === 403) {
      throw new Error("No autorizado");
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: (endpoint, data) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE",
    }),
};
