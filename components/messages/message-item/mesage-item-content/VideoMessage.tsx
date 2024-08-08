interface IProps {
  content: string;
}
function VideoMessage({ content }: IProps) {
  return (
    <div className="relative max-w-[420px]">
      <video controls className="max-h-[360px]">
        <source src={content} />
      </video>
    </div>
  );
}

export default VideoMessage;
