import { cn } from "@/lib/utils";
import { EditorContent } from "@tiptap/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface IProps {
  content: string;
}

const LinkMessage = () => {
  const [percentPaddingTop, setPercentPaddingTop] = useState(0);
  return (
    <div>
      <Link
        href="https://play.tailwindcss.com/LdhEnhGRD9?file=config"
        className="text-[15px] text-[#1D9BD1] hover:underline hover:text-[#40B3E4]"
        target="_blank"
      >
        https://play.tailwindcss.com/LdhEnhGRD9?file=config
      </Link>
      <div className="mt-1">
        <div className="flex items-center gap-2">
          <Image
            alt=""
            src="https://play.tailwindcss.com/social-square.jpg"
            width={16}
            height={16}
            className="rounded-[2px]"
          />
          <p className="text-[15px] text-text-primary font-bold">
            Tailwind Play
          </p>
        </div>
        <Link
          href="https://play.tailwindcss.com/LdhEnhGRD9?file=config"
          className="text-[15px] text-[#1D9BD1] font-[600] hover:underline hover:text-[#40B3E4]"
          target="_blank"
        >
          Zalo - Đăng nhập Zalo
        </Link>
        <p className="text-sm text-text-primary line-clamp-2 h-[40px]">
          Đăng nhập Zalo Web để chat ngay trên máy tính. Zalo Web gửi hình,
          video cực nhanh lên đến 1GB, phân loại khách hàng, quản lý nhóm tiện
          lợi.
        </p>
        <div className={cn("relative w-[360px] mt-2")}>
          <div style={{ paddingTop: `${percentPaddingTop}%` }}>
            <Image
              unoptimized={false}
              src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
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
      </div>
    </div>
  );
};

function TextMessage({ content }: IProps) {
  return (
    <div>
      <p
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-[15px] text-text-primary"
      ></p>
      {/* <LinkMessage /> */}
    </div>
  );
}

export default TextMessage;
