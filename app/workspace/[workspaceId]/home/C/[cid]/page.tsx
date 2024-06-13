import dynamic from "next/dynamic";

const ChannelContent = dynamic(
  () =>
    import("@/components/conversation/channels/channel-content/ChannelContent"),
  { ssr: false }
);

async function ChannelPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ChannelContent cid={searchParams.cid as string} />;
}

export default ChannelPage;
