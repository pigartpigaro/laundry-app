<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useLeftDrawerStore } from "./stores/app/leftdrawer";
import { useMasterSatuanSelectStore } from "./stores/master/satuan/select";
import { useMasterKategoriSelectStore } from "./stores/master/kategori/select";
import { useMasterPelangganSelectStore } from "./stores/master/pelanggan/select";
import { useMasterProdukSelectStore } from "./stores/master/produklayanan/select";

const adminLeftMenu = useLeftDrawerStore();
const selectSatuan = useMasterSatuanSelectStore();
const selectKategori = useMasterKategoriSelectStore();
const selectPelanggan = useMasterPelangganSelectStore();
const selectProduk = useMasterProdukSelectStore();
onBeforeMount(() => {
  Promise.all([
    adminLeftMenu.getMenu(),
    selectSatuan.getDataAll(),
    selectKategori.getDataAll(),
    selectPelanggan.getDataAll(),
    selectProduk.getDataAll(),
  ]);
});
</script>
