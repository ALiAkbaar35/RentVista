// ConfirmationDialog.js

import React from "react";

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    isOpen && (
      <div className="confirmation-dialog">
        <div className="dialog-content">
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="button-container">
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm-button" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmationDialog;
