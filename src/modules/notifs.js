import { Notify } from "quasar";

const notifSuccess = (msg) => {
  Notify.create({
    message: msg || "Success!",
    icon: "task_alt",
    position: "bottom",
    actions: [
      {
        label: "Dismiss",
        color: "primary",
        handler: () => {
          /* console.log('wooow') */
        },
      },
    ],
  });
};
const notifError = (msg) => {
  Notify.create({
    message: msg || "Ada Kesalahan!",
    icon: "warning",
    position: "bottom",
    actions: [
      {
        label: "Dismiss",
        color: "negative",
        handler: () => {
          /* console.log('wooow') */
        },
      },
    ],
  });
};

export { notifSuccess, notifError };
