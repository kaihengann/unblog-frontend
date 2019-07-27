import React from "react";
import StyleButton from "../StyleButton/StyleButton";
import "./ToolBar.css";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" }
];

const ToolBar = ({ editorState, editMode, onToggle, onBoldClick, onItalicClick, onUnderlineClick }) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className={editMode ? "toolBar" : "toolBar invisible"}>
      <button id="boldButton" onMouseDown={onBoldClick}>
        <b>B</b>
      </button>
      <button id="italicButton" onMouseDown={onItalicClick}>
        <em>I</em>
      </button>
      <button id="underlineButton" onMouseDown={onUnderlineClick}>
        U
      </button>
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default ToolBar;
