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
import { UpdateDCPayload } from "@/app/apis/api-payload/conversation.payload";
import { addMessage } from "@/app/helpers/addMessage";
import {
  updateMessageByUniqueId,
  updatePartialMessageById,
} from "@/app/helpers/updateMessage";
import { sendMessage, uploadFile } from "@/app/services/action";
import { updateMessage } from "@/app/services/message.action";
import { ApiStatus } from "@/app/utils/api.response";
import { extractUrls } from "@/app/utils/previewLink";
import { editorConfig } from "@/configs/editorConfig";
import { pusher } from "@/configs/pusher";
import { cn } from "@/lib/utils";
import { ActionType, MessageCluster, MessageItemProps } from "@/types";
import { ChatInputProps } from "@/types/chat-input.type";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MessageReply from "../message-item/mesage-item-content/MessageReply";
import LinkPreview from "./link-preview/LinkPreview";
import PreviewList from "./preview-file/PreviewList";
import { updateDC } from "@/app/services/channel.action";
import { mutate } from "swr";

function ChatInput({ store, type, conversationId }: ChatInputProps) {
  const [onPressEnter, setOnPressEnter] = useState<boolean>(false);
  const [contentLink, setContentLink] = useState<string>("");
  const [linkMetadata, setLinkMetadata] = useState<LinkMetadata | null>(null);
  const { workspaceId } = useParams();
  const {
    setFiles,
    files,
    clearFiles,
    actionMessage,
    setActionMessage,
    allMessages: messages,
    setAllMessages,
  } = store;
  const { user } = useUser();
  const editor = useEditor({
    ...editorConfig,
    onUpdate: ({ editor }) => {
      const urlExtracted = extractUrls(editor.getText());

      if (urlExtracted && urlExtracted?.length > 0) {
        setContentLink(urlExtracted[0]);
      } else {
        setContentLink("");
        setLinkMetadata(null);
      }
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (_, event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            setContentLink("");
            setOnPressEnter(true);
          }
          return false;
        },
      },
      handlePaste(_, event) {
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
    const formData = new FormData();
    const fileFormData = new FormData();
    let uploadRes: any = {
      // Fake upload file successfully
      code: 1,
    };
    const uploadFilePayload: UploadFileProps = {
      senderId: user?.id as string,
      channelId: conversationId,
      workspaceId: workspaceId as string,
    };
    if (replyFor) {
      createMessageItemDto.replyFor = replyFor;
    }
    if (files.length > 0) {
      fileFormData.append("payload", JSON.stringify(uploadFilePayload));
      Array.from(files).forEach((file) => fileFormData.append("files", file));
      clearFiles();
      uploadRes = await uploadFile(fileFormData);
      // console.log(uploadRes);
    }

    if (uploadRes?.code === 1) {
      createMessageItemDto.files = files.length > 0 ? uploadRes.data : [];
      formData.append("payload", JSON.stringify(createMessageItemDto));

      formData.append("uniqueId", createMessageItemDto.uniqueId);
      const UpdateDCPayload: UpdateDCPayload = {
        dcId: conversationId,
        lastMessage: {
          content: createMessageItemDto.content,
          createdAt: new Date().toISOString(),
          senderId: user?.id as string,
          type:
            createMessageItemDto.files && createMessageItemDto.files.length > 0
              ? MessageType.FILE
              : MessageType.TEXT,
        },
      };
      try {
        const [updateDCRes, res] = await Promise.all([
          updateDC(UpdateDCPayload),
          sendMessage(formData),
        ]);

        if (res && res.status === ApiStatus.OK) {
          if (actionMessage) {
            res.data.replyMessage = [actionMessage.message];
          }
          return res.data;
        }
      } catch (error) {
        console.error("Error in updateDC or sendMessage:", error);
        // Handle error appropriately
      }
    }
    if (uploadRes?.code === -1) {
      console.log("Upload file error:", uploadRes);
      return;
    }
  };

  const onUpdateMessage = async (content: string) => {
    const msgId = actionMessage?.message._id as string;
    const updatedPayload: UpdateMessageProps = {
      channelId: conversationId,
      socketId: pusher.connection.socket_id,
      _id: msgId,
      content,
      sender: actionMessage?.message.sender,
    };
    const res = await updateMessage(updatedPayload);
    return res;
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
        receiverId: conversationId,
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
      if (actionMessage && ActionType.REPLY === actionMessage.type) {
        fakeMessage.messages[0].replyMessage = [actionMessage.message];
      }

      if (files.length === 0 && !editor?.getText()) {
        return;
      }

      setEditorContent("");
      setLinkMetadata(null);
      try {
        const optimisticData =
          actionMessage && actionMessage.type === ActionType.EDIT
            ? updatePartialMessageById({
                clusterId: clusterId,
                key: "content",
                messageId: actionMessage.message._id,
                messagesList: messages as Map<string, MessageCluster>,
                value: html,
              })
            : addMessage({
                message: fakeMessage.messages[0],
                clusterId: clusterId,
                messagesList: messages as Map<string, MessageCluster>,
              });
        setAllMessages(optimisticData);
        if (!actionMessage) {
          const res = await createMessage(createMessageItemDto);
          if (res) {
            const newCluster = updateMessageByUniqueId({
              updateSending: true,
              message: res,
              clusterId: clusterId,
              messagesList: messages,
            });
            setAllMessages(newCluster);
          }
          return;
        }
        onCloseEdit();

        switch (actionMessage.type) {
          case ActionType.REPLY:
            const resReply = await createMessage(
              createMessageItemDto,
              actionMessage.message._id
            );
            if (resReply) {
              const newCluster = updateMessageByUniqueId({
                updateSending: true,
                message: resReply,
                clusterId: clusterId,
                messagesList: messages,
              });
              setAllMessages(newCluster);
            }
            break;
          case ActionType.EDIT:
            const resEdit = await onUpdateMessage(html);
            if (resEdit) {
              const newCluster = updateMessageByUniqueId({
                updateSending: true,
                message: resEdit,
                clusterId: clusterId,
                messagesList: messages,
              });
              setAllMessages(newCluster);
            }
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
        {files.length > 0 && <PreviewList files={files} />}
      </div>
      <Footerbar sendMessage={onSendMessage} />
    </div>
  );
}

export default ChatInput;
