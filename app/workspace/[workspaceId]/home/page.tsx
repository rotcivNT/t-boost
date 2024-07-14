import dynamic from "next/dynamic";
const Conversation = dynamic(
  () => import("@/components/conversation/Conversation"),
  {
    ssr: false,
  }
);

function HomePage() {
  return (
    <div>
      <Conversation />
    </div>
  );
}
export default HomePage;
