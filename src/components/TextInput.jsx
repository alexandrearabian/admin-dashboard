import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextInput({
  value,
  onChange,
  placeholder,
  style = {
    padding: "8px",
    border: "1px solid var(--goldish)",
    borderRadius: "4px",
    width: "80%",
    margin: "0 auto",
  },
}) {
  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...style }}
      />
    </div>
  );
}
