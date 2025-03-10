import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";

export const useMasterSatuanSelectStore = defineStore(
  "master-satuan-select-store",
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
          const { data } = await api.get("/xy/master/select/satuan-all");
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
    acceptHMRUpdate(useMasterSatuanSelectStore, import.meta.hot)
  );
}
