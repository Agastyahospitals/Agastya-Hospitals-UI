import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import htmlEditButton from "quill-html-edit-button";
import Quill from "quill";

// Register htmlEditButton on Quill instances
if (ReactQuill && ReactQuill.Quill) {
  ReactQuill.Quill.register("modules/htmlEditButton", htmlEditButton);
}
if (Quill && Quill !== ReactQuill?.Quill) {
  Quill.register("modules/htmlEditButton", htmlEditButton);
}
if (typeof window !== "undefined" && !window.Quill) {
  window.Quill = ReactQuill?.Quill || Quill;
}

const HTMLTextEditor = ({ name, placeholder, state, handleChange, onBlur, errors }) => {
  const modules = {
    htmlEditButton: {},
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "link",
        "image",
        "video",
        "formula",
        "clean",
        "code",
        "script",
      ],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "code-block",
    "blockquote",
    "formula",
    "code",
    "script",
    "indent",
  ];

  return (
    <>
      <ReactQuill
        theme="snow"
        value={state || ""}
        onChange={handleChange}
        onBlur={onBlur}
        className="form-control"
        name={name}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
      {errors}
    </>
  );
};

export default HTMLTextEditor;
