import React from 'react';
import './App.css';

import TextEditor from './components/TextEditor'


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TextEditor />
      </div>
    );
  }
}

export default App;
