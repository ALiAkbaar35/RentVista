// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash,FaCalendarAlt  } from "react-icons/fa";
import AddContract from "./AddContract"; // Assuming you have an AddContract component
import { useContract } from "../../../contexts/ContractContext"; // Import ContractContext instead of PropertyContext
import AddButton from "../../../components/atoms/AddButton";
import ConfirmationDialog from "../../../components/atoms/ConfirmationDialog";
import "../../../App.css";

const Contract = () => {
  const { contracts, fetchContracts, deleteContract,getDocument,getSchedule,schedule,makeSchedule,deleteSchedule } = useContract(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedContract, setEditedContract] = useState(null);

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

  const handleContractAdded = () => {
    fetchContracts(); // Refetch data after adding a new Contract
    closeDialog();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditedContract(null);
  };

  const handleEdit = (contract) => {
    setEditedContract(contract);
    openDialog();
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
          fetchContracts();
        } catch (error) {
          console.error(error);
        }
      }
    );
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
                className="search w-full border  border-gray-300 rounded-lg text-black"
              />
              <AddButton onClick={openDialog} />
            </div>
          </div>
          
          <div className=" table-container-small" >
          <table className="w-full table">
          <thead
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
            {contracts.map((contract, index) => (
              <tr
                key={contract.$id}
                className={`text-center ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600 transition-colors duration-300 cursor-pointer`}
                style={{ marginBottom: "10px" }}
                onClick={() => handleSchedule(contract.$id)} // Make the entire row clickable
              >
                <td
                  className={`${
                    index === contracts.length - 1 ? "rounded-bl-lg" : ""
                  } px-2 py-2`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleEdit(contract);
                    }}
                    className="mr-1"
                    style={{ color: "yellow" }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDelete(contract.$id);
                    }}
                    className="mr-1"
                    style={{ color: "red" }}
                  >
                    <FaTrash />
                  </button>
                  <button
                      onClick={(e) => {
                      e.stopPropagation();
                      makeSchedule(contract)
                    }}
                      className="mr-1"
                      style={{ color: "white" }}
                      >
                        <FaCalendarAlt />
                      </button>
                </td>
                <td className="px-2 py-2">{contract.code}</td>
                <td className="px-2 py-2">{contract.vendor?.name ?? 'NA'}</td>
                <td className="px-2 py-2">{contract.properties?.name ?? 'NA'}</td>
                <td className="px-2 py-2">{contract.monthlyRent}</td>
                <td className="px-2 py-2">
                  {new Date(contract.expiryDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-2 py-2">{contract.Status}</td>
                <td
                  className={`${
                    index === contracts.length - 1 ? "rounded-br-lg" : ""
                  } px-2 py-2`}
                
                   onClick={(e) => {
                    e.stopPropagation(); 
                    getDocument(contract.agreement);
                  }}>
                  <button className="text-blue-500 underline">doc</button>

                </td>
              </tr>
            ))}
          </tbody>
           </table>
            </div>
            
        </div>
        <AddContract
          onContractAdded={handleContractAdded}
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
          editedContract={editedContract}
        />
        <ConfirmationDialog {...confirmationDialog} />
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
                }}
              >
                <tr>
                  <th className="rounded-tl-lg  px-2 py-2">
                    Actions
                  </th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Due_date</th>
                  <th className="px-2 py-2 rounded-tr-lg">Paid/Unpaid</th>
                  </tr>
                  
              </thead>
              <tbody>
                {schedule.map((scheduleItem, index) => (
                  <tr
                    key={scheduleItem.$id}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 transition-colors duration-300`}
                    style={{ marginBottom: "10px" }}
                  >
                    <td className={`${index === schedule.length - 1 ? 'rounded-bl-lg' : ''} px-2 py-2`}>
                      <button
                        onClick={() => deleteSchedule( scheduleItem)}
                        className="mr-2"
                        style={{ color: "red" }}
                      >
                        <FaTrash />
                      </button>
                    </td>
              
                    <td className="px-2 py-2">{scheduleItem.payment_amount ?? 'NA'}</td>
                    <td className="px-2 py-2">
                     {new Date(scheduleItem.next_payment_date ??'NA').toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}</td>
                    <td className={`${index === schedule.length - 1 ? 'rounded-br-lg' : ''} px-2 py-2`}>{scheduleItem.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </div>
      </div> 
      </div>
      </div>
    
  );
};

export default Contract;
