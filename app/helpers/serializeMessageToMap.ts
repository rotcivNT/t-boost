import { MessageCluster } from "@/types";

export const SerializeMessageToMap = (
  message: MessageCluster[]
): Map<string, MessageCluster> => {
  const messageMap = new Map<string, MessageCluster>();
  message.forEach((msg) => {
    messageMap.set(msg._id, msg);
  });
  return messageMap;
};
