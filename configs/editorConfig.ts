import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight(common);
lowlight.register({ js });
lowlight.register({ css });
lowlight.register({ ts });
lowlight.register({ html });
export const editorConfig = {
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
};
