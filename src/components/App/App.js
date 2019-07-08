import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";
import {
  getAllPosts,
  userLogin,
  deletePost,
  createPost,
  updatePost
} from "../../utils/api";

import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";

import Home from "../Home/Home";
import Login from "../Login/Login";
import NavBar from "../NavBar/NavBar";
import TextEditor from "../TextEditor/TextEditor";

class App extends React.Component {
  constructor(props) {
    super(props);
    const currentUser = sessionStorage.getItem("username");
    this.state = {
      currentUser,
      allPosts: null,
      inputFormUsername: null,
      inputFormPassword: null,
      progress: 0,
      editMode: false,
      editorState: EditorState.createEmpty(),
      currentPost: null
    };
  }

  componentDidMount = async () => {
    const allPosts = await getAllPosts();
    this.setState({ allPosts });
  };

  getCurrentPost = postId => {
    if (this.state.allPosts) {
      const filterPost = post => post.postId === postId;
      const currentPost = this.state.allPosts.find(filterPost);
      this.setState({ currentPost });
    }
  };

  updateEditorState = () => {
    if (this.state.currentPost) {
      const postBody = this.state.currentPost.postBody;
      // this.postId = this.state.currentPost.postId;
      // this.createdOn = this.state.currentPost.createdOn;
      const content = convertFromRaw(JSON.parse(postBody));
      this.setState({
        editorState: EditorState.createWithContent(content)
      });
    } else {
      this.setState({ editorState: EditorState.createEmpty() });
    }
  };

  onClick = async postId => {
    const posts = await getAllPosts();
    this.setState({ allPosts: posts });
    this.getCurrentPost(postId);
    this.updateEditorState();
  };

  onSave = async () => {
    const username = sessionStorage.getItem("username");
    const contentState = this.state.editorState.getCurrentContent();

    if (contentState.getPlainText()) {
      const content = JSON.stringify(convertToRaw(contentState));
      const title = contentState.getFirstBlock().getText();
      const jwt = sessionStorage.getItem("jwt");
      if (!this.state.currentPost) {
        await createPost(title, content, jwt, username);
        const allPosts = await getAllPosts();
        this.setState({ allPosts });
      }
      if (this.state.currentPost) {
        const postId = this.state.currentPost.postId;
        const createdOn = this.state.currentPost.createdOn;
        await updatePost(postId, title, content, createdOn, jwt, username);
        const allPosts = await getAllPosts();
        this.setState({ allPosts });
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

  onEditorButtonClick = e => {
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

  onNewPost = () => {
    this.setState({
      editMode: true,
      currentPost: null,
      editorState: EditorState.createEmpty()
    });
  };

  onChange = e => {
    if (e.target.id === "usernameInput") {
      this.setState({
        inputFormUsername: e.target.value
      });
    }
    if (e.target.id === "passwordInput") {
      this.setState({
        inputFormPassword: e.target.value
      });
    }
  };

  onEditorChange = editorState => {
    this.setState({
      editorState
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    if (e.target.id === "loginFormSubmitButton") {
      const data = await userLogin(
        this.state.inputFormUsername,
        this.state.inputFormPassword
      );
      if (data.jwt) {
        sessionStorage.setItem("jwt", data.jwt);
        sessionStorage.setItem("username", data.username);
        this.setState({
          isSignedIn: true,
          currentUser: data.username
        });
        const allPosts = await getAllPosts();
        this.setState({
          allPosts
        });
      }
    }
  };

  onLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("username");
    localStorage.removeItem("content");
    this.setState({
      isSignedIn: false,
      allPosts: null,
      currentUser: null
    });
  };

  onDelete = async postId => {
    const jwt = sessionStorage.getItem("jwt");
    const username = sessionStorage.getItem("username");
    await deletePost(postId, jwt, username);
  };

  render() {
    const isSignedIn = sessionStorage.getItem("jwt");
    return (
      <div className="App">
        <Router>
          {isSignedIn ? (
            <NavBar
              onLogout={this.onLogout}
              onHome={getAllPosts}
              onCreatePost={this.onCreatePost}
              onNewPost={this.onNewPost}
            />
          ) : (
            <Redirect to="/login" />
          )}
          <Route
            key="editPost"
            path="/posts/:postId"
            render={props => (
              <TextEditor
                allPosts={this.state.allPosts}
                editMode={this.state.editMode}
                onChange={this.onEditorChange}
                onClick={this.onEditorButtonClick}
                onSave={this.onSave}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                toggleBlockType={this.toggleBlockType}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={props => (
              <Home
                allPosts={this.state.allPosts}
                onDelete={this.onDelete}
                onClick={this.onClick}
                {...props}
              />
            )}
          />
          <Route
            key="newPost"
            exact
            path="/newPost"
            render={props => (
              <TextEditor
                allPosts={this.state.allPosts}
                editMode={this.state.editMode}
                onChange={this.onEditorChange}
                onClick={this.onEditorButtonClick}
                onSave={this.onSave}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                toggleBlockType={this.toggleBlockType}
                {...props}
              />
            )}
          />
          <Route
            path="/login"
            render={props => (
              <Login
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                isSignedIn={this.state.isSignedIn}
              />
            )}
          />
        </Router>
      </div>
    );
  }
}

export default App;
