/* eslint-disable react-hooks/exhaustive-deps */
import { ChannelProps } from "@/types";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import useDebounce from "@/app/hooks/useDebounce";

interface IProps {
  channels: ChannelProps[];
  setChannels: (channels: ChannelProps[]) => void;
}

export default function ChannelTaskListSearch({
  channels,
  setChannels,
}: IProps) {
  const [query, setQuery] = useState("");
  const debounceValue = useDebounce(query, 500);
  useEffect(() => {
    if (debounceValue) {
      const filteredChannels = channels.filter((channel) =>
        channel.name.toLowerCase().includes(debounceValue.toLowerCase())
      );
      setChannels(filteredChannels);
      return;
    }

    if (query === "") {
      setChannels(channels);
      return;
    }
  }, [debounceValue]);
  return (
    <div className="my-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for channels"
      />
    </div>
  );
}
