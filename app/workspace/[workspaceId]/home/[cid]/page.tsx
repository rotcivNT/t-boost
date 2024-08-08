import DirectMessagesContent from "@/components/conversation/direct-messages/direct-messages-content/DirectMessagesContent";
import dynamic from "next/dynamic";

const ChannelContent = dynamic(
  () =>
    import("@/components/conversation/channels/channel-content/ChannelContent"),
  { ssr: false }
);

async function ChannelPage({ params }: { params: { [key: string]: string } }) {
  const cid = params.cid as string;
  const isDirectMessage = cid.startsWith("D");
  return isDirectMessage ? (
    <DirectMessagesContent cid={cid.slice(1)} />
  ) : (
    <ChannelContent cid={cid} />
  );
}

export default ChannelPage;
