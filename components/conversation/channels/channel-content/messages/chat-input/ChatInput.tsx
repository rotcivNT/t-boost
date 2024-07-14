/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import Footerbar from "./Footerbar";
import Toolbar from "./Toolbar";
import "./styles.scss";

import {
  LinkMetadata,
  MessageType,
  SendMessageProps,
  UpdateMessageProps,
  UploadFileProps,
} from "@/app/apis/api-payload";
import { sendMessage, updateMessage, uploadFile } from "@/app/services/action";
import { useChannelStore } from "@/app/store/channel.store";
import { editorConfig } from "@/configs/editorConfig";
import { pusher } from "@/configs/pusher";
import { cn } from "@/lib/utils";
import { ActionType, MessageCluster, MessageItemProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-separator";
import { X } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PreviewList from "./preview-file/PreviewList";
import MessageReply from "../message-item/mesage-item-content/MessageReply";
import LinkPreview from "./link-preview/LinkPreview";
import { extractUrls } from "@/app/utils/previewLink";

function ChatInput() {
  const [onPressEnter, setOnPressEnter] = useState<boolean>(false);
  const [contentLink, setContentLink] = useState<string>("");
  const [linkMetadata, setLinkMetadata] = useState<LinkMetadata | null>(null);
  const {
    channel,
    setIsSendingNewMessage,
    setMessages,
    updateMessageByUniqueId,
    setFiles,
    files,
    clearFiles,
    actionMessage,
    setActionMessage,
    updateMessageLocal,
  } = useChannelStore((state) => ({
    channel: state.currentChannel,
    setIsSendingNewMessage: state.setIsSendingNewMessage,
    setMessages: state.setMessages,
    updateMessageByUniqueId: state.updateMessageByUniqueId,
    setFiles: state.setFiles,
    files: state.files,
    clearFiles: state.clearFiles,
    actionMessage: state.actionMessage,
    setActionMessage: state.setActionMessage,
    updateMessageLocal: state.updateMessage,
  }));
  const { user } = useUser();
  const editor = useEditor({
    ...editorConfig,
    onUpdate: ({ editor }) => {
      const urlExacted = extractUrls(editor.getText());

      if (urlExacted && urlExacted?.length > 0) {
        setContentLink(urlExacted[0]);
      } else {
        setContentLink("");
        setLinkMetadata(null);
      }
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "Enter") {
            setContentLink("");
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
    setContentLink(content);
  };

  const onCloseEdit = () => {
    setActionMessage(null);
    setEditorContent("");
  };

  const createMessage = async (
    createMessageItemDto: SendMessageProps,
    replyFor?: string
  ) => {
    const clusterId = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    const fileFormData = new FormData();
    let uploadRes: any = {
      // Fake upload file successfully
      code: 1,
    };
    const uploadFilePayload: UploadFileProps = {
      senderId: user?.id as string,
      channelId: channel._id,
      workspaceId: channel.workspaceID,
    };
    if (replyFor) {
      createMessageItemDto.replyFor = replyFor;
    }
    if (files.length > 0) {
      fileFormData.append("payload", JSON.stringify(uploadFilePayload));
      Array.from(files).forEach((file) => fileFormData.append("files", file));
      clearFiles();

      uploadRes = await uploadFile(fileFormData);
      console.log(uploadRes);
    }

    if (uploadRes?.code === 1) {
      createMessageItemDto.files = files.length > 0 ? uploadRes.data : [];
      formData.append("payload", JSON.stringify(createMessageItemDto));

      formData.append("uniqueId", createMessageItemDto.uniqueId);
      const res = await sendMessage(formData);
      if (actionMessage) {
        res.replyMessage = [actionMessage.message];
      }
      updateMessageByUniqueId(res, clusterId, true);
      return;
    }
    if (uploadRes?.code === -1) {
      console.log("Upload file error:", uploadRes);
      return;
    }
  };

  const onUpdateMessage = async () => {
    const msgId = actionMessage?.message._id as string;
    const clusterId = actionMessage?.message.createdAt?.split("T")[0];
    const html = editor?.getHTML() as string;
    const updatedPayload: UpdateMessageProps = {
      channelId: channel._id,
      socketId: pusher.connection.socket_id,
      _id: msgId,
      content: html,
      sender: actionMessage?.message.sender,
    };
    updateMessageLocal(msgId, clusterId as string, "content", html);
    updateMessageLocal(msgId, clusterId as string, "isSending", true);
    const res = await updateMessage(updatedPayload);
    if (res?._id) {
      updateMessageByUniqueId(res, clusterId as string, true);
    }
  };

  const onSendMessage = () => {
    startTransition(async () => {
      const html = editor?.getHTML() as string;
      const uniqueId = uuidv4();
      const createMessageItemDto: SendMessageProps = {
        content: linkMetadata ? html.replace(/<[^>]+>/g, "") : html,
        type: linkMetadata ? MessageType.LINK : MessageType.TEXT,
        senderId: user?.id as string,
        uniqueId: uniqueId,
        files: [],
        receiverId: channel._id,
        socketId: pusher.connection.socket_id,
        sender: {
          clerkUserId: user?.id as string,
          fullName: user?.fullName as string,
          imageUrl: user?.imageUrl as string,
        },
      };
      if (linkMetadata) {
        createMessageItemDto.metadata = linkMetadata;
      }
      const clusterId = new Date().toISOString().split("T")[0];
      const fakeMessage: MessageCluster = {
        _id: clusterId,
        messages: [
          {
            _id: "",
            ...createMessageItemDto,
            isSending: true,
            filesStatus: files,
            replyMessage: [],
          },
        ],
      };
      if (ActionType.REPLY && actionMessage) {
        fakeMessage.messages[0].replyMessage = [actionMessage.message];
      }

      if (files.length === 0 && !editor?.getText()) {
        return;
      }

      setEditorContent("");
      setMessages(fakeMessage);
      setIsSendingNewMessage(true);
      setLinkMetadata(null);
      try {
        if (!actionMessage) {
          await createMessage(createMessageItemDto);
          return;
        }
        onCloseEdit();
        switch (actionMessage.type) {
          case ActionType.REPLY:
            await createMessage(
              createMessageItemDto,
              actionMessage.message._id
            );
            break;
          case ActionType.EDIT:
            await onUpdateMessage();
            break;
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
  }, [onPressEnter]);
  useEffect(() => {
    if (actionMessage) {
      setEditorContent(actionMessage.message.content);
      onFocus();
    }
  }, [actionMessage]);
  return (
    <div
      onClick={onFocus}
      className={cn(
        "border rounded-[8px] p-2 bg-dark-primary cursor-text",
        `${editor?.isFocused ? "border-[#bcd5ee]" : "border-border"}`
      )}
    >
      {actionMessage?.type === ActionType.EDIT && (
        <p className="flex justify-between items-center px-2 pb-2 cursor-default border-b border-border">
          <span className="text-[15px] text-text-primary italic">
            Chỉnh sửa tin nhắn
          </span>
          <X size={18} className="cursor-pointer" onClick={onCloseEdit} />
        </p>
      )}
      {actionMessage?.type === ActionType.REPLY && (
        <div className="relative">
          <MessageReply
            replyMessage={actionMessage?.message as MessageItemProps}
            className="w-full cursor-default"
          />
          <X
            size={18}
            className="cursor-pointer absolute top-3 right-2 hover:opacity-80"
            onClick={onCloseEdit}
          />
        </div>
      )}
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="relative p-2 [&_div:first-child]:outline-none text-text-primary max-h-[calc(60vh-80px)] overflow-auto"
        spellCheck={false}
      />
      <div
        className={cn(
          "flex gap-3",
          `${linkMetadata || files.length > 0 ? "py-[10px] px-3 " : ""}`
        )}
      >
        {contentLink !== "" && (
          <LinkPreview setLinkMetadata={setLinkMetadata} url={contentLink} />
        )}
        {files.length > 0 && <PreviewList files={files} setFiles={setFiles} />}
      </div>
      <Footerbar sendMessage={onSendMessage} />
    </div>
  );
}

export default ChatInput;
