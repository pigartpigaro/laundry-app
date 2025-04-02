import { defineStore, acceptHMRUpdate } from "pinia";

import { api } from "src/boot/axios";
import { useOrderTransaksiStore } from "./list";
import { notifError, notifSuccess } from "src/modules/notifs";

export const useFormPembayaranStore = defineStore("form-pembayaran-store", {
  state: () => ({
    form: {
      id: null,
      kodebayar: null,
      kodepelanggan: null,
      pelanggan: null,
      alamat: null,
      nohp: null,
      jnsbayar: null,
      totalbayar: 0,
      kembalian: 0,
      total: 0,
      rincians: [],
    },
    dialogCetak: false,
    dialogrincis: false,
    loading: false,
    disableHeader: false,
    activeRinciIndex: null, // Tambahkan state untuk menyimpan index rincian yang sedang diedit
    dataCetak: [],
    selectNota: [],
    isipembayaran: [],

    jnsbayar: [{ item: "TUNAI" }, { item: "TRANSFER" }],
  }),

  actions: {
    addSelectedNota(noNota) {
      this.isipembayaran.push(noNota);
    },
    removeSelectedNota(noNota) {
      this.isipembayaran = this.isipembayaran.filter((item) => item !== noNota);
    },
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
          .post("/xy/transaksi/lunas/savepay", this.form)
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
                  obj?.id === data.result.id ? { ...obj, ...data.result } : obj
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
        const resp = await api.post(`/xy/order/transaksi/deleteorder`, params);
        if (resp.status === 200) {
          const newArr = this.form.rincians?.filter((item) => item?.id !== id);
          this.form.rincians = newArr;
          notifSuccess("Data berhasil dihapus");
        }
      } catch (error) {
        console.log("Gagal menghapus gambar:", error);
        notifError("Terjadi Kesalahan");
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useFormPembayaranStore, import.meta.hot)
  );
}
