import { boot } from "quasar/wrappers";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// const SERV = "http://localhost:8185";
const SERV = "http://laundry-backend.test";
// const SERV = "http://127.0.0.1:8000";
// const SERV = process.env.API_URL || "http://laundry-backend.test";
const base = SERV;
const api = axios.create({ baseURL: base + "/api" });
api.defaults.headers.get.Accepts = "application/json";
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$SERV = SERV;
  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, axios, SERV };
