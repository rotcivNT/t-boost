import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface IProps {
  uri: string;
}

function DocViewerWrapper({ uri }: IProps) {
  const docs = [
    { uri }, // Remote file
  ];
  return (
    <div className="relative z-[8] h-full">
      <DocViewer
        documents={docs}
        prefetchMethod="GET"
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
}

export default DocViewerWrapper;
