/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { DirectConversation } from "@/types/dc.type";
import useDebounce from "@/app/hooks/useDebounce";
import { useAuth } from "@clerk/nextjs";

interface IProps {
  data: DirectConversation[];
  setResults: (data: DirectConversation[]) => void;
}

export default function DCSearch({ data, setResults }: IProps) {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const debounceValue = useDebounce(query, 500);
  useEffect(() => {
    if (debounceValue) {
      const results = data.filter((dc) => {
        const receiver = dc.membersInfo.find(
          (member) => member.clerkUserId !== auth.userId
        );

        return receiver?.fullName
          .toLowerCase()
          .includes(debounceValue.toLowerCase());
      });
      setResults(results);
    } else {
      setResults(data);
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
