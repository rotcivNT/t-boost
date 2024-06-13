import Pusher from "pusher-js/with-encryption";
export const pusher = new Pusher("e7bb011c90e1ac1b07cf", {
  cluster: "ap1",
});
