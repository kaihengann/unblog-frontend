import React from "react";
import "./StyleButton.css"

const StyleButton = ({ active, label, onToggle, style }) => {
  const toggle = e => {
      e.preventDefault();
      onToggle(style);
    };
  return(
    <button className={active ? "activeStyleButton" : "styleButton"} onMouseDown={toggle}>
      {label}
    </button>
  )
};

export default StyleButton;
