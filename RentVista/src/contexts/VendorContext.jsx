/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./authContext";
import { message } from "antd";

const VendorContext = createContext();

// eslint-disable-next-line react/prop-types
export const VendorProvider = ({ children }) => {
    const date = new Date();
    const [vendors, setVendors] = useState([]);
    const currentDate = date.toISOString();
    const { user } = useAuth();

    const getUserId = () => {
        const userId = user.id || user.id;
        return userId;
    };

    const fetchData = async () => {
       const apiUrl = `http://localhost:5050/vendors_re`;
       fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setVendors(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
     
    };

    const createVendor = async (vendorData) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    vendorData.created_at = currentDate;
    vendorData.updated_at = currentDate;

    try {
        const apiUrl = `http://localhost:5050/vendors_wr`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vendorData)
        });

        if (response.ok) {
            const responseData = await response.json();
            if (responseData.error) {
                message.error(responseData.error);
            } else {
                message.success("Vendor item created successfully");
                fetchData();
            }
        } else {
            const error = await response.text();
            console.log("Error creating vendor:", error);
            message.error("Error creating vendor. Please try again.");
        }
    } catch (error) {
        console.error("Error creating vendor:", error);
        message.error("Error creating vendor. Please try again.");
    }
};
  

    const editVendor = async (vendorId, updatedData) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updatedData.updated_at = currentDate;

    try {
        const apiUrl = `http://localhost:5050/vendors_up`;
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
                message.success("Vendor item updated successfully");
            }
        } else {
            const error = await response.text();
            console.log("Error updating vendor:", error);
            message.error("Error updating vendor. Please try again.");
        }
    } catch (error) {
        console.error("Error updating vendor:", error);
        message.error("Error updating vendor. Please try again.");
    }
    };

    const deleteVendor  = async (vendorItemId) => {
    try {
        const apiUrl = `http://localhost:5050/vendors_del/${vendorItemId}`; // Include vendorItemId in the URL
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
            } else {
                message.success("Vendor item deleted successfully");
                fetchData();
            }
            
        } else {
            const error = await response.text();
            console.log("Error deleting vendor item:", error);
            message.error("Error deleting vendor item. Please try again.");
        }
    } catch (error) {
        console.error("Error deleting vendor item:", error);
        message.error("Error deleting vendor item. Please try again.");
    }
};

    useEffect(() => {
        fetchData();
    }, []); // Add an empty dependency array to execute only once

    const contextData = {
        vendors,
        fetchData,
        editVendor,
        deleteVendor,
        createVendor,
    };

    return (
        <VendorContext.Provider value={contextData}>
            {children}
        </VendorContext.Provider>
    );
};

export const useVendor = () => useContext(VendorContext);

export default VendorContext;
