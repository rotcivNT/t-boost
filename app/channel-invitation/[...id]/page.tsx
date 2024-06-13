import { acceptInvitation } from "@/app/services/action";
import AcceptInvitation from "@/components/accept-invitation/AcceptInvitation";

const handleAcceptInviatation = async (invitationId: string) => {
  try {
    const res = await acceptInvitation(invitationId);
    return res;
  } catch (e) {
    console.log(e);
  }
};

async function Page({ params }: { params: { id: string } }) {
  const res = await handleAcceptInviatation(params.id[0]);
  return <AcceptInvitation data={res} />;
}

export default Page;
