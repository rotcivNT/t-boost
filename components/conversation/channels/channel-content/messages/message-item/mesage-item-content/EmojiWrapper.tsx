import { Emoji } from "emoji-picker-react";
interface IProps {
  unified: string;
  count: number;
}
function EmojiWrapper({ unified, count }: IProps) {
  return (
    <div className="bg-[#004D76] py-1 px-2 rounded-[16px] inline-flex items-center gap-1 cursor-pointer">
      <Emoji unified={unified} size={16} />
      <span className="text-xs text-text-primary font-[500]">{count}</span>
    </div>
  );
}

export default EmojiWrapper;
