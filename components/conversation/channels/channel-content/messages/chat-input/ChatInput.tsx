"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Footerbar from "./Footerbar";
import Toolbar from "./Toolbar";
import "./styles.scss";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import { common, createLowlight } from "lowlight";

import {
  MessageType,
  SendMessageProps,
  UploadFileProps,
} from "@/app/apis/api-payload";
import { sendMessage, uploadFile } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { pusher } from "@/configs/pusher";
import { cn } from "@/lib/utils";
import { MessageCluster, MessageItemProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-separator";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { startTransition, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PreviewList from "./preview-file/PreviewList";

const lowlight = createLowlight(common);
lowlight.register({ js });
lowlight.register({ css });
lowlight.register({ ts });
lowlight.register({ html });

function ChatInput() {
  const [html, setHtml] = useState<string>("");
  const [onPressEnter, setOnPressEnter] = useState<boolean>(false);
  const {
    channel,
    setIsSendingNewMessage,
    setMessages,
    updateMessageByUniqueId,
    setFiles,
    files,
    clearFiles,
  } = useChannelStore((state) => ({
    channel: state.currentChannel,
    setIsSendingNewMessage: state.setIsSendingNewMessage,
    setMessages: state.setMessages,
    updateMessageByUniqueId: state.updateMessageByUniqueId,
    setFiles: state.setFiles,
    files: state.files,
    clearFiles: state.clearFiles,
  }));
  const { user } = useUser();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-markdown",
          },
          itemTypeName: "listItem",
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-markdown",
          },
          itemTypeName: "listItem",
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Type a message",
      }),
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: "hljs-",
      }),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Enter: () => true,
          };
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "Enter") {
            setOnPressEnter(true);
          }
          return false;
        },
      },
      handlePaste(view, event, slice) {
        const files = event.clipboardData?.files || [];
        for (const file of files) {
          setFiles(file);
        }
        return false;
      },
    },
  });
  const onFocus = () => {
    editor?.chain().focus();
  };
  const setEditorContent = (content: string) => {
    editor?.commands.setContent(content);
  };

  const onSendMessage = () => {
    const createMessageItemDto: SendMessageProps = {
      content: html,
      type: MessageType.TEXT,
      sender: {
        fullName: user?.fullName as string,
        senderId: user?.id as string,
        imageUrl: user?.imageUrl as string,
      },
      uniqueId: "",
      files: [],
      receiverId: channel._id,
      socketId: pusher.connection.socket_id,
    };

    startTransition(async () => {
      try {
        const formData = new FormData();
        const fileFormData = new FormData();
        const uniqueId = uuidv4();
        let uploadRes: any = {
          // Fake upload file successfully
          code: 1,
        };
        const uploadFilePayload: UploadFileProps = {
          senderId: user?.id as string,
          channelId: channel._id,
          workspaceId: channel.workspaceID,
        };
        const clusterId = new Date().toISOString().split("T")[0];
        const fakeMessage: MessageCluster = {
          _id: clusterId,
          messages: [
            {
              _id: "",
              ...createMessageItemDto,
              isSending: true,
              uniqueId,
              filesStatus: files,
            },
          ],
        };
        setMessages(fakeMessage);
        setIsSendingNewMessage(true);
        if (files.length > 0) {
          fileFormData.append("payload", JSON.stringify(uploadFilePayload));
          Array.from(files).forEach((file) =>
            fileFormData.append("files", file)
          );
          clearFiles();
          uploadRes = await uploadFile(fileFormData);
          console.log(uploadRes);
        }

        if (uploadRes?.code === 1) {
          createMessageItemDto.uniqueId = uniqueId;
          createMessageItemDto.files = files.length > 0 ? uploadRes.data : [];
          formData.append("payload", JSON.stringify(createMessageItemDto));
          formData.append("uniqueId", uniqueId);
          const res = await sendMessage(formData);
          // console.log("Message res:", res);
          updateMessageByUniqueId(res, clusterId, true);
          return;
        }
        if (uploadRes?.code === -1) {
          console.log("Upload file error:", uploadRes);
          return;
        }
      } catch (e) {
        console.log(e);
      }
    });
  };
  useEffect(() => {
    if (onPressEnter) {
      onSendMessage();
      setOnPressEnter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPressEnter]);
  return (
    <div
      onClick={onFocus}
      className={cn(
        "border rounded-[8px] p-2 bg-dark-primary cursor-text",
        `${editor?.isFocused ? "border-[#818385]" : "border-border"}`
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="relative p-2 [&_div:first-child]:outline-none text-text-primary max-h-[calc(60vh-80px)] overflow-auto"
        spellCheck={false}
      />
      {files.length > 0 && (
        <>
          <Separator />
          <PreviewList files={files} setFiles={setFiles} />
        </>
      )}
      <Footerbar sendMessage={onSendMessage} />
    </div>
  );
}

export default ChatInput;
