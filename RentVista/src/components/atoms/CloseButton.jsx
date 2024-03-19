// eslint-disable-next-line no-unused-vars
import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import "../../App.css"

// eslint-disable-next-line react/prop-types
function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="button bg-red-500 hover:bg-red-600 text-white "
      style={{ whiteSpace: "nowrap" }}
    >
      <CloseOutlined /> Close
    </button>
  );
}

export default CloseButton;
