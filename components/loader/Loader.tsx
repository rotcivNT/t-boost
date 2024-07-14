import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loader2 size={50} className="animate-spin" />
    </div>
  );
}

export default Loader;
