import { defineStore, acceptHMRUpdate } from "pinia";

import { api } from "src/boot/axios";
import { useMasterProdukStore } from "./list";
import { notifSuccess } from "src/modules/notifs";

export const useFormMasterProdukStore = defineStore(
  "form-master-produk-store",
  {
    state: () => ({
      form: {
        id: null,
        produk: null,
        kodeproduk: null,
        harga: null,
        kodekategori: null,
        kategori: null,
        kodesatuan: null,
        satuan: null,
        flag: null,
      },
      loading: false,
    }),

    actions: {
      initReset(data) {
        if (data) {
          return new Promise((resolve) => {
            for (const key in this.form) {
              // console.log(`${key}: ${this.form[key]}`);
              // console.log(`${key}`);
              this.form[key] = data[key];
            }
            this.form.kodeproduk = data?.kodeproduk;
            console.log(this.form);

            resolve();
          });
        } else {
          for (const key in this.form) {
            // console.log(`${key}: ${this.form[key]}`);
            this.form[key] = null;
          }
        }
      },

      async save(add) {
        this.loading = true;
        return new Promise((resolve, reject) => {
          api
            .post("/xy/master/produk/savedata", this.form)
            .then(({ data }) => {
              console.log("saved", data);
              this.loading = false;

              // inject data
              const arr = useMasterProdukStore();
              if (!add) {
                arr.items.unshift(data?.result);
              } else {
                if (arr?.items && data?.result?.id) {
                  arr.items = arr.items.map((obj) =>
                    obj?.id === data.result.id
                      ? { ...obj, ...data.result }
                      : obj
                  );
                }
              }
              // arr.items.unshift(data?.result)
              notifSuccess("Data berhasil disimpan");
              this.initReset(null);
              resolve(data);
            })
            .catch((err) => {
              this.loading = false;
              reject(err);
            });
        });
      },
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useFormMasterProdukStore, import.meta.hot)
  );
}
