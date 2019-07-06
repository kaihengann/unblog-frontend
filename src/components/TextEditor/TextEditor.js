import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentState
} from "draft-js";
import axios from "axios";
import Toolbar from "../ToolBar/ToolBar";
import WordCounter from "../WordCounter/WordCounter";
import "./TextEditor.css";

const getBlockStyle = block => {
  if (block.getType() === "blockquote") return "RichEditor-blockquote";
  return null;
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const content = window.localStorage.getItem("content");
    if (content) {
      this.state.editorState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(content))
      );
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
  }

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);

    // Force first line to be header
    const currentContent = editorState.getCurrentContent();
    const firstBlockKey = currentContent
      .getBlockMap()
      .first()
      .getKey();
    const currentBlockKey = editorState.getSelection().getAnchorKey();
    const isFirstBlock = currentBlockKey === firstBlockKey;
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    const isHeading = currentBlockType === "header-one";
    if (isFirstBlock !== isHeading) {
      const newState = RichUtils.toggleBlockType(editorState, "header-one");
      this.setState({
        editorState: newState
      });
    } else {
      this.setState({
        editorState
      });
    }
  };

  saveContent = content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  };

  onSave = async () => {
    const data = window.localStorage.getItem("content");
    const contentState = this.state.editorState.getCurrentContent();
    // Remove
    if (data) {
      const title = contentState.getFirstBlock().getText();
      console.log(title);
      let body = contentState.getBlocksAsArray();
      body.shift();
      const newContentState = ContentState.createFromBlockArray(body);
      const rawBody = JSON.stringify(convertToRaw(newContentState));
      const processedBody = convertFromRaw(JSON.parse(rawBody));
      this.setState({
        editorState: EditorState.createWithContent(processedBody)
      });
    }
  };

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  toggleBlockType = blockType => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };
  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );
  };

  render() {
    return (
      <div className="editorContainer">
        <div>
          <WordCounter editorState={this.state.editorState} />
        </div>
        <button onClick={this.onBoldClick}>
          <b>B</b>
        </button>
        <button onClick={this.onItalicClick}>
          <em>I</em>
        </button>
        <button onClick={this.onUnderlineClick}>U</button>
        <span>
          <Toolbar
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
          />
        </span>
        <div className="editors">
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
          />
        </div>
        <button className="actionButton">Back</button>
        <button className="actionButton" onClick={this.onSave}>
          Save
        </button>
      </div>
    );
  }
}

export default TextEditor;
