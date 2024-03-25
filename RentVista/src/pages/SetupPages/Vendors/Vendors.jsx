// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddVendors from "./AddVendors";
import { useVendor } from "../../../contexts/VendorContext";
import "../../../App.css"; // Import the CSS file for styling
import AddButton from "../../../components/atoms/AddButton";
import ConfirmationDialog from "../../../components/atoms/ConfirmationDialog";
import "../../../App.css";

const Vendors = () => {
  const { vendors, fetchData, deleteVendor } = useVendor();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedVendor, setEditedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage] = useState(8);
    const [confirmationDialog, setConfirmationDialog] = useState({
      isOpen: false,
      title: "",
      message: "",
      onCancel: null,
      onConfirm: null,
    });

    const showConfirmationDialog = (title, message, onCancel, onConfirm) => {
      setConfirmationDialog({
        isOpen: true,
        title,
        message,
        onCancel,
        onConfirm,
      });
    };

    const closeConfirmationDialog = () => {
      setConfirmationDialog({
        isOpen: false,
        title: "",
        message: "",
        onCancel: null,
        onConfirm: null,
      });
    };



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVendorAdded = () => {
    fetchData();
    closeDialog();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditedVendor(null);
  };

  const handleEdit = (vendor) => {    

    setEditedVendor(vendor);
    openDialog();
    closeConfirmationDialog();
    fetchData();



  };

  const handleDelete = async (vendorId) => {
    showConfirmationDialog(
      "Delete Vendor",
      "Are you sure you want to delete this vendor?",
      closeConfirmationDialog,
      async () => {
        try {
          await deleteVendor(vendorId);
          fetchData();
          closeConfirmationDialog();
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  const filterVendorsBySearchTerm = (vendor) => {
    const searchValue = searchTerm.toLowerCase();
    const vendorData = Object.values(vendor).join(" ").toLowerCase();
    return vendorData.includes(searchValue);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalEntities = vendors.length;

  const filteredVendors = searchTerm
    ? vendors.filter(filterVendorsBySearchTerm)
    : vendors;

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  return (
    <div className=" items-center justify-center full-container">
    <div className=" rounded-md shadow-md w-full min-h-[60vh] h-full bg-slate-800 text-white">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="title">Vendor List</h2>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search w-full border border-gray-300 rounded-lg text-white"
              />
              <AddButton onClick={openDialog} />
            </div>
          </div>
          <div className="overflow-x-auto table-container">
          <table
            className="w-full table"
          >
              <thead
                  style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderBottom: "1px solid #ccc",
                  color: "#fff",
                }}
              >
                <tr>
                  <th className="rounded-tl-lg  px-4 py-3">
                    Actions
                  </th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">creditlimit</th>
                  <th className="px-4 py-3">created_at</th>
                  <th className="rounded-tr-lg  px-4 py-3">
                    updated_at
                  </th>
                </tr>
               </thead>
               <tbody>
                {currentVendors.map((vendor, index) => (
                  <tr
                    key={vendor.id}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 transition-colors duration-300`}
                    style={{ marginBottom: "10px" }}
                  >
                    <td
                    className={`${
                      index === currentVendors.length - 1 ? "rounded-bl-lg" : ""
                    } px-2 py-2`}
                  >
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="mr-2"
                        style={{ color: "yellow" }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="mr-2"
                        style={{ color: "red" }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td className="px-2 py-2">{vendor.code}</td>
                    <td className="px-2 py-2">{vendor.name}</td>
                    <td className="px-2 py-2">{vendor.phone}</td>
                    <td className="px-2 py-2">{vendor.address}</td>
                    <td className="px-2 py-2">{vendor.creditlimit}</td>
                    <td className=" px-2 py-2">
                      {new Date(vendor.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td
                  className={`${
                    index === currentVendors.length - 1 ? "rounded-br-lg" : ""
                  } px-2 py-2`}
                >
                      {new Date(vendor.updated_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
               </tbody>
            </table>
          </div>
          <div className="pagination-text">
          <p className='text-sm text-white pagination-text'>
            Showing
            <span className=' ml-1 mr-1'>{indexOfFirstVendor+ 1}</span>
            to
            <span className=' ml-1 mr-1'>{Math.min(indexOfLastVendor, totalEntities)} </span>
            of
            <span className='ml-1 mr-1'> {totalEntities} </span>
            results
          </p>
        </div> 
        <div className="join pagination flex justify-end">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="join-item btn"
          >
            «
          </button>
          <button className="join-item btn">Page {currentPage}</button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastVendor >= totalEntities}
            className="join-item btn"
          >
            »
          </button>
        </div>
        </div>
        <AddVendors
          onVendorAdded={handleVendorAdded}
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
          editedVendor={editedVendor}
        />
        <ConfirmationDialog {...confirmationDialog} />
      </div>
    </div>
  );
};

export default Vendors;
