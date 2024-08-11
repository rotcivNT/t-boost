import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChannelProps } from "@/types";
import DialogContentTab from "./DialogContentTab";
import styles from "./styles.module.scss";

interface IProps {
  channel: ChannelProps;
  title: string;
  subTitle?: string;
  className?: string;
  editable?: boolean;
  onClick?: () => void;
}

function ContentButton({
  channel,
  title,
  subTitle,
  className,
  editable = true,
  onClick,
}: IProps) {
  const staticData: any = {
    ["channel name"]: {
      title: "Rename this channel",
      label: "Name",
      desc: "Names must be lowercase, without spaces or periods, and can’t be longer than 80 characters.",
      defaultValue: channel.name,
    },
    topic: {
      title: "Edit topic",
      label: "Topic",
      desc: "Let people know what #dev-tboost is focused on right now (ex. a project milestone). Topics are always visible in the header.",

      defaultValue: channel.topic,
    },
    description: {
      title: "Edit description",
      label: "Description",
      desc: "Let people know what this channel is for.",
      defaultValue: channel.description,
    },
  };
  return (
    <div
      className={cn(
        "rounded-[8px] bg-dark-secondary border border-border text-text-primary overflow-hidden",
        styles["content-button-trigger"],
        className
      )}
      onClick={onClick}
    >
      <Dialog>
        <div
          className={cn(
            "flex justify-between items-start px-5 py-4 ",
            "hover:bg-dark-primary text-inherit"
          )}
        >
          <div className="text-inherit">
            <p className="text-[15px] text-left font-[600]">{title}</p>
            <p className="text-sm text-text-secondary text-left">{subTitle}</p>
          </div>

          {editable && (
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#1D9BD1] text-[13px] p-0">
                Edit
              </Button>
            </DialogTrigger>
          )}
        </div>
        {editable && (
          <DialogContent className="bg-dark-secondary border-border rounded-[8px] overflow-hidden">
            <DialogContentTab
              title={staticData[title.toLocaleLowerCase()]?.title}
              label={staticData[title.toLocaleLowerCase()]?.label}
              defaultValue={staticData[title.toLocaleLowerCase()]?.defaultValue}
              description={staticData[title.toLocaleLowerCase()]?.desc}
              channelId={channel._id}
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

export default ContentButton;
