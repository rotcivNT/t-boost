/* eslint-disable react-hooks/exhaustive-deps */
import { LinkMetadata } from "@/app/apis/api-payload";
import { getLinkMetadata } from "@/app/services/external-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";

interface IProps {
  url: string;
  setLinkMetadata: (metadata: LinkMetadata) => void;
}

function LinkPreview({ url, setLinkMetadata }: IProps) {
  const { data, isLoading } = useSWR(url, getLinkMetadata);
  useEffect(() => {
    if (data) {
      const metadata: LinkMetadata = {
        url: data.url,
        favicon: data.favicon,
        domain: data.domain,
        sitename: data.sitename,
        image: data.images[0],
        description: data.description,
      };
      setLinkMetadata(metadata);
    }
  }, [data]);
  if (isLoading || !data) return null;
  return (
    <div className="relative flex flex-col gap-1 justify-between bg-dark-secondary border border-border p-3 w-[260px] rounded-[4px] *:text-[13px]">
      <p className="flex gap-2 items-center">
        <Image
          src={data.favicon}
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
        <a
          className="hover:underline"
          target="_blank"
          href={`https://${data.domain}`}
        >
          {data.domain}
        </a>
        <Separator className="w-[1px] h-full" />
        <span className="truncate">{data.sitename}</span>
      </p>
      <p className="text-[#1d9bd1] truncate font-[600]">{data.description}</p>
      <Button
        className="bg-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.7)] justify-center items-center size-5 absolute z-[1] -top-2 -right-2 rounded-full overflow-hidden flex"
        size="icon"
        variant="icon"
      >
        <X size={16} color="#000" />
      </Button>
    </div>
  );
}

export default LinkPreview;
