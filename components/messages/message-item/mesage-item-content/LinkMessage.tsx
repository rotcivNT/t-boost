import { LinkMetadata } from "@/app/apis/api-payload";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface IProps {
  metadata: LinkMetadata | undefined;
  content: string;
}

function extractTextAndUrls(content: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  let url = content.match(urlPattern);
  let text = content.split(url?.toString() || "");
  return { text, url };
}

export const LinkMessage = ({ metadata, content }: IProps) => {
  const [percentPaddingTop, setPercentPaddingTop] = useState(0);
  const { text, url } = extractTextAndUrls(content);
  if (!metadata) return null;
  return (
    <div>
      <span className="text-[15px] text-text-primary">{text}</span>
      <Link
        href={metadata.url}
        className="text-[15px] text-[#1D9BD1] hover:underline hover:text-[#40B3E4]"
        target="_blank"
      >
        {url}
      </Link>
      <div className="mt-1">
        <div className="flex items-center gap-2">
          {metadata.favicon ? (
            <Image
              alt=""
              src={metadata.favicon}
              width={16}
              height={16}
              className="rounded-[2px]"
            />
          ) : (
            ""
          )}
          <p className="text-[15px] text-text-primary font-bold">
            {metadata.sitename}
          </p>
        </div>
        <Link
          href={`https://${metadata.domain}`}
          className="text-[15px] text-[#1D9BD1] font-[600] hover:underline hover:text-[#40B3E4]"
          target="_blank"
        >
          {metadata.domain}
        </Link>
        <p className="text-sm text-text-primary line-clamp-2 h-[40px]">
          {metadata.description}
        </p>
        {metadata.image && (
          <div className={cn("relative w-[360px] mt-2")}>
            <div style={{ paddingTop: `${percentPaddingTop}%` }}>
              <Image
                unoptimized={false}
                src={metadata.image}
                alt=""
                fill
                className="object-contain rounded-[8px]"
                onLoad={(e) => {
                  setPercentPaddingTop(
                    +Number(
                      (e.currentTarget.naturalHeight /
                        e.currentTarget.naturalWidth) *
                        100
                    ).toFixed(2)
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
