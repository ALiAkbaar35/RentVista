import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddDepartment from "./AddDepartment"; // Assuming you have an AddDepartment component
import { useDepartment } from "../../../contexts/DepartmentContext"; // Import DepartmentContext instead of UnitContext
import AddButton from "../../../components/atoms/AddButton";
import ConfirmationDialog from "../../../components/atoms/ConfirmationDialog";
import "../../../App.css";

const Department = () => {
  const { departmentItems, fetchData, deleteDocument } = useDepartment(); // Use DepartmentContext functions
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedDepartmentItem, setEditedDepartmentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentItemsPerPage] = useState(8); // Rows per page
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

  const handleDepartmentItemAdded = () => {
    fetchData(); // Refetch data after adding a new Department item
    closeDialog();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditedDepartmentItem(null);
  };

  const handleEdit = (departmentItem) => {
    setEditedDepartmentItem(departmentItem);
    openDialog();
  };
  
  const handleDelete = async (departmentItemId) => {
    showConfirmationDialog(
      "Delete Department Item",
      "Are you sure you want to delete this Department item?",
      closeConfirmationDialog,
      async () => {
        try {
          await deleteDocument(departmentItemId); // Use the deleteDocument function from DepartmentContext
          closeConfirmationDialog();
          fetchData();
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

const filterDepartmentItemsBySearchTerm = (departmentItem) => {
  const searchValue = searchTerm.toLowerCase();
  const departmentItemCode = departmentItem.code.toLowerCase();
  return departmentItemCode.includes(searchValue);
};


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalEntities = departmentItems.length;

  const filteredDepartmentItems = searchTerm
    ? departmentItems.filter(filterDepartmentItemsBySearchTerm)
    : departmentItems;

  const indexOfLastDepartmentItem = currentPage * departmentItemsPerPage;
  const indexOfFirstDepartmentItem = indexOfLastDepartmentItem - departmentItemsPerPage;
  const currentDepartmentItems = filteredDepartmentItems.slice(
    indexOfFirstDepartmentItem,
    indexOfLastDepartmentItem
  );

  return (
    <div className="flex overflow-auto items-center justify-center full-container">
      <div className="rounded-md shadow-md w-full min-h-[60vh] h-full bg-slate-800 text-white">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="title">Department List</h2>
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
                  <th className="rounded-tl-lg  px-4 py-3">
                    Actions
                  </th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">created_at</th>
                  <th className="rounded-tr-lg px-4 py-3">
                    updated_at
                  </th>
                </tr>
              </thead>
             {currentDepartmentItems.map((departmentItem, index) => (
              <tr
                key={departmentItem.$id}
                className={`text-center ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600 transition-colors duration-300`}
                style={{ marginBottom: "10px" }}
              >
                <td
                  className={`${
                    index === currentDepartmentItems.length - 1 ? "rounded-bl-lg" : ""
                  } px-2 py-2`}
                  >
                  <button
                    onClick={() => handleEdit(departmentItem)}
                    className="mr-2"
                    style={{ color: "yellow" }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(departmentItem.id)}
                    className="mr-2"
                    style={{ color: "red" }}
                  >
                    <FaTrash />
                  </button>
                </td>
                <td className="px-2 py-2">{departmentItem.code}</td>
                <td className="px-2 py-2">{departmentItem.description}</td>
                <td className="px-2 py-2">
                  {new Date(departmentItem.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td
                  className={`${
                    index === currentDepartmentItems.length - 1 ? "rounded-br-lg" : ""
                  } px-2 py-2`}
                >
                  {new Date(departmentItem.updated_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
              </tr>
            ))}

            </table>
          </div>
          <div className="pagination-text">
            <p className='text-sm text-white pagination-text'>
              Showing
              <span className=' ml-1 mr-1'>{indexOfFirstDepartmentItem + 1}</span>
              to
              <span className=' ml-1 mr-1'>{Math.min(indexOfLastDepartmentItem, totalEntities)}</span>
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
            disabled={indexOfLastDepartmentItem >= totalEntities}
            className="join-item btn"
          >
            »
          </button>
        </div>

        </div>
        <AddDepartment
          onDepartmentItemAdded={handleDepartmentItemAdded}
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
          editedDepartmentItem={editedDepartmentItem}
        />
        <ConfirmationDialog {...confirmationDialog} />
      </div>
    </div>
  );
};

export default Department;
