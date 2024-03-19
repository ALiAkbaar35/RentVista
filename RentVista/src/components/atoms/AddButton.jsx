// eslint-disable-next-line no-unused-vars
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import "../../App.css"

// eslint-disable-next-line react/prop-types
function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="button bg-yellow-500 hover:bg-yellow-600 text-white  "
      style={{ whiteSpace: "nowrap" }}
    >
      <PlusOutlined /> Add
    </button>
  );
}

export default AddButton;
