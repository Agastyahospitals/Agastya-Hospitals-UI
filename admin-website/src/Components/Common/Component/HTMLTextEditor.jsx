import React from "react";
import ReactQuill from "react-quill";
// import CKEditors from 'react-ckeditor-component';

const HTMLTextEditor = ({ name, placeholder, state, handleChange, errors }) => {
  const modules = {
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
        value={state}
        onChange={handleChange}
        className="form-control"
        name={name}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
      {/* <CKEditors
        activeclassName="p10"
        content={state}
        events={{
          change: handleChange,
        }}
      /> */}
      {errors}
    </>
  );
};

export default HTMLTextEditor;
