import { UserButton } from "@clerk/nextjs";
import CreateButton from "./CreateButton";
import { dark } from "@clerk/themes";

function SidebarFooter() {
  return (
    <div className="pb-6 flex flex-col gap-4 items-center">
      <CreateButton />
      <div className="size-[26px] lg:size-9 [&_div]:!size-full [&_button]:!size-full">
        <UserButton
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </div>
  );
}

export default SidebarFooter;
