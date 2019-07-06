import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";
import axios from "axios";

import Home from "../Home/Home";
import Login from "../Login/Login";
import NavBar from "../NavBar/NavBar";
import TextEditor from "../TextEditor/TextEditor";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPostId: null,
      currentUser: null,
      inputFormUsername: null,
      inputFormPassword: null,
      allPosts: null
    };
  }

  isUserAuthorised = async () => {
    const jwt = sessionStorage.getItem("jwt");
    const currentUser = sessionStorage.getItem("username");
    if (jwt && currentUser) {
      let headers = {};
      headers.Authorization = "Bearer " + jwt;
      const url = process.env.REACT_APP_URL + "/secure/" + currentUser;
      const response = await axios.get(url, { headers });
      if (response.ok) {
        sessionStorage.setItem("username", response.data.username);
        return { headers, currentUser };
      }
    }
    return false;
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
      const requestBody = {
        username: this.state.inputFormUsername,
        password: this.state.inputFormPassword
      };
      const response = await axios.post(
        process.env.REACT_APP_URL + "/login",
        requestBody
      );
      if (response.data.jwt) {
        sessionStorage.setItem("jwt", response.data.jwt);
        sessionStorage.setItem("username", response.data.username);
        let headers = {};
        headers.Authorization = "Bearer " + response.data.jwt;
        this.setState({
          isSignedIn: true,
          currentUser: response.data.username
        });
        await this.getAllPosts();
      }
    }
  };

  getAllPosts = async () => {
    const jwt = sessionStorage.getItem("jwt");
    const currentUser = sessionStorage.getItem("username");
    let headers = {};
    headers.Authorization = "Bearer " + jwt;
    const response = await axios.get(
      process.env.REACT_APP_URL + "/posts/" + currentUser,
      { headers }
    );
    this.setState({
      allPosts: response.data
    });
    console.log(response.data);
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
            <NavBar onLogout={this.onLogout} onHome={this.getAllPosts} />
          ) : (
            <Redirect to="/login" />
          )}

          <Route
            exact
            path="/"
            render={() => (
              <Home posts={this.state.posts} />
            )}
          />
          <Route exact path="/newPost" component={TextEditor} />
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
