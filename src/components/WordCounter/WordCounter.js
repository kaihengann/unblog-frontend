import React from "react";

const WordCounter = ({ editorState }) => {
  const getWordCount = editorState => {
    const plainText = editorState.getCurrentContent().getPlainText("");
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, " ").trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace
    return wordArray ? wordArray.length : 0;
  };
  return (<span className="wordCounter">{getWordCount(editorState)} words</span>);
};

export default WordCounter;
