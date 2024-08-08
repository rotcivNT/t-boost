import { MessageCluster, MessageItemProps } from "@/types";

interface IProps {
  messagesList: Map<string, MessageCluster>;
  message: MessageItemProps;
  clusterId: string;
  updateSending: boolean;
}

interface IUpdatePartialProps<K extends keyof MessageItemProps> {
  messagesList: Map<string, MessageCluster>;
  messageId: string;
  clusterId: string;
  key: K;
  value: MessageItemProps[K];
}

export const updateMessageByUniqueId = ({
  messagesList,
  message,
  clusterId,
  updateSending,
}: IProps): Map<string, MessageCluster> => {
  const cluster = messagesList.get(clusterId);
  if (cluster) {
    const updateMessageIndex = cluster.messages.findIndex(
      (messageItem) =>
        messageItem.uniqueId === message.uniqueId &&
        (!updateSending || messageItem.isSending)
    );
    if (updateMessageIndex !== -1) {
      cluster.messages[updateMessageIndex] = message;
    }
  }
  return new Map<string, MessageCluster>(messagesList);
};

export const updatePartialMessageById = <K extends keyof MessageItemProps>(
  props: IUpdatePartialProps<K>
) => {
  const { messagesList, messageId, clusterId, key, value } = props;
  const cluster = messagesList.get(clusterId);
  if (cluster) {
    const updateMessageIndex = cluster.messages.findIndex(
      (messageItem) => messageItem._id === messageId
    );
    if (updateMessageIndex !== -1) {
      cluster.messages[updateMessageIndex] = {
        ...cluster.messages[updateMessageIndex],
        [key]: value,
      };
    }
  }
  return new Map<string, MessageCluster>(messagesList);
};
