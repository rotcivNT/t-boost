import DirectMessagesContent from "@/components/conversation/direct-messages/direct-messages-content/DirectMessagesContent";

async function DCMPage({ params }: { params: { [key: string]: string } }) {
  const cid = params.cid as string;
  return <DirectMessagesContent cid={cid.slice(1)} />;
}

export default DCMPage;
