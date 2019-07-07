import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";
import { getAllPosts, userLogin } from "../../utils/api";

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
      inputFormUsername: null,
      inputFormPassword: null,
      allPosts: null
    };
  }

  componentDidMount = async () => {
    const allPosts = await getAllPosts();
    this.setState({ allPosts });
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

  render() {
    const isSignedIn = sessionStorage.getItem("jwt");
    return (
      <div className="App">
        <Router>
          {isSignedIn ? (
            <NavBar onLogout={this.onLogout} onHome={getAllPosts} />
          ) : (
            <Redirect to="/login" />
          )}
          <Route
            key="editPost"
            path="/posts/:postId"
            render={props => (
              <TextEditor allPosts={this.state.allPosts} {...props} />
            )}
          />
          <Route
            exact
            path="/"
            render={() => <Home posts={this.state.allPosts} />}
          />
          <Route
            key="newPost"
            exact
            path="/newPost"
            render={() => <TextEditor currentUser={this.state.currentUser} />}
          />
          <Route
            path="/login"
            render={props => (
              <Login
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                isSignedIn={this.state.isSignedIn}
                {...props}
              />
            )}
          />
        </Router>
      </div>
    );
  }
}

export default App;
