/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import colors from "../../../utilities/Colors";
import { useDepartment } from "../../../contexts/DepartmentContext";
import SaveButton from "../../../components/atoms/SaveButton";
import EditButton from "../../../components/atoms/EditButton";
import CloseButton from "../../../components/atoms/CloseButton";
import "../../../App.css";
import { message } from 'antd';

const AddDepartment = ({ isDialogOpen, closeDialog, editedDepartmentItem }) => {
  const { createDepartmentItem, editDepartmentItem } = useDepartment();

  const [DepartmentItemData, setDepartmentItemData] = useState({
    id:"",
    description: "", 
    code: "",
    created_at: "",
    updated_at: "",
    
  });

  const isEditDepartmentItem = !!editedDepartmentItem;

  useEffect(() => {
    if (isEditDepartmentItem && editedDepartmentItem) {
      setDepartmentItemData({
        id: editedDepartmentItem.id || "",
        description: editedDepartmentItem.description || "", 
        code: editedDepartmentItem.code || "",
        created_at: editedDepartmentItem.created_at || "",
        updated_at: editedDepartmentItem.updated_at || "",
      });
    }
  }, [isEditDepartmentItem, editedDepartmentItem]);

  const validateForm = () => {
    let errors = {};
    if (!DepartmentItemData.code) {
      errors = {
        ...errors,
        code: "Please enter a code for the Department",
      };
    } else if (DepartmentItemData.code.length < 3 || DepartmentItemData.code.length > 10) {
      errors = {
        ...errors,
        code: `Code must be between ${3} and ${10} characters`,
      };
    }
    if (!DepartmentItemData.description) { // Corrected spelling
      errors = {
        ...errors,
        description: "Please enter a description for the Department item", // Corrected spelling
      };
    } else if (DepartmentItemData.description.length < 3) { // Corrected spelling
      errors = {
        ...errors,
        description: "Description should be at least 3 characters long", // Corrected spelling
      };
    }
    return Object.keys(errors).length === 0;
  };

  const reset = () => {
    setDepartmentItemData({
      id:"",
      description: "", 
      code:"",
      created_at: "",
      updated_at: "",
    });
  };

  const handleAddDepartmentItem = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await createDepartmentItem(DepartmentItemData);
      reset();
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditDepartmentItem = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await editDepartmentItem(DepartmentItemData);
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentItemData({
      ...DepartmentItemData,
      [name]: value,
    });
  };

  const primaryColor = colors.primaryColor;

  const dialogStyles = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 ${
    isDialogOpen
      ? "opacity-100 scale-100"
      : "opacity-0 scale-95 pointer-events-none"
  } transition-all duration-300 ease-in-out`;

  const blurredBackground = isDialogOpen
    ? `absolute top-0 left-0 w-full h-full backdrop-blur-md`
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
            onClick={() => {
              closeDialog();
              message.info('Operation canceled');
              reset();
            }}
            className={`absolute top-2 right-2 text-${primaryColor} hover:text-${primaryColor}`}
          >
            <FaTimes />
          </button>
          <h2 className={`title`}>
            {isEditDepartmentItem ? "Edit Department Item" : "Add Department Item"}
          </h2>
          <div className="mb-2">
            <label className="block text-white text-sm font-semibold mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              placeholder="Code"
              value={DepartmentItemData.code}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Department Item Description"
              value={DepartmentItemData.description} 
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <div className={`flex justify-end mt-4 `}>
            {isEditDepartmentItem ? (
              <div className="mr-2">
                <EditButton onClick={handleEditDepartmentItem} />
              </div>
            ) : (
              <div className="mr-2">
                <SaveButton onClick={handleAddDepartmentItem} />
              </div>
            )}
            <div className="mr-6">
              <CloseButton
                onClick={() => {
                  closeDialog();
                  message.info('Operation canceled');
                  reset();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
