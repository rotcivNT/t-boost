import dynamic from "next/dynamic";

const ChannelContent = dynamic(
  () =>
    import("@/components/conversation/channels/channel-content/ChannelContent"),
  { ssr: false }
);

async function ChannelPage({ params }: { params: { [key: string]: string } }) {
  return <ChannelContent cid={params.cid as string} />;
}

export default ChannelPage;
