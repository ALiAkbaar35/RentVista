/* eslint-disable no-unused-vars */
// ContractContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./authContext";
import { message } from "antd";

const ContractContext = createContext();

// eslint-disable-next-line react/prop-types
export const ContractProvider = ({ children }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [contract_ids, setContract_ids] = useState([]);

  const getUserId = () => {
    return user.id;
  };

  const fetchContracts = async () => {
    const apiUrl = `http://localhost:5050/contracts_re`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      } else {
        console.error("Error fetching data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSchedule = async () => {
    const apiUrl = `http://localhost:5050/Schedule_re`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
          const data = await response.json();
          setContract_ids(data);
      } else {
        console.error("Error fetching data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addContract = async (contractItemData) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    contractItemData.created_at = currentDate;
    contractItemData.updated_at = currentDate;
    contractItemData.status = "Pending";
    contractItemData.vendor = parseInt(contractItemData.vendor);
    contractItemData.property = parseInt(contractItemData.property);
    const formData = new FormData();
    formData.append("file", contractItemData.file);

    try {
      // First, upload the file

      const fileResponse = await fetch("http://localhost:5050/upload", {
        method: "POST",
        body: formData,
      });
      if (!fileResponse.ok) {
        throw new Error("Failed to upload file");
      } else {
        const responseData = await fileResponse.json();

        console.log("file path", responseData);

        // File uploaded successfully, now prepare contract data
        const contractData = {
          ...contractItemData,
          file: responseData.filePath,
        };

        const contractApiUrl = "http://localhost:5050/contracts_wr";
        const contractResponse = await fetch(contractApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contractData),
        });

        if (contractResponse.ok) {
          const responseData = await contractResponse.json();
          // Handle success response as needed
          console.log(responseData);
        } else {
          throw new Error("Failed to create contract");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error as needed
    }
  };

  const editContract = async (updatedData) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    updatedData.updated_at = currentDate;
    updatedData.vendor = parseInt(updatedData.vendor);
    updatedData.property = parseInt(updatedData.property);

    try {
      const apiUrl = `http://localhost:5050/contracts_up`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.error) {
          message.error(responseData.error);
        } else {
          message.success("Contract item edited successfully");
          await deleteSchedule(updatedData.id);
          await makeSchedule(updatedData);
          await fetchContracts();
          await getSchedule(updatedData.id);
        }
      } else {
        const error = await response.text();
        console.log("Error updating contract:", error); // Corrected log message
        message.error("Error updating contract. Please try again."); // Corrected error message
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      message.error("Error updating contract. Please try again.");
    }
  };


  const deleteContract = async (contractItemId) => {
    try {
      const apiUrl = `http://localhost:5050/contracts_del/${contractItemId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.error) {
          message.error(responseData.error);
        } else {
          message.success("Contract item deleted successfully");
          fetchContracts();
        }
      } else {
        const error = await response.text();
        console.log("Error deleting contract:", error);
        message.error("Error deleting contract. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      message.error("Error deleting contract. Please try again.");
    }
  };

  const getDocument = async (file) => {
    try {
      const apiUrl = `http://localhost:5050/download/${file}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.error) {
          throw new Error(responseData.error);
        } else {
          message.success("File download successfully");
        }
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Error download file:", error);
      message.error("Error download file. Please try again.");
    }
  };

  const getSchedule = async (id) => {
    try {
      const apiUrl = `http://localhost:5050/Schedule/${id}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const makeSchedule = async (contract) => {
    
      let loop =
      contract.duration / (contract.frequent_of_payment || contract.frequency);
    console.log(loop);
      for (let i = 0; i < loop; i++) {
          const scheduleData = {
            contract_id: contract.id,
            agreement: contract.agreement || contract.code,
            next_payment_date: new Date(
              new Date(
                contract.payment_start_date || contract.paymentStartDate
              ).setMonth(new Date(contract.payment_start_date || contract.paymentStartDate).getMonth() + i)
            )
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            payment_amount: contract.monthly_installment || contract.monthlyRent,
            status: contract.status||"Pending",
            created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
            updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          };
          console.log("scheduleData"[i], scheduleData);
          try {
            const apiUrl = `http://localhost:5050/schedules_wr`;
            const response = await fetch(apiUrl, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(scheduleData),
            });
            fetchSchedule();
            }catch (error) {
                console.error("Error fetching data:", error);
                throw error; 
            }
        }
      
  };

 const editSchedule = async (scheduleData) => {
     console.log("scheduleItemData", scheduleData);
     scheduleData.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
     scheduleData.next_payment_date = new Date(scheduleData.next_payment_date).toISOString().slice(0, 19).replace("T", " ");
      console.log("scheduleItemData", scheduleData);  
        try {
         const apiUrl = `http://localhost:5050/schedules_up`;
         const response = await fetch(apiUrl, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(scheduleData),
         });
 
         if (response.ok) {
           const responseData = await response.json();
           if (responseData.error) {
             message.error(responseData.error);
           } else {
             message.success("Schedule item edited successfully");
            await getSchedule(scheduleData.rent_contract_id);
           }
         } else {
           const error = await response.text();
           console.log("Error updating Schedule:", error);
          message.error("Error updating Schedule. Please try again.");
         }
       } catch (error) {
         console.error("Error updating Schedule:", error);
         message.error("Error updating Schedule. Please try again.");
       }
  }
 
  const deleteSchedule = async (ScheduleId) => {
    try {
      const apiUrl = `http://localhost:5050/schedules_del/${ScheduleId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.error) {
          message.error(responseData.error);
        } else {
          message.success("ScheduleId item deleted successfully");
          fetchSchedule();
        }
      } else {
        const error = await response.text();
        console.log("Error deleting ScheduleId:", error);
        message.error("Error deleting ScheduleId. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting ScheduleId:", error);
      message.error("Error deleting ScheduleId. Please try again.");
    }
  };

  useEffect(() => {
      fetchContracts();
      fetchSchedule();
  }, []);

  const context = {
    contracts,
    schedule,
    contract_ids,
    fetchContracts,
    addContract,
    editContract,
    deleteContract,
    getDocument,
    getSchedule,
    makeSchedule,
    deleteSchedule,
    editSchedule,
  };

  return (
    <ContractContext.Provider value={context}>
      {children}
    </ContractContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useContract = () => useContext(ContractContext);

export default ContractContext;
