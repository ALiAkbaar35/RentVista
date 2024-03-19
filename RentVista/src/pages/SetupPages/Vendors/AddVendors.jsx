/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import colors from "../../../utilities/Colors";
import { useVendor } from "../../../contexts/VendorContext";
import SaveButton from "../../../components/atoms/SaveButton";
import EditButton from "../../../components/atoms/EditButton";
import CloseButton from "../../../components/atoms/CloseButton";
import { message } from 'antd';
import "../../../App.css";

const AddVendors = ({ isDialogOpen, closeDialog, editedVendor }) => {
  const {createVendor, editVendor } = useVendor(); // Use the context hook

  const [vendorData, setVendorData] = useState({
    id: "",
    name: "",
    code: "",
    phone: "",
    address: "",
    creditlimit:"",
    created_at: "",
    updated_at:"",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const isEditVendor = !!editedVendor;

  useEffect(() => {
    if (isEditVendor && editedVendor) {
      setVendorData({
        id: editedVendor.id || "",
        name: editedVendor.name || "",
        code: editedVendor.code || "",
        phone: editedVendor.phone || "",
        address: editedVendor.address || "",
        creditlimit: editedVendor.creditlimit || "",
        created_at: editedVendor.created_at || "",
        updated_at: editedVendor.updated_at || "",

      });
    }
  }, [isEditVendor, editedVendor]);

  const validateForm = () => {
    let errors = {};
  
    const minLength = 3; 
    const maxLength = 50; 
  
    if (!vendorData.name) {
      errors = {
        ...errors,
        name: "Please enter a name for the vendor",
      };
    } else if (vendorData.name.length < minLength || vendorData.name.length > maxLength) {
      errors = {
        ...errors,
        name: `Name must be between ${minLength} and ${maxLength} characters`,
      };
    }
  
    if (!vendorData.code) {
      errors = {
        ...errors,
        code: "Please enter an code for the vendor",
      };
    } else if (vendorData.code.length < minLength || vendorData.code.length > maxLength) {
      errors = {
        ...errors,
        code: `code must be between ${minLength} and ${maxLength} characters`,
      };
    }
  
    if (!vendorData.phone) {
      errors = {
        ...errors,
        phone: "Please enter a phone number for the vendor",
      };
    } else if (!isValidPhone(vendorData.phone)) {
      errors = {
        ...errors,
        phone: "Please enter a 8 dijit valid phone number",
      };
    }
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  
  const isValidPhone = (phone) => {
    return /^[0-9]{8}$/g.test(phone);
  };
  

  const reset = () => {
    setVendorData({
      id: "",
      name: "",
      code: "",
      phone: "",
      address: "",
      creditlimit: "",
      created_at: "",
      updated_at: "",
    });
    setValidationErrors({});
  };

  const handleAddVendor = async () => {
    if (!validateForm()) {
      return;
    }
      try {
      await createVendor(vendorData);
      reset();
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEditVendor = async () => {
    if (!validateForm()) {
      return;
    }
  
    try {
      await editVendor(editedVendor.$id, vendorData);
      reset();
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({
      ...vendorData,
      [name]: value,
    });

    setValidationErrors({
      ...validationErrors,
      [name]: "",
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
            {isEditVendor ? "Edit Vendor" : "Add Vendor"}
          </h2>
          <div className="mb-2">
          <label className=" block text-white text-sm font-semibold mb-1">
          Code
        </label>
          <input
            type="text"
            name="code"
            placeholder="code"
            value={vendorData.code}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-xs" 
          />
          {validationErrors.code && (
            <p className="text-red-500 text-xs">{validationErrors.code}</p>
          )}
          </div>

          <div className="mb-2">
          <label className=" block text-white text-sm font-semibold mb-1">
          Name
          </label>
            <input
              type="text"
              name="name"
              placeholder="Vendor Name"
              value={vendorData.name}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs">{validationErrors.name}</p>
            )}
          </div>

          <div className="mb-2">
          <label className=" block text-white text-sm font-semibold mb-1">
          Phone
          </label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={vendorData.phone}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs">{validationErrors.phone}</p>
            )}
          </div>
          <div className="mb-2">
          <label className=" block text-white text-sm font-semibold mb-1">
          Creditlimit
          </label>
            <input
              type="text"
              name="creditlimit"
              placeholder="creditlimit"
              value={vendorData.creditlimit}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
            {validationErrors.creditlimit && (
              <p className="text-red-500 text-xs">{validationErrors.creditlimit}</p>
            )}
          </div>

          <div className="mb-2">
          <label className=" block text-white text-sm font-semibold mb-1">
           Address
          </label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={vendorData.address}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs" 
            />
            {validationErrors.address && (
              <p className="text-red-500 text-xs">{validationErrors.address}</p>
            )}
          </div>

          <div className={`flex justify-end mt-4`}>
            {isEditVendor ? (
              <div className={` mr-2`}>
                <EditButton onClick={handleEditVendor} />
              </div>
            ) : (
              <div className={` mr-2`}>
                <SaveButton onClick={handleAddVendor} />
              </div>
            )}

            <div className={` mr-2`}>
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

export default AddVendors;
