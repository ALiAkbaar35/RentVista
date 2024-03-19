/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import colors from "../../../utilities/Colors";
import { useContract } from "../../../contexts/ContractContext";
import SaveButton from "../../../components/atoms/SaveButton";
import EditButton from "../../../components/atoms/EditButton";
import CloseButton from "../../../components/atoms/CloseButton";
import { useVendor } from "../../../contexts/VendorContext";
import { useProperty } from "../../../contexts/PropertyContext";
import "../../../App.css";
import { message } from 'antd';

const AddContract = ({ isDialogOpen, closeDialog, editedContract }) => {
  const { addContract, editContract } = useContract();
  const { vendors } = useVendor();
  const { propertyItems } = useProperty();
  
  const [contractData, setContractData] = useState({
    vendor: "",
    property: "",
    monthlyRent: "",
    duration: "",
    numOfInstallment: "",
    agreement:"",
    startDate: "",
    expiryDate: "",
    paymentStartDate: "",
    status: "",
    frequency: "",
    code:"",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const isEditContract = !!editedContract;

  useEffect(() => {
     const formatDateForInputUTC = (dateString) => {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = date.getUTCDate().toString().padStart(2, "0");
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    if (isEditContract && editedContract) {
      setContractData({
        vendor: editedContract.vendor.name || "",
        property: editedContract.properties.name || "",
        monthlyRent: editedContract.monthlyRent || "",
        duration: editedContract.duration || "",
        numOfInstallment: editedContract.numOfInstallment || "",
        frequency: editedContract.frequency || "",
        agreement: editedContract.agreement || "",
        startDate: formatDateForInputUTC(editedContract.startDate || ""),
        expiryDate: formatDateForInputUTC(editedContract.expiryDate || ""),
        paymentStartDate: formatDateForInputUTC(editedContract.paymentStartDate || ""),
        status: editedContract.Status || "",
        code: editedContract.code || "",
      });
    }
  }, [isEditContract, editedContract]);

  const validateForm = () => {
    let errors = {};
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const reset = () => {
    setContractData({
      code:"",
      vendor: "",
      property: "",
      monthlyRent: "",
      duration: "",
      numOfInstallment: "",
      startDate: "",
      expiryDate: "",
      paymentStartDate: "",
      status: "",
      agreement: "",
      frequency:"",
    });
  };

  const handleAddContract = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await addContract(contractData);
      reset();
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditContract = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await editContract(editedContract.$id, contractData);
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "agreement") {
      const file = e.target.files[0];
      setContractData({
        ...contractData,
        [name]: file,
      });
    } else {
    
      setContractData({
        ...contractData,
        [name]: value,
      });
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
};

  const primaryColor = colors.primaryColor;
  const dialogStyles = `fixed top-1/3 mt-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-2/3 h-2/3 sm:w-2/6 md:w-1/2 lg:w-2/6 xl:w-2/6 ${
      isDialogOpen
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 pointer-events-none"
    } 
    overflow-y-auto 
    transition-all duration-300 ease-in-out
    rounded-lg`;

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
            {isEditContract ? "Edit Contract " : "Add Contract "}
          </h2>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
             code
            </label>
            <input
              type="text"
              name="code"
              placeholder="Code"
              value={contractData.code}
              onChange={handleInputChange}
              className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
            />
            {validationErrors.code && (
              <p className="text-red-500 text-xs">{validationErrors.code}</p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Vendor
            </label>
              <select
              name="vendor"
              value={contractData.vendor}
              onChange={handleInputChange}
              className={` w-full rounded-lg text-black outline-none focus:shadow-outline`}
              >
                <option value="" disabled>
                  Select Vendor
                </option>
                {vendors.map((vendor) => (
                  <option key={vendor.$id} value={vendor.$id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {validationErrors.vendor && (
                <p className="text-red-500 text-xs">
                  {validationErrors.vendor}
                </p>
              )} 
            {validationErrors.vendor && (
              <p className="text-red-500 text-xs">{validationErrors.vendor}</p>
            )}
          </div>    
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Property
            </label>
              <select
              name="property"
              value={contractData.property}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
              >
                <option value="" disabled>
                  Select property
                </option>
                {propertyItems.map((property) => (
                  <option key={property.$id} value={property.$id}>
                    {property.name}
                  </option>
                ))}
              </select>
            {validationErrors.property && (
              <p className="text-red-500 text-xs">{validationErrors.property}</p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              MonthlyRent
            </label>
            <input
              type="text"
              name="monthlyRent"
              placeholder="monthlyRent"
              value={contractData.monthlyRent}
              onChange={handleInputChange}
              className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
            />
            {validationErrors.monthlyRent && (
              <p className="text-red-500 text-xs">{validationErrors.monthlyRent}</p>
            )}
          </div>
           <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              placeholder="duration"
              value={contractData.duration}
              onChange={handleInputChange}
              className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
            />
            {validationErrors.duration && (
              <p className="text-red-500 text-xs">{validationErrors.duration}</p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
             Installments
            </label>
            <input
              type="text"
              name="numOfInstallment"
              placeholder="numOfInstallment"
              value={contractData.numOfInstallment}
              onChange={handleInputChange}
              className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
            />
            {validationErrors.numOfInstallment && (
              <p className="text-red-500 text-xs">{validationErrors.numOfInstallment}</p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
             Frequency
            </label>
            <input
              type="text"
              name="frequency"
              placeholder="Frequency"
              value={contractData.frequency}
              onChange={handleInputChange}
              className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
            />
            {validationErrors.frequency && (
              <p className="text-red-500 text-xs">{validationErrors.frequency}</p>
            )}
          </div>
          <div className="mb-4">
           
            {isEditContract ? (
              <p></p>
            ) : (
              
              <div className="upload-btn-wrapper">
               <label className="block text-white text-sm font-semibold mb-2">
              Agreement
            </label>
                <button type="button" className="btn bg-white text-black px-2 py-2 rounded-lg mr-5">Upload a file</button>
                <input
                  type="file"
                  name="agreement"
                  onChange={handleInputChange}
                  className="pl-2 file-input  bg-white text-black rounded-lg"
                />
              </div>
            )}
            {validationErrors.agreement && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.agreement}</p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              StartDate
            </label>
              <input
                type="datetime-local"
                name="startDate"
                value={contractData.startDate}
                onChange={handleInputChange}
                className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
              />
             {validationErrors.startDate && (
              <p className="text-red-500 text-xs">
                {validationErrors.startDate}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              ExpiryDate
            </label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={contractData.expiryDate}
                onChange={handleInputChange}
                className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
              />
             {validationErrors.expiryDate && (
              <p className="text-red-500 text-xs">
                {validationErrors.expiryDate}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className=" block text-white text-sm font-semibold mb-1">
              Status
            </label>
            <input
                type="text"
                name="status"
                placeholder="status"
                value={contractData.status}
                onChange={handleInputChange}
                className={`responsive-input w-full px-3 py-2 rounded-lg text-black outline-none focus:shadow-outline`}
              />
             {validationErrors.status && (
              <p className="text-red-500 text-xs">
                {validationErrors.status}
              </p>
            )}
          </div>          
          <div className={`flex justify-end mt-4`}>
            {isEditContract ? (
              <div className="mr-2">
                <EditButton onClick={handleEditContract} />
              </div>
            ) : (
              <div className="mr-2">
                <SaveButton onClick={handleAddContract} />
              </div>
            )}
            <div className="mr-2">
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

export default AddContract;
