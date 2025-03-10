import { defineStore, acceptHMRUpdate } from "pinia";

import { api } from "src/boot/axios";
import { useMasterPelangganStore } from "./list";
import { notifSuccess } from "src/modules/notifs";

export const useFormMasterPelangganStore = defineStore(
  "form-master-pelanggan-store",
  {
    state: () => ({
      form: {
        id: null,
        kodepelanggan: null,
        pelanggan: null,
        alamat: null,
        nohp: null,
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
            this.form.kodepelanggan = data?.kodepelanggan;
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
            .post("/xy/master/pelanggan/savedata", this.form)
            .then(({ data }) => {
              console.log("saved", data);
              this.loading = false;

              // inject data
              const arr = useMasterPelangganStore();
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
    acceptHMRUpdate(useFormMasterPelangganStore, import.meta.hot)
  );
}
