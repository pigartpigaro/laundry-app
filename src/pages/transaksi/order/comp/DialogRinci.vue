<template>
  <q-dialog class="full-width q-mt-lg" backdrop-filter="blur(4x)" persistent>
    <q-card style="width: 80vw; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="full-width full-height q-pb-sm text-center text-h6">
          Rincian Order
        </div>
        <q-space />
        <q-btn
          class="absolute-top-right"
          icon="close"
          flat
          round
          dense
          @click="closeDialog"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div class="row q-col-gutter-md">
                <app-select
                  class="col-12"
                  v-model="localRinci.produk"
                  label="Pilih Produk"
                  :options="selectProduk?.items"
                  option-label="produk"
                  option-value="produk"
                  @update:model-value="(val) => isiproduk(val)"
                />
                <app-input
                  class="col-6"
                  v-model="localRinci.harga"
                  label="Harga"
                  readonly
                  :valid="{ required: true }"
                />
                <app-input
                  class="col-6"
                  v-model="localRinci.satuan"
                  label="Satuan"
                  readonly
                  :valid="{ required: true }"
                />
                <app-input
                  class="col-12"
                  v-model="localRinci.kuantitas"
                  label="Kuantitas"
                  :valid="{ required: true }"
                  @update:model-value="
                    (val) => {
                      localRinci.subtotal =
                        parseFloat(localRinci.harga) * parseFloat(val);
                    }
                  "
                />
                <app-input
                  class="col-12"
                  v-model="localRinci.subtotal"
                  label="Subtotal"
                  readonly
                  :valid="{ required: true }"
                />
                <app-input
                  class="col-12"
                  v-model="localRinci.keterangan"
                  label="Keterangan"
                  :valid="{ required: true }"
                />

                <div class="col-12">
                  <q-separator class="q-my-md" />
                  <app-btn
                    :loading="store.loading"
                    type="submit"
                    :dense="false"
                    label="Simpan"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMasterProdukSelectStore } from "src/stores/master/produklayanan/select";
import { useFormOrderTransaksiStore } from "src/stores/order/form";

const store = useFormOrderTransaksiStore();
const selectProduk = useMasterProdukSelectStore();

// Gunakan ref lokal untuk menyimpan data sementara
const localRinci = ref({
  no_nota: null,
  kodeproduk: null,
  produk: null,
  satuan: null,
  kategori: null,
  kuantitas: null,
  harga: null,
  subtotal: null,
  keterangan: null,
});

// Watch perubahan pada index rincian yang aktif
watch(
  () => store.activeRinciIndex,
  (index) => {
    if (index !== null) {
      // Jika mode edit, salin data dari store ke localRinci
      localRinci.value = { ...store.form.rincians[index] };
    } else {
      // Jika mode tambah, reset localRinci
      localRinci.value = {
        no_nota: null,
        kodeproduk: null,
        produk: null,
        satuan: null,
        kategori: null,
        kuantitas: null,
        harga: null,
        subtotal: null,
        keterangan: null,
      };
    }
  },
  { immediate: true }
);

function isiproduk(val) {
  const kode = selectProduk?.items.find((x) => x?.produk === val);
  localRinci.value.kodeproduk = kode?.kodeproduk;
  localRinci.value.harga = kode?.harga;
  localRinci.value.satuan = kode?.satuan;
  localRinci.value.kategori = kode?.kategori;
}

const closeDialog = () => {
  store.dialogrincis = false;
  store.activeRinciIndex = null; // Reset index setelah tutup dialog
  localRinci.value = {
    produk: null,
    satuan: null,
    kuantitas: null,
    harga: null,
    subtotal: null,
    keterangan: null,
  };
};

function onSubmit() {
  // Validasi
  if (
    !localRinci.value.produk ||
    !localRinci.value.kuantitas ||
    !localRinci.value.harga ||
    !localRinci.value.subtotal
  ) {
    alert("Harap Lengkapi Semua Field Rincian!");
    return;
  }

  // Update atau tambah data
  if (store.activeRinciIndex !== null) {
    // Mode edit: update data existing
    store.form.rincians[store.activeRinciIndex] = { ...localRinci.value };
  } else {
    // Mode tambah: push data baru
    store.form.rincians.push({ ...localRinci.value });
  }

  // Simpan ke backend
  store
    .save()
    .then(() => {
      console.log("Data berhasil disimpan!");
      closeDialog();
    })
    .catch((error) => {
      console.error("Gagal menyimpan:", error);
    });
}
</script>
