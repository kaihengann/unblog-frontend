import React from "react";
import StyleButton from "../StyleButton/StyleButton";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" }
];

const ToolBar = ({ editorState, onToggle, onClick }) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  // const inlineType = editorState
  //   .getCurrentInlineStyle()
  // console.log(inlineType.getType());
  
  return (
    <div className="toolBar">
      <button id="boldButton" onMouseDown={onClick}>
        <b>B</b>
      </button>
      <button id="italicButton" onMouseDown={onClick}>
        <em>I</em>
      </button>
      <button id="underlineButton" onMouseDown={onClick}>U</button>
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
