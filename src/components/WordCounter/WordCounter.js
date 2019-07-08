import React from "react";
import { Progress } from "react-sweet-progress";
import "./WordCounter.css"

const WordCounter = ({ editorState, editMode }) => {
  const getWordCount = editorState => {
    const plainText = editorState.getCurrentContent().getPlainText("");
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, " ").trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace
    return wordArray ? wordArray.length : 0;
  };

  const getWordsToGo = (target, editorState) => {
    const wordCount = getWordCount(editorState);
    const wordsToGo = target - wordCount;
    if (wordsToGo < 0) return 0;
    else return wordsToGo;
  };

  const getPercent = (target, editorState) => {
    const wordCount = getWordCount(editorState);
    const percent = Math.floor((wordCount / target) * 100);
    if (percent <= 100) return percent;
    else return 100;
  };

  const getProgress = (target, editorState) => {
    const wordsToGo = getWordsToGo(target, editorState);
    if (wordsToGo > 0) {
      return `${wordsToGo} words to go`;
    } else {
      return "You're on fire keep on writing!";
    }
  };

  return (
    <div className={editMode ? "wordCounter" : "wordCounter invisible"}>
      <span>{getProgress(10, editorState)}</span>
      <span>
        <Progress
          percent={getPercent(10, editorState)}
          status={getPercent(10, editorState) < 100 ? "active" : "success"}
        />
      </span>
    </div>
  );
};

export default WordCounter;
