<template>
  <q-dialog presistent backdrop-filter="blur(4px)">
    <q-card style="min-width: 80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header>
          <q-bar class="bg-primary text-white">
            <div>Cetak Nota</div>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container id="printMe">
          <div class="q-pa-sm">
            <data-cetak />
          </div>
        </q-page-container>
        <q-footer elevated>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <btn-print v-print="printObj" unelevated> </btn-print>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useFormOrderTransaksiStore } from "src/stores/order/form";
import DataCetak from "./DataCetak.vue";
import { ref } from "vue";

const store = useFormOrderTransaksiStore();
const printed = ref(false);
const printObj = {
  id: "printMe",
  popTitle: "Nota Tagihan Laundry || NAMI LAUNDRY",

  beforeOpenCallback(vue) {
    printed.value = true;
    console.log("wait...");
  },
  openCallback(vue) {
    console.log("opened");
  },
  closeCallback(vue) {
    printed.value = false;
    console.log("closePrint");
  },
};
</script>
