import React from "react";
import { Editor } from "draft-js";

import "react-sweet-progress/lib/style.css";
import { Link } from "react-router-dom";
import Toolbar from "../ToolBar/ToolBar";
import WordCounter from "../WordCounter/WordCounter";
import "./TextEditor.css";

const getBlockStyle = block => {
  if (block.getType() === "blockquote") return "RichEditor-blockquote";
  return null;
};

const TextEditor = ({
  editMode,
  editorState,
  onSave,
  onClick,
  onChange,
  handleKeyCommand,
  toggleBlockType
}) => {
  return (
    <div className="editorContainer">
      <div className="topButtonsContainer">
        <Link to="/">
          <button className="actionButton" id="backButton">
            Back
          </button>
        </Link>

        <button
          className={
            editMode ? "actionButton toggled" : "actionButton"
          }
          id="editButton"
          onClick={onClick}
        >
          Edit
        </button>
      </div>

      <div>
        <WordCounter
          editorState={editorState}
          editMode={editMode}
        />
      </div>
      <span>
        <Toolbar
          editorState={editorState}
          onToggle={toggleBlockType}
          onClick={onClick}
          editMode={editMode}
        />
      </span>
      <div className="editor">
        <Editor
          blockStyleFn={getBlockStyle}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          readOnly={!editMode}
        />
      </div>
      <button
        className={
          editMode ? "actionButton" : "actionButton invisible"
        }
        onClick={onSave}
      >
        <Link to="/">Save and exit</Link>
      </button>
    </div>
  );
};

export default TextEditor;
