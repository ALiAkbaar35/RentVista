// eslint-disable-next-line no-unused-vars
import React from "react";
import { SaveOutlined  } from "@ant-design/icons";
import "../../App.css"

// eslint-disable-next-line react/prop-types
function SaveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="button bg-green-500 hover:bg-yellow-600 "
      style={{ whiteSpace: "nowrap" }}
    >
      <SaveOutlined  /> Save
    </button>
  );
}

export default SaveButton;
