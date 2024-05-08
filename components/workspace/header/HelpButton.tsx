import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";

function HelpButton() {
  return (
    <Button variant="icon" size="icon">
      <CircleHelp color="#fff" strokeWidth={1.5} size={20} />
    </Button>
  );
}

export default HelpButton;
