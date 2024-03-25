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
import { message } from "antd";

const AddContract = ({ isDialogOpen, closeDialog, editedContract }) => {
  const { addContract, editContract } = useContract();
  const { vendors } = useVendor();
  const { propertyItems } = useProperty();
  const [validationErrors, setValidationErrors] = useState({});
  const isEditContract = !!editedContract;

  const [contractData, setContractData] = useState({
    id: "",
    vendor: "",
    property: "",
    monthlyRent: "",
    duration: "",
    numOfInstallment: "",
    file: null,
    startDate: "",
    expiryDate: "",
    paymentStartDate: "",
    status: "",
    frequency: "",
    code: "",
    remarks: "",
    created_at: "",
    updated_at: "",
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

    if (isEditContract && editedContract) {
      setContractData({
        id: editedContract.id || "",
        vendor: editedContract.vendor_id || "",
        property: editedContract.property_id || "",
        monthlyRent: editedContract.monthly_installment || "",
        duration: editedContract.duration || "",
        numOfInstallment: editedContract.no_of_installment || "",
        frequency: editedContract.frequent_of_payment || "",
        file: editedContract.file_path || "",
        startDate: formatDateForInputUTC(editedContract.start_date || ""),
        expiryDate: formatDateForInputUTC(editedContract.expiry_date || ""),
        paymentStartDate: formatDateForInputUTC(
          editedContract.payment_start_date || ""
        ),
        status: editedContract.status || "",
        code: editedContract.agreement || "",
        remarks: editedContract.remark || "",
        created_at: editedContract.created_at || "",
        updated_at: editedContract.updated_at || "",
      });
    }
  }, [isEditContract, editedContract]);

  const validateForm = () => {
    let errors = {};

    // Validate code
    if (!contractData.code) {
      errors.code = "Code is required";
    }

    // Validate vendor
    if (!contractData.vendor) {
      errors.vendor = "Vendor is required";
    }

    // Validate property
    if (!contractData.property) {
      errors.property = "Property is required";
    }

    // Validate monthly rent
    if (!contractData.monthlyRent) {
      errors.monthlyRent = "Monthly rent is required";
    } else if (
      isNaN(contractData.monthlyRent) ||
      Number(contractData.monthlyRent) <= 0
    ) {
      errors.monthlyRent = "Monthly rent must be a positive number";
    }

    // Validate duration
    if (!contractData.duration) {
      errors.duration = "Duration is required";
    } else if (
      isNaN(contractData.duration) ||
      Number(contractData.duration) <= 0
    ) {
      errors.duration = "Duration must be a positive number";
    }

    // Validate number of installments
    if (!contractData.numOfInstallment) {
      errors.numOfInstallment = "Number of installments is required";
    } else if (
      isNaN(contractData.numOfInstallment) ||
      Number(contractData.numOfInstallment) <= 0
    ) {
      errors.numOfInstallment =
        "Number of installments must be a positive number";
    }

    // Validate frequency
    if (!contractData.frequency) {
      errors.frequency = "Frequency is required";
    } else if (
      isNaN(contractData.frequency) ||
      Number(contractData.frequency) <= 0
    ) {
      errors.frequency = "Frequency must be a positive number";
    }

    // Validate start date
    if (!contractData.startDate) {
      errors.startDate = "Start date is required";
    }

    // Validate expiry date
    if (!contractData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    }

    if (
      !isEditContract &&
      contractData.file &&
      !isValidFileType(contractData.file)
    ) {
      errors.file = "Invalid file type. Please upload a document or image.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidFileType = (file) => {
    // Get the file extension
    const extension = file.name.split(".").pop().toLowerCase();

    // Allowed document formats
    const allowedDocumentFormats = [
      "docx",
      "doc",
      "pdf",
      "txt",
      "rtf",
      "odt",
      "xlsx",
      "xls",
      "csv",
      "pptx",
      "ppt",
      "odp",
      "key",
    ];

    // Allowed image formats
    const allowedImageFormats = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "tif",
    ];

    // Check if the extension is in the allowed formats
    if (
      allowedDocumentFormats.includes(extension) ||
      allowedImageFormats.includes(extension)
    ) {
      return true;
    }

    return false;
  };

  const reset = () => {
    setContractData({
      id: "",
      code: "",
      vendor: "",
      property: "",
      monthlyRent: "",
      duration: "",
      numOfInstallment: "",
      startDate: "",
      expiryDate: "",
      paymentStartDate: "",
      status: "",
      file: null,
      frequency: "",
      remarks: "",
      created_at: "",
      updated_at: "",
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
      await editContract(contractData);
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
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
            onClick={() => {
              closeDialog();
              message.info("Operation canceled");
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
            <label className="block text-white text-sm font-semibold mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              placeholder="Code"
              value={contractData.code}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.code && (
              <p className="text-red-500 text-xs">{validationErrors.code}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Vendor
            </label>
            <select
              name="vendor"
              value={contractData.vendor}
              onChange={handleInputChange}
              className="select select-bordered w-full max-w-xs text-white responsive-input"
            >
              <option value="" disabled>
                Select Vendor
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            {validationErrors.vendor && (
              <p className="text-red-500 text-xs">{validationErrors.vendor}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Property
            </label>
            <select
              name="property"
              value={contractData.property}
              onChange={handleInputChange}
              className="select select-bordered w-full max-w-xs text-white responsive-input"
            >
              <option value="" disabled>
                Select Property
              </option>
              {propertyItems.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.description}
                </option>
              ))}
            </select>
            {validationErrors.property && (
              <p className="text-red-500 text-xs">
                {validationErrors.property}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Monthly Rent
            </label>
            <input
              type="text"
              name="monthlyRent"
              placeholder="Monthly Rent"
              value={contractData.monthlyRent}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.monthlyRent && (
              <p className="text-red-500 text-xs">
                {validationErrors.monthlyRent}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={contractData.duration}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.duration && (
              <p className="text-red-500 text-xs">
                {validationErrors.duration}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Installments
            </label>
            <input
              type="text"
              name="numOfInstallment"
              placeholder="Installments"
              value={contractData.numOfInstallment}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.numOfInstallment && (
              <p className="text-red-500 text-xs">
                {validationErrors.numOfInstallment}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Frequency
            </label>
            <input
              type="text"
              name="frequency"
              placeholder="Frequency"
              value={contractData.frequency}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.frequency && (
              <p className="text-red-500 text-xs">
                {validationErrors.frequency}
              </p>
            )}
          </div>
          <div className="mb-4">
            {!isEditContract && (
              <div className="upload-btn-wrapper">
                <label className="block text-white text-sm font-semibold mb-2">
                  Document
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
              </div>
            )}
            {validationErrors.file && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.file}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Payment Start Date
            </label>
            <input
              type="datetime-local"
              name="paymentStartDate"
              value={contractData.paymentStartDate}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.paymentStartDate && (
              <p className="text-red-500 text-xs">
                {validationErrors.paymentStartDate}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={contractData.startDate}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.startDate && (
              <p className="text-red-500 text-xs">
                {validationErrors.startDate}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Expiry Date
            </label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={contractData.expiryDate}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
            {validationErrors.expiryDate && (
              <p className="text-red-500 text-xs">
                {validationErrors.expiryDate}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-1">
              Remarks
            </label>
            <textarea
              type="text"
              name="remarks"
              placeholder="Remarks"
              value={contractData.remarks}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full max-w-xs text-white"
            />
            {validationErrors.remarks && (
              <p className="text-red-500 text-xs">{validationErrors.remarks}</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
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
                  message.info("Operation canceled");
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
