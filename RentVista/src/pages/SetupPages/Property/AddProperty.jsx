/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import colors from "../../../utilities/Colors";
import { useProperty } from "../../../contexts/PropertyContext";
import SaveButton from "../../../components/atoms/SaveButton";
import EditButton from "../../../components/atoms/EditButton";
import CloseButton from "../../../components/atoms/CloseButton";
import { useDepartment } from "../../../contexts/DepartmentContext";
import "../../../App.css";
import { message } from 'antd';

const AddProperty = ({ isDialogOpen, closeDialog, editedPropertyItem }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const isEditPropertyItem = !!editedPropertyItem;
  const { createPropertyItem, editPropertyItem } = useProperty();
  const { departmentItems } = useDepartment();
  const [PropertyItemData, setPropertyItemData] = useState({
    id:"",
    code: "",
    description: "",
    department: "",
    address: "",
    created_at: "",
    updated_at: "",
  });
  
  useEffect(() => {
    if (isEditPropertyItem && editedPropertyItem) {
      setPropertyItemData({
        id: editedPropertyItem.id ||"",
        code: editedPropertyItem.code || "",
        description: editedPropertyItem.description || "",
        department: editedPropertyItem.department_id || "",
        address: editedPropertyItem.address || "",
        created_at: editedPropertyItem.created_at || "",
        updated_at: editedPropertyItem.updated_at || "",
      });
    }
  }, [isEditPropertyItem, editedPropertyItem]);

      const validateForm = () => {
      let errors = {};
      if (!PropertyItemData.code) {
        errors = {
          ...errors,
          code: "Please enter a code for the Property",
        };
      } else if (PropertyItemData.code.length < 3 || PropertyItemData.code.length > 10) {
        errors = {
          ...errors,
          code: "Code must be between 3 and 10 characters",
        };
      }
      if (!PropertyItemData.description) {
        errors = {
          ...errors,
          description: "Please enter a description for the Property item",
        };
      } else if (PropertyItemData.description.length < 3) {
        errors = {
          ...errors,
          description: "Description should be at least 3 characters long",
        };
      }
      if (!PropertyItemData.department) {
        errors = {
          ...errors,
          department: "Please select a department",
        };
      }
     const addressRegex = /^[a-zA-Z0-9\s]+$/;
     
     if (PropertyItemData.address && !addressRegex.test(PropertyItemData.address)) {
       errors = {
         ...errors,
         address: "Address should not contain special characters",
       };
     }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };

  const reset = () => {
    setPropertyItemData({
      id:"",
      code: "",
      description: "",
      department: "",
      address: "",
      created_at: "",
      updated_at: "",
    });
  };

  const handleAddPropertyItem = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await createPropertyItem(PropertyItemData);
      reset();
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPropertyItem = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await editPropertyItem(PropertyItemData);
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyItemData({
      ...PropertyItemData,
      [name]: value
    });

    setValidationErrors({
      ...validationErrors,
      [name]: ""
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
            {isEditPropertyItem ? "Edit Property " : "Add Property "}
          </h2>
          <div className="mb-2">
            <label className=" block text-white text-sm font-semibold mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              placeholder="code"
              value={PropertyItemData.code}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
            {validationErrors.code && (
              <p className="text-red-500 text-xs">{validationErrors.code}</p>
            )}
          </div>
              
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="description"
              value={PropertyItemData.description}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
             {validationErrors.description && (
              <p className="text-red-500 text-xs">{validationErrors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Department
            </label>
            <select
              name="department"
              value={PropertyItemData.department}
              onChange={handleInputChange}
              className="select select-bordered w-full max-w-xs text-white responsive-input "
            >
              <option value="" disabled>
                Select department
              </option>
              {departmentItems.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.description}
                </option>
              ))}
            </select>
            {validationErrors.department && (
              <p className="text-red-500 text-xs">{validationErrors.department}</p>
            )}
          </div>

          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={PropertyItemData.address}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
            {validationErrors.address && (
              <p className="text-red-500 text-xs">{validationErrors.address}</p>
            )}
          </div>
          <div className={`flex justify-end mt-4`}>
            {isEditPropertyItem ? (
              <div className="mr-2">
                <EditButton onClick={handleEditPropertyItem} />
              </div>
            ) : (
              <div className="mr-2">
                <SaveButton onClick={handleAddPropertyItem} />
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

export default AddProperty;
