/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import AddSchedule from "./AddSchedule";
import AddContract from "./AddContract";
import { useContract } from "../../../contexts/ContractContext";
import AddButton from "../../../components/atoms/AddButton";
import ConfirmationDialog from "../../../components/atoms/ConfirmationDialog";
import { useProperty } from "../../../contexts/PropertyContext";
import { useVendor } from "../../../contexts/VendorContext";
import "../../../App.css";

const Contract = () => {
  const {
    contract_ids,
    contracts,
    fetchContracts,
    deleteContract,
    getDocument,
    getSchedule,
    schedule,
    makeSchedule,
    deleteSchedule,
  } = useContract();
  const [searchTerm, setSearchTerm] = useState("");
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [editedContract, setEditedContract] = useState(null);
  const [editedSchedule, setEditedSchedule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 8;
  const { propertyItems } = useProperty();
  const { vendors } = useVendor();

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
    fetchContracts();
  }, [fetchContracts]);
const openContractDialog = () => {
  setIsContractDialogOpen(true);
};

const closeContractDialog = () => {
  setIsContractDialogOpen(false);
      setEditedContract(null);

};

const openScheduleDialog = () => {
  setIsScheduleDialogOpen(true);
};

const closeScheduleDialog = () => {
  setIsScheduleDialogOpen(false);
    setEditedSchedule(null);

};



  const handleContractAdded = () => {
    fetchContracts();
    closeContractDialog();
  };
  const handleScheduleAdded = () => {
    fetchContracts();
    closeScheduleDialog();
  };
  const handleEdit = (contract) => {
    setEditedContract(contract);
    openContractDialog();
  };

  const editSchedule = (Schedule) => {
    setEditedSchedule(Schedule);
    openScheduleDialog();
  };
  const handleSchedule = async (id) => {
    await getSchedule(id);
  };

  const handleDelete = async (contractId) => {
    showConfirmationDialog(
      "Delete Contract",
      "Are you sure you want to delete this Contract?",
      closeConfirmationDialog,
      async () => {
        try {
          await deleteContract(contractId);
          closeConfirmationDialog();
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  // Pagination
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = contracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );
  const totalPages = Math.ceil(contracts.length / contractsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className=" overflow-auto ">
      <div className="flex items-center justify-center ">
        <div className="rounded-md shadow-md w-full  min-h-[31vh] h-full bg-slate-800 text-white">
          <div className="px-2 py-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="title">Contract List</h2>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search w-full border border-gray-300 rounded-lg text-white"
                />
                <AddButton onClick={openContractDialog} />
              </div>
            </div>

            <div className=" table-container-small">
              <table className="w-full table">
                <thead
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderBottom: "1px solid #ccc",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th className="rounded-tl-lg  px-2 py-2">Actions</th>
                    <th className="px-2 py-2">Code</th>
                    <th className="px-2 py-2">Vendor</th>
                    <th className="px-2 py-2">Property</th>
                    <th className="px-2 py-2">MonthlyRent</th>
                    <th className="px-2 py-2">ExpiryDate</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="rounded-tr-lg  px-2 py-2">Agreement</th>
                  </tr>
                </thead>
                <tbody>
                  {currentContracts.map((contract, index) => (
                    <tr
                      key={contract.id}
                      className={`text-center ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      } hover:bg-gray-600 transition-colors duration-300 cursor-pointer`}
                      style={{ marginBottom: "10px" }}
                      onClick={() => handleSchedule(contract.id)}
                    >
                      <td
                        className={`${
                          index === contracts.length - 1 ? "rounded-bl-lg" : ""
                        } px-4 py-3`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(contract);
                          }}
                          className="mr-1"
                          style={{ color: "yellow" }}
                        >
                          <FaEdit />
                        </button>
                        {contract_ids.every(
                          (item) => item.rent_contract_id !== contract.id
                        ) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              makeSchedule(contract);
                            }}
                            className="mr-1"
                            style={{ color: "white" }}
                          >
                            <FaCalendarAlt />
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">{contract.agreement}</td>
                      <td className="px-4 py-3">
                        {vendors.find((ven) => ven.id === contract.vendor_id)
                          ?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        {propertyItems.find(
                          (prop) => prop.id === contract.property_id
                        )?.description || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        {contract.monthly_installment}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(contract.expiry_date).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">{contract.status}</td>
                      <td
                        className={`${
                          index === contracts.length - 1 ? "rounded-br-lg" : ""
                        } px-4 py-3`}
                        onClick={(e) => {
                          e.stopPropagation();
                          getDocument(contract.file_path);
                        }}
                      >
                        <button className="text-blue-500 underline">
                          {contract.file_path ? (
                            <a href={contract.file_path}>doc</a>
                          ) : (
                            "null"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="join pagination flex justify-end">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="join-item btn"
              >
                «
              </button>
              <button className="join-item btn">
                Page {currentPage} of {totalPages}
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastContract >= contracts.length}
                className="join-item btn"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex  items-center mt-5 justify-center ">
        <div className="rounded-md shadow-md w-full min-h-[31vh] h-full bg-slate-800 text-white">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center ">
              <h2 className="title">Schedule</h2>
            </div>

            <div className=" table-container-small">
              <table className="w-full table">
                <thead
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderBottom: "1px solid #ccc",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th className="rounded-tl-lg  px-4 py-3">Actions</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Due_date</th>
                    <th className="px-4 py-3 rounded-tr-lg">Paid/Unpaid</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((scheduleItem, index) => (
                    <tr
                      key={scheduleItem.id}
                      className={`text-center ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      } hover:bg-gray-600 transition-colors duration-300`}
                      style={{ marginBottom: "10px" }}
                    >
                      <td
                        className={`${
                          index === schedule.length - 1 ? "rounded-bl-lg" : ""
                        } px-4 py-3`}
                      >
                        <button
                          onClick={() => editSchedule(scheduleItem)}
                          className="mr-1"
                          style={{ color: "yellow" }}
                        >
                          <FaEdit />
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        {scheduleItem.payment_amount ?? "NA"}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(
                          scheduleItem.next_payment_date ?? "NA"
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                      <td
                        className={`${
                          index === schedule.length - 1 ? "rounded-br-lg" : ""
                        } px-2 py-2`}
                      >
                        {scheduleItem.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddContract
        onContractAdded={handleContractAdded}
        isDialogOpen={isContractDialogOpen}
        closeDialog={closeContractDialog}
        editedContract={editedContract}
      />

      <AddSchedule
        onScheduleAdded={handleScheduleAdded}
        isDialogOpen={isScheduleDialogOpen}
        closeDialog={closeScheduleDialog}
        editedSchedule={editedSchedule}
      />

      <ConfirmationDialog {...confirmationDialog} />
    </div>
  );
};

export default Contract;
