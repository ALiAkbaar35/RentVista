/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useContract } from "../../../contexts/ContractContext";
import SaveButton from "../../../components/atoms/SaveButton";
import CloseButton from "../../../components/atoms/CloseButton";
import { message } from "antd";

const AddSchedule = ({ isDialogOpen, closeDialog, editedSchedule }) => {
  const { addSchedule, editSchedule } = useContract();
  const [validationErrors, setValidationErrors] = useState({});
  const isEditSchedule = !!editedSchedule;

  const [scheduleData, setScheduleData] = useState({
    id: "",
    rent_contract_id:"",
    payment_amount: "",
    next_payment_date: "",
  });

  useEffect(() => {
     const formatDateForInputUTC = (dateString) => {
       const date = new Date(dateString);
       const year = date.getUTCFullYear();
       const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
       const day = date.getUTCDate().toString().padStart(2, "0");
       const hours = date.getUTCHours().toString().padStart(2, "0");
       const minutes = date.getUTCMinutes().toString().padStart(2, "0");
       return `${year}-${month}-${day} ${hours}:${minutes}`;
     };
    if (isEditSchedule && editedSchedule) {
      setScheduleData({
        id: editedSchedule.id,
        rent_contract_id: editedSchedule.rent_contract_id,
        payment_amount: editedSchedule.payment_amount || "",
        next_payment_date:
        formatDateForInputUTC(editedSchedule.next_payment_date) || "",
      });
    }
  }, [isEditSchedule, editedSchedule]);

  const validateForm = () => {
    let errors = {};

    // Validate payment amount
    if (!scheduleData.payment_amount) {
      errors.payment_amount = "Payment amount is required";
    } else if (isNaN(scheduleData.payment_amount)) {
      errors.payment_amount = "Payment amount must be a number";
    }

    // Validate next payment date
    if (!scheduleData.next_payment_date) {
      errors.next_payment_date = "Next payment date is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const reset = () => {
    setScheduleData({
      id: "",
      rent_contract_id: "",
      payment_amount: "",
      next_payment_date: "",
    });
  };

  const handleAddSchedule = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await addSchedule(scheduleData);
      reset();
      closeDialog();
      message.success("Schedule added successfully");
    } catch (error) {
      console.error(error);
      message.error("Error adding schedule");
    }
  };

  const handleEditSchedule = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await editSchedule(scheduleData);
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
    setValidationErrors({
      ...validationErrors,
      [name]: "",
    });
  };

  const dialogStyles = `fixed top-1/3 mt-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-2/3 h-4/5 sm:w-2/6 md:w-1/2 lg:w-2/6 xl:w-1/4 ${
    isDialogOpen
      ? "opacity-100 scale-100"
      : "opacity-0 scale-95 pointer-events-none"
  } 
    overflow-y-auto 
    transition-all duration-300 ease-in-out
    rounded-lg`;

  const blurredBackground = isDialogOpen
    ? `absolute top-0 left-0 w-full h-full backdrop-blur-md position-fixed`
    : "";

  return (
    <div>
      <div
        className={blurredBackground}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      ></div>
      <div className={dialogStyles}>
        <div
          className={`bg-gray-800 rounded-lg shadow-lg p-4 text-white relative z-10`}
        >
          <button
            onClick={closeDialog}
            className={`absolute top-2 right-2 text-white hover:text-white`}
          >
            <FaTimes />
          </button>
          <h2 className={`title`}>
            {isEditSchedule ? "Edit Schedule" : "Add Schedule"}
          </h2>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Payment Amount
            </label>
            <input
              type="text"
              name="payment_amount"
              placeholder="Payment Amount"
              value={scheduleData.payment_amount}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.payment_amount && (
              <p className="text-red-500 text-xs">
                {validationErrors.payment_amount}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Next Payment Date
            </label>
            <input
              type="datetime-local"
              name="next_payment_date"
              value={scheduleData.next_payment_date}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.next_payment_date && (
              <p className="text-red-500 text-xs">
                {validationErrors.next_payment_date}
              </p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            {isEditSchedule ? (
              <div className="mr-2">
                <SaveButton onClick={handleEditSchedule} />
              </div>
            ) : (
              <div className="mr-2">
                <SaveButton onClick={handleAddSchedule} />
              </div>
            )}
            <div className="mr-2">
              <CloseButton onClick={closeDialog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSchedule;
