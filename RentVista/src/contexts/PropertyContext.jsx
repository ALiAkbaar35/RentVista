/* eslint-disable no-unused-vars */
// PropertyContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./authContext";
import { message } from "antd";

const PropertyContext = createContext();

// eslint-disable-next-line react/prop-types
export const PropertyProvider = ({ children }) => {
    const date = new Date();
    let id;
    const { user } = useAuth();
    let userId;
    if (user) {
        userId = user.id ;
    }

    const getUserId = () => {
        return userId;
    };

    const [propertyItems, setPropertyItems] = useState([]);

    const fetchData = async () => {
       
     const apiUrl = `http://localhost:5050/properties_re`;
     fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setPropertyItems(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
    };

  const createPropertyItem = async (propertyItemData) => {
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      propertyItemData.created_at = currentDate;
      propertyItemData.updated_at = currentDate;
  
      try {
          const apiUrl = `http://localhost:5050/properties_wr`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(propertyItemData)
          });
  
          if (response.ok) {
              const responseData = await response.json();
            if (responseData.error) {
                message.error(responseData.error);
            }
            else {
                message.success("Property item created successfully");
                fetchData();
            }
          } else {
              const error = await response.text();
              console.log("Error creating property:", error);
              message.error("Error creating property. Please try again.");
          }
      } catch (error) {
          console.error("Error creating property:", error);
          message.error("Error creating property. Please try again.");
      }
  };

    const editPropertyItem = async (updatedData) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updatedData.updated_at = currentDate;

    try {
        const apiUrl = `http://localhost:5050/properties_up`;
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
            } else {
                fetchData();
                message.success("Property item updated successfully");
            }
        } else {
            const error = await response.text();
            console.log("Error updating property:", error);
            message.error("Error updating property. Please try again.");
        }
    } catch (error) {
        console.error("Error updating property:", error);
        message.error("Error updating property. Please try again.");
    }
};


const deletePropertyItem = async (propertyItemId) => {
    try {
        const apiUrl = `http://localhost:5050/properties_del/${propertyItemId}`; // Include propertyItemId in the URL
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
                message.success("Property item deleted successfully");
                fetchData();
            }
            
        } else {
            const error = await response.text();
            console.log("Error deleting property item:", error);
            message.error("Error deleting property item. Please try again.");
        }
    } catch (error) {
        console.error("Error deleting property item:", error);
        message.error("Error deleting property item. Please try again.");
    }
};

    useEffect(() => {
        fetchData();
    }, [user]);

    const contextData = {
        propertyItems,
        fetchData,
        editPropertyItem,
        deletePropertyItem,
        createPropertyItem,
    };

    return (
        <PropertyContext.Provider value={contextData}>
            
            {children}
        </PropertyContext.Provider>
    );
};

export const useProperty = () => useContext(PropertyContext);

export default PropertyContext;
