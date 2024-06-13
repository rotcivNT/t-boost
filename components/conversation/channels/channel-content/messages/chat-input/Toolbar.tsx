import {
  Bold,
  Code,
  FileCode2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Editor } from "@tiptap/react";

interface IProps {
  editor: Editor | null;
}

const toolbarMark = {
  bold: {
    title: "Bold",
    icon: <Bold className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
  italic: {
    title: "Italic",
    icon: <Italic className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
  strike: {
    title: "Strike through",
    icon: <Strikethrough className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
};

const toolbarList = {
  orderedList: {
    title: "List Ordered",
    icon: <ListOrdered className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
  bulletList: {
    title: "List",
    icon: <List className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
};

const toolbarCode = {
  code: {
    title: "Code",
    icon: <Code className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
  codeBlock: {
    title: "Code block",
    icon: <FileCode2 className="h-4 w-4 text-inherit" strokeWidth={2.5} />,
  },
};

function Toolbar({ editor }: IProps) {
  const toogleItemStyles = cn(
    "hover:bg-[rgba(255,255,255,0.06)] h-auto p-2 data-[state=on]:bg-[rgba(255,255,255,0.1)]",
    "text-[#9D9E9F] [&_svg]:hover:text-text-primary data-[state=on]:text-text-primary"
  );
  const onToggleMark = (type: string) => {
    editor?.chain().focus().toggleMark(type).run();
  };

  const onToggleList = (type: string) => {
    editor?.chain().focus().toggleList(type, "listItem").run();
  };

  const onToggleCode = (type: string) => {
    if (type === "code") {
      editor?.chain().focus().toggleMark(type).run();
    } else {
      editor?.chain().focus().toggleCodeBlock().run();
    }
  };

  return (
    <ToggleGroup type="multiple" className="justify-start">
      {Object.entries(toolbarMark).map(([key, value]) => {
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger>
                <ToggleGroupItem
                  data-state={editor?.isActive(key) ? "on" : "off"}
                  key={key}
                  value={key}
                  className={toogleItemStyles}
                  onClick={() => onToggleMark(key)}
                >
                  {value.icon}
                </ToggleGroupItem>
                <TooltipContent>
                  <p>{value.title}</p>
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      <Separator className="h-[26px] w-[2px]" orientation="vertical" />
      {Object.entries(toolbarList).map(([key, value]) => {
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger>
                <ToggleGroupItem
                  data-state={editor?.isActive(key) ? "on" : "off"}
                  key={key}
                  value={key}
                  className={toogleItemStyles}
                  onClick={() => onToggleList(key)}
                >
                  {value.icon}
                </ToggleGroupItem>
                <TooltipContent>
                  <p>{value.title}</p>
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      <Separator className="h-[26px] w-[2px]" orientation="vertical" />
      {Object.entries(toolbarCode).map(([key, value]) => {
        return (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger>
                <ToggleGroupItem
                  data-state={editor?.isActive(key) ? "on" : "off"}
                  key={key}
                  value={key}
                  className={toogleItemStyles}
                  onClick={() => onToggleCode(key)}
                >
                  {value.icon}
                </ToggleGroupItem>
                <TooltipContent>
                  <p>{value.title}</p>
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </ToggleGroup>
  );
}

export default Toolbar;
