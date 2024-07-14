interface IProps {
  content: string;
}

function TextMessage({ content }: IProps) {
  return (
    <div>
      <p
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-[15px] text-text-primary"
      ></p>
    </div>
  );
}

export default TextMessage;
