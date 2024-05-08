import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

function CreateButton() {
  return (
    <Button
      size={"icon"}
      variant={"icon"}
      className={cn(
        "rounded-full bg-[rgba(248,248,248,0.25)] size-6 hover:scale-[1.1] hover:bg-[rgba(248,248,248,0.3)] transition-all duration-200",
        "lg:size-9"
      )}
    >
      <Plus width={20} height={20} strokeWidth={1.5} color="#F8F8F8" />
    </Button>
  );
}

export default CreateButton;
