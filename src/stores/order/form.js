import { defineStore, acceptHMRUpdate } from "pinia";

import { api } from "src/boot/axios";
import { useOrderTransaksiStore } from "./list";
import { notifError, notifSuccess } from "src/modules/notifs";

export const useFormOrderTransaksiStore = defineStore(
  "form-order-transaksi-store",
  {
    state: () => ({
      form: {
        id: null,
        no_nota: null,
        kodepelanggan: null,
        pelanggan: null,
        alamat: null,
        nohp: null,
        rincians: [],
      },
      dialogCetak: false,
      dialogrincis: false,
      loading: false,
      disableHeader: false,
      activeRinciIndex: null, // Tambahkan state untuk menyimpan index rincian yang sedang diedit
      dataCetak: [],
    }),

    actions: {
      initReset(data) {
        console.log("Data dari backend:", data);
        if (data) {
          return new Promise((resolve) => {
            for (const key in this.form) {
              if (key !== "rincians") {
                this.form[key] = data[key] || null;
              }
            }
            this.form.rincians = data.rincians ? [...data.rincians] : [];
            console.log("Data rincians setelah diisi:", this.form.rincians);
            resolve();
          });
        } else {
          for (const key in this.form) {
            if (key !== "rincians") {
              this.form[key] = null;
            }
          }
          this.form.rincians = [];
        }
      },

      async save(add) {
        this.loading = true;
        const formData = new FormData();

        for (const key in this.form) {
          if (key !== "rincians" && this.form[key] !== null) {
            formData.append(key, this.form[key]);
          }
        }
        // Tambahkan rincians ke formData jika diperlukan
        if (this.form.rincians && this.form.rincians.length > 0) {
          formData.append("rincians", JSON.stringify(this.form.rincians));
        }

        return new Promise((resolve, reject) => {
          api
            .post("/xy/order/transaksi/saveorder", this.form)
            .then(({ data }) => {
              console.log("saved", data);
              this.loading = false;

              // inject data
              const arr = useOrderTransaksiStore();
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
              // this.initReset(null);
              this.form = { ...this.form, ...data.result };
              resolve(data);
            })
            .catch((err) => {
              this.loading = false;
              reject(err);
            });
        });
      },
      async deleteData(id) {
        console.log("id", id);
        const params = { id };
        try {
          const resp = await api.post(
            `/xy/order/transaksi/deleteorder`,
            params
          );
          if (resp.status === 200) {
            const newArr = this.form.rincians?.filter(
              (item) => item?.id !== id
            );
            this.form.rincians = newArr;
            notifSuccess("Data berhasil dihapus");
          }
        } catch (error) {
          console.log("Gagal menghapus gambar:", error);
          notifError("Terjadi Kesalahan");
        }
      },
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useFormOrderTransaksiStore, import.meta.hot)
  );
}
