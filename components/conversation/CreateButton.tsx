import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { AddChannelModal } from "./channels/AddChannelModal";

interface IProps {
  title: string;
  onClick?: any;
}

function CreateButton({ title, onClick }: IProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="auto"
          onClick={onClick}
          className="text-sm text-[#B9BABD] h-7 w-full font-[400]"
        >
          <div className="bg-[rgba(34,36,38,0.9)] size-5 flex items-center justify-center rounded-[2px] relative left-[-2px]">
            <Plus width={14} height={14} strokeWidth={1.6} color="#B9BABD" />
          </div>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[6px] px-7 py-5 bg-dark-secondary">
        <AddChannelModal />
      </DialogContent>
    </Dialog>
  );
}

export default CreateButton;
