import { SendMessageProps, Sender } from "@/app/apis/api-payload";
import { forwardMessage } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { pusher } from "@/configs/pusher";
import { MessageItemProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Forward } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  message: MessageItemProps;
}

function ForwardButton({ message }: IProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { channels } = useChannelStore((state) => ({
    channels: state.channels,
  }));

  const [results, setResults] = useState(channels);
  const [sended, setSended] = useState<string[]>([]);
  const { user } = useUser();
  const onFowardMessage = async (channelId: string) => {
    try {
      const uniqueId = uuidv4();
      const createMessageItemDto: SendMessageProps = {
        ...message,
        uniqueId,
        reactions: [],
        receiverId: channelId,
        socketId: pusher.connection.socket_id,
        sender: {
          clerkUserId: user?.id as string,
          fullName: user?.fullName as string,
          imageUrl: user?.imageUrl as string,
        },
      };
      if (message.sender?.clerkUserId !== (user?.id as string)) {
        createMessageItemDto.fowarder = user?.id as string;
      }
      try {
        const res = await forwardMessage(createMessageItemDto);
        setSended((prev) => [...prev, channelId]);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="icon"
          className="p-2 h-auto hover:bg-[rgba(255,255,255,0.06)]"
        >
          <Forward size={20} color="#ffffffb3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-secondary h-[80vh] flex flex-col rounded-[8px]">
        <DialogTitle className="mb-3">Forward this message</DialogTitle>

        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Add by name or channel"
        />
        {/* Channel list */}
        <div className="overflow-y-auto flex-1">
          {results &&
            results.map((channel) => {
              const isSended = sended.includes(channel._id);
              return (
                <p
                  className="flex items-center gap-3 justify-between my-3"
                  key={channel._id}
                >
                  <span># {channel.name}</span>
                  <Button
                    variant="outline"
                    className="bg-[#007A5A] hover:bg-[#007A5A] hover:opacity-85 text-white h-9"
                    onClick={() => onFowardMessage(channel._id)}
                    disabled={isSended}
                  >
                    {isSended ? "Đã gửi" : "Gửi"}
                  </Button>
                </p>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ForwardButton;
