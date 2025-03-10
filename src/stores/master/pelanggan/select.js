import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";

export const useMasterPelangganSelectStore = defineStore(
  "master-pelanggan-select-store",
  {
    state: () => ({
      items: [],
      isError: false,
      loading: false,
      params: {
        q: null,
        limit: 0,
      },
    }),

    actions: {
      async getDataAll() {
        this.loading = true;

        try {
          const { data } = await api.get("/xy/master/select/pelanggan-all");
          // console.log('get Satuan all', data)
          if (data) {
            this.items = data;
          }
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.isError = true;
          this.loading = false;
        }
      },
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useMasterPelangganSelectStore, import.meta.hot)
  );
}
