/* eslint-disable no-unused-vars */
// DepartmentContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./authContext";
import { message } from "antd";

const DepartmentContext = createContext();

// eslint-disable-next-line react/prop-types
export const DepartmentProvider = ({ children }) => {
    let id;
    let userId;
    const { user } = useAuth();
    const date = new Date();
    if (user) {
        userId = user.id ;
    }

    const getUserId = () => {
        return userId;
    };

    const [departmentItems, setDepartmentItems] = useState([]);

    const fetchData = async () => {
       
     const apiUrl = `http://localhost:5050/departments_re`;
     fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setDepartmentItems(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
    };

  const createDepartmentItem = async (departmentItemData) => {
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      departmentItemData.created_at = currentDate;
      departmentItemData.updated_at = currentDate;
  
      try {
          const apiUrl = `http://localhost:5050/departments_wr`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(departmentItemData)
          });
  
          if (response.ok) {
              const responseData = await response.json();
            if (responseData.error) {
                message.error(responseData.error);
            }
            else {
                message.success("Department item created successfully");
                fetchData();
            }
          } else {
              const error = await response.text();
              console.log("Error creating department:", error);
              message.error("Error creating department. Please try again.");
          }
      } catch (error) {
          console.error("Error creating department:", error);
          message.error("Error creating department. Please try again.");
      }
  };

    const editDepartmentItem = async (updatedData) => {
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        updatedData.updated_at = currentDate;
           try {
          const apiUrl = `http://localhost:5050/departments_up`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedData)
          });
  
          if (response.ok) {
              const responseData = await response.json();
            if (responseData.error) {
                message.error(responseData.error);
            }
            else {
                
                message.success("Department item edited successfully");
                fetchData();
            }
          } else {
              const error = await response.text();
              console.log("Error updated department:", error);
              message.error("Error updated department. Please try again.");
          }
      } catch (error) {
          console.error("Error updated department:", error);
          message.error("Error updated department. Please try again.");
      }    
    };

    const deleteDocument = async (departmentItemId) => {
        try {
            const apiUrl = `http://localhost:5050/departments_del/${departmentItemId}`; // Include departmentItemId in the URL
            const response = await fetch(apiUrl, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
            const responseData = await response.json();
            if (responseData.error) {
                message.error(responseData.error);
            }
            else {
                message.success("Department item deleted successfully");
                fetchData();
            }
            } else {
                const error = await response.text();
                console.log("Error deleting department item:", error);
                message.error("Error deleting department item. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting department item:", error);
            message.error("Error deleting department item. Please try again.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const contextData = {
        departmentItems,
        fetchData,
        editDepartmentItem,
        deleteDocument,
        createDepartmentItem,
    };

    return (
        <DepartmentContext.Provider value={contextData}>
            
            {children}
        </DepartmentContext.Provider>
    );
};

export const useDepartment = () => useContext(DepartmentContext);

export default DepartmentContext;
