import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "./App.css";
import {
  getAllPosts,
  userLogin,
  deletePost,
  createPost,
  updatePost
} from "../../utils/api";

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
      editMode: false,
      currentPost: null,
      usernameInput: null,
      passwordInput: null,
      editorState: EditorState.createEmpty()
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
      const content = convertFromRaw(JSON.parse(postBody));
      this.setState({ editorState: EditorState.createWithContent(content) });
    } else {
      this.setState({ editorState: EditorState.createEmpty() });
    }
  };

  onPostClick = async postId => {
    const allPosts = await getAllPosts();
    this.setState({ allPosts, editMode: false });
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
      if (this.state.currentPost) {
        const postId = this.state.currentPost.postId;
        const createdOn = this.state.currentPost.createdOn;
        await updatePost(postId, title, content, createdOn, jwt, username);
      } else {
        await createPost(title, content, jwt, username);
      }
    }
    const allPosts = await getAllPosts();
    this.setState({ allPosts });
  };

  onEditClick = event => {
    event.preventDefault();
    this.setState({ editMode: !this.state.editMode });
  };

  onBoldClick = event => {
    event.preventDefault();
    this.onEditorChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
    );
  };

  onUnderlineClick = event => {
    event.preventDefault();
    this.onEditorChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };

  onItalicClick = event => {
    event.preventDefault();
    this.onEditorChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );
  };

  onNewPost = () => {
    this.setState({
      editMode: true,
      currentPost: null,
      editorState: EditorState.createEmpty()
    });
  };

  onChange = event => this.setState({ [event.target.id]: event.target.value });

  onEditorChange = editorState => this.setState({ editorState });

  onSubmit = async e => {
    if (e.target.id === "loginFormSubmitButton") {
      const data = await userLogin(
        this.state.usernameInput,
        this.state.passwordInput
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
          allPosts,
          usernameInput: null,
          passwordInput: null
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
    const allPosts = await getAllPosts();
    this.setState({ allPosts });
  };

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  clearEditorState = () => {
    this.setState({ editorState: EditorState.createEmpty() });
  };

  toggleBlockType = blockType => {
    this.onEditorChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType)
    );
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
                onClick={this.onEditClick}
                onSave={this.onSave}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                toggleBlockType={this.toggleBlockType}
                onBoldClick={this.onBoldClick}
                onItalicClick={this.onItalicClick}
                onUnderlineClick={this.onUnderlineClick}
                clearEditorState={this.clearEditorState}
                readOnly={this.editMode}
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
                onPostClick={this.onPostClick}
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
                onClick={this.onEditClick}
                onSave={this.onSave}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                handleTab={this.handleTab}
                toggleBlockType={this.toggleBlockType}
                onBoldClick={this.onBoldClick}
                onItalicClick={this.onItalicClick}
                onUnderlineClick={this.onUnderlineClick}
                clearEditorState={this.clearEditorState}
                {...props}
              />
            )}
          />
          <Route
            path="/login"
            render={() => (
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
