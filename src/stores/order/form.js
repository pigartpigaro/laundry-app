// import { defineStore, acceptHMRUpdate } from "pinia";

// import { api } from "src/boot/axios";
// import { useOrderTransaksiStore } from "./list";
// import { notifError, notifSuccess } from "src/modules/notifs";

// export const useFormOrderTransaksiStore = defineStore(
//   "form-order-transaksi-store",
//   {
//     state: () => ({
//       form: {
//         id: null,
//         no_nota: null,
//         kodepelanggan: null,
//         pelanggan: null,
//         alamat: null,
//         nohp: null,
//         rincians: [],
//       },

//       listrincian: [],
//       dialogCetak: false,
//       dialogrincis: false,
//       loading: false,
//       disableHeader: false,
//       activeRinciIndex: null, // Tambahkan state untuk menyimpan index rincian yang sedang diedit
//       dataCetak: [],
//     }),

//     actions: {
//       initReset(data) {
//         console.log("Data dari backend:", data);
//         if (data) {
//           return new Promise((resolve) => {
//             for (const key in this.form) {
//               if (key !== "rincians") {
//                 this.form[key] = data[key] || null;
//               }
//             }
//             this.form.rincians = data.rincians ? [...data.rincians] : [];
//             console.log("Data rincians setelah diisi:", this.form.rincians);
//             resolve();
//           });
//         } else {
//           for (const key in this.form) {
//             if (key !== "rincians") {
//               this.form[key] = null;
//             }
//           }
//           this.form.rincians = [];
//         }
//       },

//       async save(add) {
//         this.loading = true;
//         const formData = new FormData();

//         for (const key in this.form) {
//           if (key !== "rincians" && this.form[key] !== null) {
//             formData.append(key, this.form[key]);
//           }
//         }
//         // Tambahkan rincians ke formData jika diperlukan
//         if (this.form.rincians && this.form.rincians.length > 0) {
//           formData.append("rincians", JSON.stringify(this.form.rincians));
//         }

//         return new Promise((resolve, reject) => {
//           api
//             .post("/xy/order/transaksi/saveorder", this.form)
//             .then(({ data }) => {
//               console.log("saved", data);
//               this.loading = false;

//               // inject data
//               const arr = useOrderTransaksiStore();
//               if (!add) {
//                 arr.items.unshift(data?.result);
//               } else {
//                 if (arr?.items && data?.result?.id) {
//                   arr.items = arr.items.map((obj) =>
//                     obj?.id === data.result.id
//                       ? { ...obj, ...data.result }
//                       : obj
//                   );
//                 }
//               }
//               // arr.items.unshift(data?.result)
//               notifSuccess("Data berhasil disimpan");
//               // this.initReset(null);
//               this.form = { ...this.form, ...data.result };
//               resolve(data);
//             })
//             .catch((err) => {
//               this.loading = false;
//               reject(err);
//             });
//         });
//       },
//       async deleteData(id) {
//         console.log("id", id);
//         const params = { id };
//         try {
//           const resp = await api.post(
//             `/xy/order/transaksi/deleteorder`,
//             params
//           );
//           if (resp.status === 200) {
//             const newArr = this.form.rincians?.filter(
//               (item) => item?.id !== id
//             );
//             this.form.rincians = newArr;
//             notifSuccess("Data berhasil dihapus");
//           }
//         } catch (error) {
//           console.log("Gagal menghapus gambar:", error);
//           notifError("Terjadi Kesalahan");
//         }
//       },
//     },
//   }
// );

// if (import.meta.hot) {
//   import.meta.hot.accept(
//     acceptHMRUpdate(useFormOrderTransaksiStore, import.meta.hot)
//   );
// }

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
      listrincian: [],
      dialogCetak: false,
      dialogrincis: false,
      loading: false,
      disableHeader: false,
      activeRinciIndex: null,
      dataCetak: [],
    }),

    actions: {
      initReset(data) {
        if (data) {
          this.form = {
            no_nota: data.no_nota,
            kodepelanggan: data.kodepelanggan,
            pelanggan: data.pelanggan,
            alamat: data.alamat,
            nohp: data.nohp,
            rincians: data.rincians ? [...data.rincians] : [],
          };
          this.listrincian = data.rincians ? [...data.rincians] : [];
        } else {
          this.form = {
            no_nota: null,
            kodepelanggan: null,
            pelanggan: null,
            alamat: null,
            nohp: null,
            rincians: [],
          };
          this.listrincian = [];
        }
      },

      async save(add = false) {
        this.loading = true;

        // Siapkan payload sesuai kebutuhan backend
        const payload = {
          no_nota: this.form.no_nota,
          kodepelanggan: this.form.kodepelanggan,
          pelanggan: this.form.pelanggan,
          alamat: this.form.alamat,
          nohp: this.form.nohp,
          rincians: this.form.rincians.map((item) => ({
            kodeproduk: item.kodeproduk,
            produk: item.produk,
            kategori: item.kategori,
            satuan: item.satuan,
            kuantitas: parseFloat(item.kuantitas),
            harga: parseFloat(item.harga),
          })),
        };

        try {
          const response = await api.post(
            "/xy/order/transaksi/saveorder",
            payload
          );

          // Update nomor nota jika baru dibuat
          if (response.data.nomer) {
            this.form.no_nota = response.data.nomer;
            // Update no_nota di semua rincian
            this.form.rincians = this.form.rincians.map((item) => ({
              ...item,
              no_nota: response.data.nomer,
            }));
            this.listrincian = this.listrincian.map((item) => ({
              ...item,
              no_nota: response.data.nomer,
            }));
          }

          // Update daftar transaksi
          const arr = useOrderTransaksiStore();
          await arr.getList();
          // if (!add) {
          //   arr.items.unshift(response.data?.result);
          // } else {
          //   if (arr?.items && response.data?.result?.id) {
          //     arr.items = arr.items.map((obj) =>
          //       obj?.id === response.data.result.id
          //         ? { ...obj, ...response.data.result }
          //         : obj
          //     );
          //   }
          // }

          notifSuccess(response.data?.message || "Data berhasil disimpan");
          return response.data;
        } catch (error) {
          notifError(error.response?.data?.message || "Gagal menyimpan data");
          throw error;
        } finally {
          this.loading = false;
        }
      },

      async deleteData(id) {
        try {
          const params = { id, no_nota: this.form.no_nota };
          console.log("prams delete", params);
          const resp = await api.post(
            `/xy/order/transaksi/deleteorder`,
            params
          );

          if (resp.status === 200) {
            // Hapus dari listrincian dan form.rincians
            this.form.rincians = this.form.rincians.filter(
              (item) => item?.id !== id
            );
            this.listrincian = this.listrincian.filter(
              (item) => item?.id !== id
            );
            const orderStore = useOrderTransaksiStore();
            await orderStore.getList();
            notifSuccess("Data berhasil dihapus");
          }
        } catch (error) {
          console.error("Gagal menghapus:", error);
          notifError("Terjadi kesalahan saat menghapus");
        }
      },

      updateRincian(rincian) {
        if (this.activeRinciIndex !== null) {
          this.form.rincians[this.activeRinciIndex] = rincian;
          this.listrincian[this.activeRinciIndex] = rincian;
        } else {
          this.form.rincians.push(rincian);
          this.listrincian.push(rincian);
        }
        this.activeRinciIndex = null;
      },
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useFormOrderTransaksiStore, import.meta.hot)
  );
}
