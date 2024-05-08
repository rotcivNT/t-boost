import ChannelContent from "@/components/conversation/channels/channel-content/ChannelContent";

async function ChannelPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ChannelContent cid={searchParams.cid as string} />;
}

export default ChannelPage;
