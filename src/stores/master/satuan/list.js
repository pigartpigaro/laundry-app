import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";
import { notifError, notifSuccess } from "src/modules/notifs";

export const useMasterSatuanStore = defineStore("master-satuan-store", {
  state: () => ({
    meta: null,
    items: [],
    inisial: [],
    isError: false,
    loading: false,
    params: {
      q: null,
      page: 0,
      per_page: 15,
    },
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    async getList() {
      // console.log('get master barang page', this.params.page);
      this.params.page = 1;
      this.isError = false;
      this.loading = true;
      const params = {
        params: this.params,
      };
      try {
        const { data } = await api.get("/xy/master/satuan/listdata", params);
        this.meta = data;
        this.items = data?.data;
        this.loading = false;
        // this.items = data
      } catch (error) {
        console.log(error);
        this.isError = true;
        this.loading = false;
      }
    },

    loadMore(index, done) {
      this.isError = false;
      this.params.page = index;
      const params = {
        params: this.params,
      };

      console.log("load more", index);

      return new Promise((resolve) => {
        api
          .get("/xy/master/satuan/listdata", params)
          .then(({ data }) => {
            this.meta = data;
            this.items.push(...data.data);
            // console.log("ITEMS", this.items);
            done();
            resolve();
          })
          .catch(() => {
            this.isError = true;
            done(true);
            resolve();
          });
      });
    },
    async deleteItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      const params = { id };
      try {
        const resp = await api.post(`/xy/master/satuan/deletedata`, params);
        if (resp.status === 200) {
          const newArr = this.items?.filter((item) => item?.id !== id);
          this.items = newArr;

          notifSuccess("Data berhasil dihapus");
        }
      } catch (error) {
        console.log("del Brand error", error);
        notifError("Terjadi Kesalahan");
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useMasterSatuanStore, import.meta.hot)
  );
}
