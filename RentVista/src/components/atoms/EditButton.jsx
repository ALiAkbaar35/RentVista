// eslint-disable-next-line no-unused-vars
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import "../../App.css"

// eslint-disable-next-line react/prop-types
function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="button bg-blue-500 hover:bg-blue-600 "
      style={{ whiteSpace: "nowrap" }}
    >
      <EditOutlined /> Save
    </button>
  );
}

export default EditButton;
