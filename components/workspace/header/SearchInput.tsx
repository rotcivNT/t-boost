"use client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
function SearchInput() {
  const [showCommandList, setShowCommandList] = useState(false);
  return (
    <Command className="bg-[rgba(248,248,248,0.25)] relative overflow-visible">
      <CommandInput
        onClick={() => setShowCommandList(true)}
        onBlur={() => setShowCommandList(false)}
        placeholder="Type a command or search..."
        className="h-7 text-white placeholder:text-[#F8F8F8] text-[13px]"
      />
      <CommandList
        hidden={!showCommandList}
        className="absolute left-0 top-7 z-50 bg-white w-full"
      >
        <CommandEmpty>No results found.</CommandEmpty>
        {/* <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup> */}
      </CommandList>
    </Command>
  );
}

export default SearchInput;
