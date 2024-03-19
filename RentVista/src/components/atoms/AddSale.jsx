// eslint-disable-next-line no-unused-vars
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import "../../App.css"

// eslint-disable-next-line react/prop-types
function AddSale({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="button bg-blue-500 hover:bg-blue-600 text-white ml-2 flex-inline"
      style={{ whiteSpace: "nowrap" }}
    >
      <PlusOutlined />  Sale
    </button>
  );
}

export default AddSale;
