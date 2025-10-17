import axios from "axios";

const prefix = "http://localhost:9193/payments";

export const api = axios.create({
  baseURL: prefix,
  withCredentials: true,
});