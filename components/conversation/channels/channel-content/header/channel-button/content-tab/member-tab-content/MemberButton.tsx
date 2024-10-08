import { RemoveUserProps } from "@/app/apis/api-payload";
import { removeMember } from "@/app/services/channel.action";
import { useChannelStore } from "@/app/store/channel.store";
import { ApiStatus } from "@/app/utils/api.response";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

interface IProps {
  leftIcon?: any;
  rightIcon?: any;
  name: string;
  userId?: string;
  creatorId?: string;
  channelId?: string;
}

export const MemberButtonLoading = () => {
  return (
    <div className="flex items-center gap-3 py-3 hover:bg-dark-primary px-7 cursor-pointer">
      <div className="size-9 flex justify-center items-center rounded-[4px] bg-[#1d9bd11a] animate-pulse"></div>
      <div className="w-full h-5 bg-dark-primary rounded-full animate-pulse"></div>
    </div>
  );
};

function MemberButton({
  leftIcon,
  rightIcon,
  name,
  userId,
  channelId,
  creatorId,
}: IProps) {
  const { user } = useUser();
  const setPartialDataChannel = useChannelStore(
    (state) => state.setPartialDataChannel
  );
  const onRemoveUser = async () => {
    const payload: RemoveUserProps = {
      channelId: channelId as string,
      senderId: user?.id as string,
      deleteId: userId as string,
    };
    try {
      const res = await removeMember(payload);
      if (res?.status === ApiStatus.OK) {
        setPartialDataChannel({ members: res.data.members });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-between items-center hover:bg-dark-primary px-7 cursor-pointer py-3">
      <div className="flex items-center gap-3">
        <div className="size-9 flex justify-center items-center rounded-[4px] bg-[#1d9bd11a]">
          {leftIcon}
        </div>
        <p className="text-[15px] text-text-primary">{`${name} ${
          user?.id === userId ? "(you)" : ""
        }`}</p>
        {rightIcon}
      </div>
      {userId && user?.id !== userId && user?.id === creatorId && (
        <Button
          onClick={onRemoveUser}
          className="text-[#1D9BD1]"
          variant="link"
        >
          Remove
        </Button>
      )}
    </div>
  );
}

export default MemberButton;
