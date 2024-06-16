import Conversation from "@/components/conversation/Conversation";

export const runtime = "edge";
function HomePage() {
  return (
    <div>
      <Conversation />
    </div>
  );
}
export default HomePage;
