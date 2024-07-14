import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IProps {
  isFolder: boolean;
}

function DeleteBookmarkContent({ isFolder }: IProps) {
  let type = isFolder ? "folder" : "bookmark";

  return (
    <>
      <DialogHeader className="text-left text-[20px] font-bold text-text-primary">
        <DialogTitle>Delete {type}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-text-primary text-[15px] mb-5">
        Are you sure you want to delete this {type}? This cannot be undone.
      </DialogDescription>
    </>
  );
}

export default DeleteBookmarkContent;
