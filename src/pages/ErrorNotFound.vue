<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-xs flex flex-center"
  >
    <div style="position: relative">
      <img style="width: 50vh" src="~assets/Notfound2.svg" />
      <!-- <div style="font-size: 30vh">404</div> -->

      <!-- <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div> -->
      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
        style="
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
        "
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "ErrorNotFound",
});
</script>
