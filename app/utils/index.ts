import { FileExcelIcon } from "@/components/icons/FileExcelIcon";
import { FileIconBackground } from "@/components/icons/FileIconBackground";
import { FileOtherIcon } from "@/components/icons/FileOtherIcon";
import { FilePdfIcon } from "@/components/icons/FilePdfIcon";
import { FilePowerPointIcon } from "@/components/icons/FilePowerPointIcon";
import { FileWordIcon } from "@/components/icons/FileWordIcon";
import { FileZipIcon } from "@/components/icons/FileZipIcon";

export const replace = (array: any[], index: number, element: any) => [
  ...array.slice(0, index),
  element,
  ...array.slice(index + 1),
];

export const detectTypeFileFromUrl = (url: string) => {
  const regex = /(?:\.([^.]+))?$/;
  const matches = regex.exec(url);
  return matches ? matches[1] : "";
};

export const fileIcons = {
  word: FileWordIcon,
  excel: FileExcelIcon,
  pptx: FilePowerPointIcon,
  zip: FileZipIcon,
  csv: FileIconBackground,
  txt: FileIconBackground,
  pdf: FilePdfIcon,
  other: FileOtherIcon,
};

export function getFileExtension(mimeType: string) {
  const mimeTypes = {
    "application/json": "json",
    "application/msword": "doc",
    "application/pdf": "pdf",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/zip": "zip",
  };

  return mimeTypes[mimeType as keyof typeof mimeTypes] || "unknown";
}

export const getIconOfFile = (fileExtension: string) => {
  let typeOfFile = "";
  switch (fileExtension) {
    case "doc":
      typeOfFile = "word";
      break;
    case "docx":
      typeOfFile = "word";
      break;
    case "xls":
      typeOfFile = "excel";
      break;
    case "xlsx":
      typeOfFile = "excel";
      break;
    case "pdf":
      typeOfFile = "pdf";
      break;
    case "zip":
      typeOfFile = "zip";
      break;
    case "rar":
      typeOfFile = "zip";
      break;
    case "csv":
      typeOfFile = "csv";
      break;
    case "txt":
      typeOfFile = "txt";
      break;
    case "pptx":
      typeOfFile = "pptx";
      break;
    default:
      typeOfFile = "other";
      break;
  }
  return fileIcons[typeOfFile as keyof typeof fileIcons] || FileIconBackground;
};

export const detectTypeOfFileFromMimeType = (mimeType: string) => {
  if (mimeType.includes("image")) {
    return "image";
  }
  if (mimeType.includes("audio")) {
    return "audio";
  }
  if (mimeType.includes("video")) {
    return "video";
  }
  return "file";
};

export const formatedMessageTime = (isoString: string) => {
  const date = new Date(isoString);
  // Convert to local time string in the desired format
  const formattedTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formattedTime;
};

export const convertDateToTextName = (date: Date): string => {
  const nameOfWeekday = date.toLocaleString("en-GB", { weekday: "long" });
  const nameOfMonth = date.toLocaleString("en-GB", { month: "long" });
  const day = date.getDate();
  const dayPostfix =
    day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
  return `${nameOfWeekday}, ${nameOfMonth} ${day}${dayPostfix}`;
};
