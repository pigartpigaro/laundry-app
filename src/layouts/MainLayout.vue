<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-yellow-8 text-white">
      <q-toolbar>
        <!-- <q-btn
          dense
          flat
          round
          class="material-icons-round"
          icon="menu_open"
          @click="toggleLeftDrawer"
        /> -->

        <q-toolbar-title>
          <div class="cursor-pointer" @click="goTo('/dashboard')">
            <q-avatar>
              <img style="max-width: 50px" src="~assets/favicon.svg" />
            </q-avatar>
            <span class="text-subtitle2">NAMI LAUNDRY</span>
          </div>
        </q-toolbar-title>

        <q-btn dense flat round @click="toggleRightDrawer">
          <q-avatar>
            <img style="max-width: 50px" src="~assets/settings.png" />
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- <q-card
      v-if="leftSubOpen"
      class="absolute full-height"
      style="z-index: 9; margin-left: 56px; width: 250px"
    >
      <SubLeftMenu
        :tab="selectedTab"
        :menu="selectedMenu"
        @menu-click="
          (val) => {
            selectedMenu = val;
            toLink(val);
          }
        "
      />
    </q-card> -->
    <q-drawer
      show-if-above
      no-swipe-open
      behavior="desktop"
      class="z-top"
      v-model="leftDrawerOpen"
      side="left"
      :width="220"
      bordered
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
    >
      <!-- drawer content -->
      <LeftMenu
        ref="refLeftMenu"
        @select-tab="
          (val) => {
            console.log('val tab', val);
            selectedTab = val;

            if (val?.subs?.length) {
              if (!leftSubOpen) {
                leftSubOpen = true;
              }
            } else {
              selectedMenu = null;
              leftSubOpen = false;
              toLink(val);
            }
          }
        "
      />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useLeftDrawerStore } from "src/stores/app/leftdrawer";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const LeftMenu = defineAsyncComponent(() => import("./comp/LeftMenu.vue"));

const left = useLeftDrawerStore();
// Refs untuk mengontrol state drawer
const leftDrawerOpen = ref(false);
const leftSubOpen = ref(false);
const rightDrawerOpen = ref(false);

// Ref untuk komponen LeftMenu
const refLeftMenu = ref(null);

// Ref untuk select menu
const selectedTab = ref(null);
const selectedMenu = ref(null);

const route = useRoute();
const router = useRouter();

const miniState = ref(true);

onMounted(() => {
  selectedTab.value = left.tabs[0];
  initMenu();
});

function goTo(url) {
  router.replace({ path: url });
}
function initMenu() {
  const leftMenuInStore = left?.tabs?.map((x) => x?.link);
  const findMenu = leftMenuInStore?.find((x) => x === route?.fullPath) ?? null;
  left.setTab(route?.fullPath);

  if (!findMenu) {
    const findMenuSub =
      left?.tabs?.find((x) =>
        x?.subs?.find((y) => y?.link === route?.fullPath)
      ) ?? null;
    if (findMenuSub) {
      const target = findMenuSub.subs?.find((y) => y?.link === route?.fullPath);
      selectedMenu.value = target;
    }
    selectedTab.value = findMenuSub;
  } else {
    selectedTab.value = findMenu;
    selectedMenu.value = null;
  }
}

function toLink(val) {
  console.log("vaal", val);
  const link = val?.link;
  if (link) {
    const firstTxt = link?.charAt(0);
    let newLink = null;
    if (firstTxt !== "/") {
      newLink = `/${link}`;
    } else {
      newLink = link;
    }
    router.push(newLink);
  }
}

// Fungsi untuk toggle drawer
// const toggleLeftDrawer = () => {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// };

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>
