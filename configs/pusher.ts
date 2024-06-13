import Pusher from "pusher-js/with-encryption";
export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: "ap1",
});
