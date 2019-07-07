import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import { Link } from "react-router-dom";
import Toolbar from "../ToolBar/ToolBar";
import WordCounter from "../WordCounter/WordCounter";
import "./TextEditor.css";
import { createPost, updatePost } from "../../utils/api";

const getBlockStyle = block => {
  if (block.getType() === "blockquote") return "RichEditor-blockquote";
  return null;
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.match
      ? (this.state.editMode = false)
      : (this.state.editMode = true);
    if (this.props.allPosts) {
      const filterPost = post => post.postId === this.props.match.params.postId;
      const currentPost = this.props.allPosts.find(filterPost);
      if (currentPost) {
        const postBody = currentPost.postBody;
        this.postId = currentPost.postId
        this.createdOn = currentPost.createdOn
        this.state.editorState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(postBody))
        );
      }
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
  }
  
  onChange = editorState => {
    this.setState({
      editorState
    });
  };
  
  onSave = async () => {
    const username = sessionStorage.getItem("username")
    const contentState = this.state.editorState.getCurrentContent();
    const existingPost = (localStorage.getItem("existingPost") === 'true')
    
    if (contentState.getPlainText() ) {
      const content = JSON.stringify(convertToRaw(contentState));
      const title = contentState.getFirstBlock().getText();
      const jwt = sessionStorage.getItem("jwt");
      if (!existingPost) {
        await createPost(title, content, jwt, username);
      }
      if (existingPost) {
        await updatePost(this.postId, title, content, this.createdOn, jwt, username)
        
      }
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
    if (e.target.id === "editButton") {
      this.setState({
        editMode: !this.state.editMode
      });
    }
  };

  render() {
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
              this.state.editMode ? "actionButton toggled" : "actionButton"
            }
            id="editButton"
            onClick={this.onClick}
          >
            Edit
          </button>
        </div>
        <div>
          <WordCounter
            editorState={this.state.editorState}
            editMode={this.state.editMode}
          />
        </div>
        <span>
          <Toolbar
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
            {...this.props}
            onClick={this.onClick}
            editMode={this.state.editMode}
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
        <button
          className={
            this.state.editMode ? "actionButton" : "actionButton invisible"
          }
          onClick={this.onSave}
        >
          <Link to="/">Save and exit</Link>
        </button>
      </div>
    );
  }
}

export default TextEditor;
