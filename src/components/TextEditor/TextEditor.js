import 'draft-js/dist/Draft.css'
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
import { Link } from "react-router-dom";
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
  
  saveContent = content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  };

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);

    // Force first line to be header
    // const currentContent = editorState.getCurrentContent();
    // const firstBlockKey = currentContent
    //   .getBlockMap()
    //   .first()
    //   .getKey();
    // const currentBlockKey = editorState.getSelection().getAnchorKey();
    // const isFirstBlock = currentBlockKey === firstBlockKey;
    // const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    // const isHeading = currentBlockType === "header-one";
    // if (isFirstBlock !== isHeading) {
    //   const newState = RichUtils.toggleBlockType(editorState, "header-one");
    //   this.setState({
    //     editorState: newState
    //   });
    // } else {
      this.setState({
        editorState
      });
    // }
  };

  onSave = async () => {
    const contentState = this.state.editorState.getCurrentContent();
    if (contentState.getPlainText()) {
      const content = JSON.stringify(convertToRaw(contentState))
      const title = contentState.getFirstBlock().getText();
      const requestBody = {
        postTitle: title,
        postBody: content
      }
      const token = "Bearer " + sessionStorage.getItem("jwt")
      let headers = {}
      headers.Authorization = token
      await axios.post(`${process.env.REACT_APP_URL}/posts/${this.props.currentUser}`,
        requestBody, { headers })
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

  onClick = e => {
    e.preventDefault();
    if (e.target.id === "underlineButton") {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
      );
    }
    if (e.target.id === "boldButton") {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
      );
    }
    if (e.target.id === "italicButton") {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
      );
    }
  };

  render() {
    return (
      <div className="editorContainer">
        <div>
          <WordCounter editorState={this.state.editorState} />
        </div>

        <span>
          <Toolbar
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
            {...this.props}
            onClick={this.onClick}
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
        <button className="actionButton" onClick={this.onSave}>
          <Link to="/">
            Save and exit
          </Link>
        </button>
        <button className="actionButton">
          <Link to="/">
             Back
          </Link>
        </button>
      </div>
    );
  }
}

export default TextEditor;
