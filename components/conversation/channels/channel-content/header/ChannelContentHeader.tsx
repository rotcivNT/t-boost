import ChannelButton from "./channel-button/ChannelButton";
import HuddleButton from "./HuddleButton";
import MemberButton from "./MemberButton";
import BookmarkWrapper from "./bookmark/BookmarkWrapper";

function ChannelContentHeader() {
  return (
    <div>
      <div className="h-[50px] pl-5 pr-3 flex items-center justify-between">
        <ChannelButton />
        <div className="flex items-center gap-3">
          <MemberButton />
          <HuddleButton />
        </div>
      </div>
      <div className="pl-5 pr-3 h-9 flex items-center">
        <BookmarkWrapper />
      </div>
    </div>
  );
}

export default ChannelContentHeader;
