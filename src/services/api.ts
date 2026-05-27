import axios from "axios";

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: "https://sereni.onrender.com",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("Erro Servidor:", error.response.status, error.response.data);
    } else if (error.request) {
      console.log("Erro de Rede (Sem resposta):", error.message);
    } else {
      console.log("Erro Config:", error.message);
    }
    return Promise.reject(error);
  },
);
