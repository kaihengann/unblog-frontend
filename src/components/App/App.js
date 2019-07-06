import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";
import axios from "axios";

import Home from "../Home/Home";
import Login from "../Login/Login";
import NavBar from "../NavBar/NavBar";
import TextEditor from "../TextEditor/TextEditor";

const host = "https://unblog-kai.herokuapp.com/userBlogs";
// "https://unblog-kai.herokuapp.com/userBlogs";
// "http://localhost:3000/userBlogs"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPostId: null,
      currentUser: null,
      inputFormUsername: null,
      inputFormPassword: null
    };
  }

  isUserAuthorised = async () => {
    let headers = {};
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      headers.Authorization = "Bearer " + jwt;
    }
    const url = host + "/secure/" + this.state.currentUser;
    const response = await axios.get(url, headers);
    if (!response.ok) {
      return false;
    }
    return true;
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
      
      const response = await axios.post(host + "/login", requestBody);
      
      if (response.data.jwt) {
        sessionStorage.setItem("jwt", response.data.jwt);
        this.setState({
          isSignedIn: true,
          currentUser: response.data.username
        });
      }
    }
  };

  onLogout = () => {
    sessionStorage.removeItem("jwt");
    localStorage.removeItem("content");
    this.setState({
      isSignedIn: false
    });
  };

  render() {
    const isSignedIn = sessionStorage.getItem("jwt");

    return (
      <div className="App">
        <Router>
          {isSignedIn ? (
            <NavBar onLogout={this.onLogout} />
          ) : (
            <Redirect to="/login" />
          )}

          <Route exact path="/" component={Home} />
          <Route exact path="/newPost" component={TextEditor} />
          {/* <Route path="/newPost" component={TextEditor} /> */}
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
