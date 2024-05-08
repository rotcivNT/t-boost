import Image from "next/image";
import SearchInput from "./SearchInput";
import HelpButton from "./HelpButton";

function Header() {
  return (
    <div className="flex h-header-height items-center justify-between px-4">
      <div className="flex-1">
        <Image alt="Logo" src="/next.svg" width={150} height={28} />
      </div>
      <div className="flex-[2]">
        <SearchInput />
      </div>
      <div className="flex-1 flex justify-end">
        <HelpButton />
      </div>
    </div>
  );
}

export default Header;
