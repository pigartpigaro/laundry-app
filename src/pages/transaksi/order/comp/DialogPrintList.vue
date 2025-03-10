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
        <q-page-container id="printMex">
          <div class="q-pa-sm">
            <div
              class="col justify-center content-center items-center full-width"
            >
              <div class="justify-center text-center q-py-sm">
                <q-img src="~assets/logonami.svg" style="width: 250px" />
              </div>

              <div class="justify-center text-center text-weight-bold">
                Jalan Merapi Perum Griya Harapan Indah I No. 06
              </div>
              <div class="justify-center text-center text-weight-bold">
                Triwung Lor, Kota Probolinggo
              </div>
              <div class="justify-center text-center" style="font-size: 13px">
                wa 1: 082-324-141-494
              </div>
              <div class="justify-center text-center" style="font-size: 13px">
                wa 2: 082-233-484-161
              </div>
              <div class="justify-center text-center q-pt-md text-weight-bold">
                No Nota : {{ store.dataCetak?.no_nota }}
              </div>
            </div>
            <div class="row content-center q-pt-sm">
              <div class="content-center col-3 text-weight-bold">Nama</div>
              <div class="content-center col-auto q-pr-sm">:</div>
              <div class="content-center col">
                {{ store.dataCetak?.pelanggan }}
              </div>
            </div>
            <div class="row content-center q-pb-xs">
              <div class="content-center col-3 text-weight-bold">Alamat</div>
              <div class="content-center col-auto q-pr-sm">:</div>
              <div class="content-center col">
                {{ store.dataCetak?.alamat }}
              </div>
            </div>
            <div class="row content-center q-pb-xs">
              <div class="content-center col-3 text-weight-bold">Hp</div>
              <div class="content-center col-auto q-pr-sm">:</div>
              <div class="content-center col">{{ store.dataCetak?.nohp }}</div>
            </div>
            <div class="q-pt-sm" />
            <q-list bordered separator>
              <q-item v-for="item in store.dataCetak?.rincians" :key="item">
                <q-item-section>
                  <q-item-label>Layanan : {{ item.produk }} </q-item-label>
                  <q-item-label overline>
                    {{ item.kuantitas }} {{ item.satuan }} x
                    <span>{{ formatRpDouble(item.harga) }} </span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-item-label caption
                    >Ket: {{ item.keterangan }}</q-item-label
                  >
                  <span class="text-black"
                    >{{ formatRpDouble(item.subtotal) }}
                  </span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold">JUMLAH :</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-bold text-black">{{
                    formatRpDouble(totalNota())
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div
              class="col justify-center content-center items-center full-width q-pt-md"
            >
              <div class="justify-center text-center" style="font-size: 13px">
                Thanks for Order, if Transfer, here :
              </div>
              <div class="justify-center text-center" style="font-size: 13px">
                BCA - 0391408148
              </div>
              <div class="justify-center text-center" style="font-size: 13px">
                BJatim - 0126400314
              </div>
              <div class="justify-center text-center" style="font-size: 13px">
                a.n Vighar Choirul Iqbal
              </div>
              <div class="justify-center text-center" style="font-size: 13px">
                Powered by Nami Laundry
              </div>
            </div>
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
import { formatRpDouble } from "src/modules/formatter";
import { useOrderTransaksiStore } from "src/stores/order/list";

import { ref } from "vue";

const store = useOrderTransaksiStore();
const printed = ref(false);
const printObj = {
  id: "printMex",
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
function totalNota() {
  const rinci = store.dataCetak?.rincians?.map((x) => parseFloat(x.subtotal));
  const total = rinci.reduce((a, b) => a + b, 0);
  return total;
}
</script>
