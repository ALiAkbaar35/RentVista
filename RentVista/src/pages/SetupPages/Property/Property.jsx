// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddProperty from "./AddProperty"; // Assuming you have an AddProperty component
import { useProperty } from "../../../contexts/PropertyContext"; // Import PropertyContext instead of UnitContext
import AddButton from "../../../components/atoms/AddButton";
import ConfirmationDialog from "../../../components/atoms/ConfirmationDialog";
import "../../../App.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Property = () => {
  const { propertyItems, fetchData, deletePropertyItem } = useProperty(); // Use PropertyContext functions
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedPropertyItem, setEditedPropertyItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyItemsPerPage] = useState(8); // Rows per page
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

  const handlePropertyItemAdded = () => {
    fetchData(); // Refetch data after adding a new Property item
    closeDialog();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditedPropertyItem(null);
  };

  const handleEdit = (propertyItem) => {
    setEditedPropertyItem(propertyItem);
    openDialog();
  };

  const handleDelete = async (propertyItemId) => {
    showConfirmationDialog(
      "Delete Property Item",
      "Are you sure you want to delete this Property item?",
      closeConfirmationDialog,
      async () => {
        try {
          await deletePropertyItem(propertyItemId); 
          closeConfirmationDialog();
          fetchData();
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  const filterPropertyItemsBySearchTerm = (propertyItem) => {
    const searchValue = searchTerm.toLowerCase();
    const propertyItemData = Object.values(propertyItem).join(" ").toLowerCase();
    return propertyItemData.includes(searchValue);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalEntities = propertyItems.length;

  const filteredPropertyItems = searchTerm
    ? propertyItems.filter(filterPropertyItemsBySearchTerm)
    : propertyItems;

  const indexOfLastPropertyItem = currentPage * propertyItemsPerPage;
  const indexOfFirstPropertyItem = indexOfLastPropertyItem - propertyItemsPerPage;
  const currentPropertyItems = filteredPropertyItems.slice(
    indexOfFirstPropertyItem,
    indexOfLastPropertyItem
  );

  return (
    <div className="flex overflow-auto items-center justify-center full-container">
      <div className="rounded-md shadow-md w-full min-h-[60vh] h-full bg-slate-800 text-white">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="title">Property List</h2>
            <div className="flex items-center">
              <label className="input input-bordered flex items-center gap-2 mr-2">
                <input type="text" className="grow" placeholder="Search By Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70 m"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
              <AddButton onClick={openDialog} />
            </div>
          </div>
          <div className="overflow-x-auto table-container">
            <table className="w-full table">
              <thead
                  style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderBottom: "1px solid #ccc",
                  color: "#fff",
                }}
              >
                <tr>
                  <th className="rounded-tl-lg px-4 py-3">
                    Actions
                  </th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">created_at</th>
                  <th className="rounded-tr-lg  px-4 py-3">
                    Updated_at
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPropertyItems.map((propertyItem, index) => (
                  <tr
                    key={propertyItem.$id}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 transition-colors duration-300`}
                    style={{ marginBottom: "10px" }}
                  >
                      <td
                    className={`${
                      index === currentPropertyItems.length - 1 ? "rounded-bl-lg" : ""
                    } px-2 py-2`}
                  >
                      <button
                        onClick={() => handleEdit(propertyItem)}
                        className="mr-2"
                        style={{ color: "yellow" }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(propertyItem.id)}
                        className="mr-2"
                        style={{ color: "red" }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td className="px-2 py-2">{propertyItem.code}</td>
                    <td className="px-2 py-2">{propertyItem.department_id}</td>
                    <td className="px-2 py-2">{propertyItem.description}</td>
                    <td className="px-2 py-2">{propertyItem.address}</td>
                    <td className="px-2 py-2">
                      {new Date(propertyItem.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td
                        className={`${
                          index === currentPropertyItems.length - 1 ? "rounded-br-lg" : ""
                        } px-2 py-2`}
                      >
                      {new Date(propertyItem.updated_at).toLocaleString("en-US", {
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
              <span className=' ml-1 mr-1'>{indexOfFirstPropertyItem + 1}</span>
              to
              <span className=' ml-1 mr-1'>{Math.min(indexOfLastPropertyItem, totalEntities)}</span>
              of
              <span className='ml-1 mr-1'> {totalEntities}</span>
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
            disabled={indexOfLastPropertyItem >= totalEntities}
            className="join-item btn"
          >
            »
          </button>
        </div>
          
        </div>
        <AddProperty
          onPropertyItemAdded={handlePropertyItemAdded}
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
          editedPropertyItem={editedPropertyItem}
        />
        <ConfirmationDialog {...confirmationDialog} />
      </div>
    </div>
  );
};

export default Property;
