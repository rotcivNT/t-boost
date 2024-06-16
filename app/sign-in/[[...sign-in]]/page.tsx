import { SignIn } from "@clerk/nextjs";

export const runtime = "edge";
export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
