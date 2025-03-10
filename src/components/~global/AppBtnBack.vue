<template>
  <q-btn round icon="undo" dense :type="type">
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup>
defineProps({
  tooltip: {
    type: String,
    default: "Kembali",
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>
