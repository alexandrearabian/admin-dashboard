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
    height: "200px",
    margin: "0 auto",
  },
  multiline,
  numberOfLines,
}) {
  return (
    // <div>
    //   <ReactQuill
    //     value={value}
    //     onChange={onChange}
    //     placeholder={placeholder}
    //     style={style} // Apply the styles directly
    //   />
    // </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)} // Update value from textarea
      placeholder={placeholder}
      style={style}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}
