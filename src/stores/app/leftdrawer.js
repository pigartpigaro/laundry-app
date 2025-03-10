import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useLeftDrawerStore = defineStore("left-drawer", {
  state: () => ({
    tabs: [],
    tab: "dashboard",
  }),
  actions: {
    async getMenu() {
      const { data } = await api.get("/xy/admin/menu/list");
      console.log("data menu", data);
      this.tabs = data;
    },
    setTab(route) {
      console.log("route", route);

      // if (route) {
      const ada = this.tabs?.find((x) => x.link === route)?.name ?? null;
      console.log("ketemu", ada);
      if (ada) {
        this.tab = ada;
      } else {
        console.log("gak ketemu", route);
        const caridikedalaman =
          this?.tabs?.find((x) => x?.subs?.find((y) => y?.link === route)) ??
          null;
        console.log("caridikedalaman", caridikedalaman);
        this.tab = caridikedalaman ? caridikedalaman?.name : "dashboard";
      }
      // }
    },
  },
});
