import { MessageCluster, MessageItemProps } from "@/types";

interface IProps {
  messagesList: Map<string, MessageCluster>;
  clusterId: string;
  message: MessageItemProps;
}

export const addMessage = ({
  messagesList,
  clusterId,
  message,
}: IProps): Map<string, MessageCluster> => {
  const cluster = messagesList.get(clusterId);
  if (cluster) {
    cluster.messages.push(message);
  } else {
    messagesList.set(clusterId, {
      _id: clusterId,
      messages: [message],
    });
  }
  return new Map<string, MessageCluster>(messagesList);
};
