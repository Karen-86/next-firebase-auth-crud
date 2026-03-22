"use client";

import { useState, useEffect, useRef } from "react";
import { SerializedEditorState } from "lexical";
import { Label } from "@/components/ui/label";

import { Editor } from "@/components/blocks/editor-x/editor";

// extra added
import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

import { nodes } from "@/components/blocks/editor-x/nodes";

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function RichTextEditorDemo({ className = "", label = "", state = {}, setState = () => {} }: any) {
  const [editorState, setEditorState] = useState<SerializedEditorState>(state.editorState);
  const getFormattedContent = (value:any) => {
    if (!value) return;

    // Create a temporary Lexical editor instance to parse the saved state
    const tempEditor = createEditor({
      nodes: nodes,
    });

    // Parse and set the serialized state
    const parsed = tempEditor.parseEditorState(value);
    tempEditor.setEditorState(parsed);

    // --- Generate outputs ---
    let html = "";
    let markdown = "";
    const json = JSON.stringify(value);

    tempEditor.update(() => {
      html = $generateHtmlFromNodes(tempEditor);
      markdown = $convertToMarkdownString(TRANSFORMERS);
    });

    // console.log("🧾 HTML:", html);
    // console.log("🪶 Markdown:", markdown);
    // console.log("🧠 JSON:", json);
    let cleaned = html.replace(/ style="[^"]*"/g, "");
    cleaned = cleaned
      // Paragraphs
      .replace(/<p>/g, '<p class="leading-7 not-first:mt-6">')

      // Headings
      .replace(/<h1>/g, '<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">')
      .replace(/<h2>/g, '<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">')
      .replace(/<h3>/g, '<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">')
      .replace(/<h4>/g, '<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">')
      .replace(/<h5>/g, '<h5 class="scroll-m-20 text-lg font-semibold tracking-tight">')
      .replace(/<h6>/g, '<h6 class="scroll-m-20 text-base font-semibold tracking-tight">')

      // Blockquote / quote
      .replace(/<blockquote>/g, '<blockquote class="mt-6 border-l-2 pl-6 italic">')

      // Lists
      .replace(/<ul>/g, '<ul class="m-0 p-0 list-disc list-inside [&>li]:mt-2">')
      .replace(/<ol>/g, '<ol class="m-0 p-0 list-decimal list-inside [&>li]:mt-2">')
      .replace(/<li>/g, '<li class="ml-6 [&>ul]:ml-6 [&>ol]:ml-6">')

      // Inline formatting
      .replace(/<strong>/g, '<strong class="font-bold">')
      .replace(/<b>/g, '<b class="font-bold">')
      .replace(/<em>/g, '<em class="italic">')
      .replace(/<i>/g, '<i class="italic">')
      .replace(/<code>/g, '<code class="bg-gray-100 p-1 rounded-md">')
      .replace(/<s>/g, '<s class="line-through">')
      .replace(/<strike>/g, '<strike class="line-through">')
      .replace(/<u>/g, '<u class="underline">')
      .replace(/<sub>/g, '<sub class="sub">')
      .replace(/<sup>/g, '<sup class="sup">')

      // Links
      .replace(/<a /g, '<a class="text-blue-600 hover:underline hover:cursor-pointer" ')

      // Images
      .replace(/<img /g, '<img class="relative inline-block user-select-none cursor-default" ')

      // Tables
      .replace(/<table>/g, '<table class="EditorTheme__table w-fit overflow-scroll border-collapse">')
      .replace(/<thead>/g, "<thead>")
      .replace(/<tbody>/g, "<tbody>")
      .replace(/<tr>/g, "<tr>")
      .replace(/<th>/g, '<th class="EditorTheme__tableCellHeader border px-4 py-2">')
      .replace(/<td>/g, '<td class="EditorTheme__tableCell border px-4 py-2">');

    return { html: cleaned, markdown, json };

    // You can now send { html, markdown, json } to your database
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`grid items-center gap-1.5 relative ${className}`}
    >
      {label && <Label className="w-fit text-sm font-medium">{label}</Label>}
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => {
          setEditorState(value);
          const formattedContent = getFormattedContent(value);
          if (!formattedContent) return;
          setState((prev: any) => ({
            ...prev,
            content: formattedContent.html,
            editorState: value,
          }));
        }}
      />
    </div>
  );
}
