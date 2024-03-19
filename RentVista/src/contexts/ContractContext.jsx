// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line no-unused-vars
import { createContext, useState, useEffect, useContext } from "react";
import { database, Database, Department, Property, vendordb,migration_db,role_db,Contract_db,Schedule_db } from "../configs/appwriteConfig";
import { useAuth } from "./authContext";
import { message} from 'antd';
import { saveAs } from 'file-saver';
import { Query } from "appwrite";
const ContractContext = createContext();

// eslint-disable-next-line react/prop-types
export const ContractProvider = ({ children }) => {
  const { user } = useAuth();
  let userId;
  let id;
  let docId;
  let ids;
  let idsString = "";
  let vendorId;
  let vendorIds;
  let vendorString = "";
  let propId;
  let propIds;
  let propString = "";

  if (user) {
    userId = user.id || user.$id;
  }

  const getUserId = () => {
    return userId;
  };

  const departments = async (departmentItemData) => {
    let userId = getUserId();
    const totalItems = departmentItemData.length;
    let fileContent = "ID\tCode\t\tName\t\t\t\terror\n\n"; 

    for (let i = 0; i < totalItems; i++) {
        id = 123456789111111;
        docId = departmentItemData[i].id;
        ids = docId + id;
        idsString = ids.toString();

      try {
        await database.createDocument(Database, Department, idsString, {
          name: departmentItemData[i].description,
          code: departmentItemData[i].code,
          users: userId,
          date: departmentItemData[i].created_at,
          updated_date: departmentItemData[i].updated_at,
        });
          message.success("Department " + departmentItemData[i].id + " added successfully");
      } catch (error) {
        if (error.code === 409) {
          message.error("Department name or code already exists");
          fileContent += `${departmentItemData[i].id}\t${departmentItemData[i].code}\t\t${departmentItemData[i].description}\t\t\t${error.message}\n`;

        } else {
          message.error("Failed to add department item");
          console.error("Error creating department item:", error);
          fileContent += `${departmentItemData[i].id}\t${departmentItemData[i].code}\t\t${departmentItemData[i].description}\t\t\t${error.message}\n`;

        }
      }
    }
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'departments_data.txt');
  };

  const vendors = async (vendor) => {
    let userId = getUserId();
    const totalItems = 113;
    let fileContent = "Index\tID\tCode\t\tName\t\t\t\terror\n\n"; 
   console.log("here");
      const response = await database.listDocuments(
        Database, vendordb,
        
      );
      console.log("response", response);
    for (let i = 111; i < totalItems; i++) {
        id = 123456789111111;
        docId = vendor[i].id;
        ids = docId + id;
        idsString = ids.toString();
      //  console.log(vendor[i].name)
      //  vendor[i].name = vendor[i].name + "-1";
      //  console.log(vendor[i].name)
      //  console.log(vendor[i].code)
      //  vendor[i].code = vendor[i].code + "-1";
      //  console.log(vendor[i].code)
      try {
        await database.createDocument(Database, vendordb, idsString, {
          name: vendor[i].name,
          code: vendor[i].code,
          address: vendor[i].address,
          phone: vendor[i].phone,
          creditlimit: vendor[i].creditlimit,
          users: userId,
          date: vendor[i].created_at,
          updated_date: vendor[i].updated_at,
        });
        message.success("Vendor " + vendor[i].id + " added successfully");

      } catch (error) {
        if (error.code === 409) {
          message.error("Vendor name or code already exists");
          fileContent += `${i}\t${vendor[i].id}\t${vendor[i].code}\t\t${vendor[i].name}\t\t\t${error.message}\n`;
        } else {
          message.error("Failed to add vendor item");
          console.error("Error creating vendor item:", error);
          fileContent += `${i}\t${vendor[i].id}\t${vendor[i].code}\t\t${vendor[i].name}\t\t\t${error.message}\n`;
        }
      }
    }
     const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
     saveAs(blob, 'vendors_data.txt');
  };

  const properties = async (propertiesItemData) => {
    let userId = getUserId();
    const totalItems = 75;
    let fileContent = "Index\tID\tCode\t\tName\t\t\t\terror\n\n"; 

    for (let i = 74; i < totalItems; i++) {
       id = 123456789111111;
       docId = propertiesItemData[i].department_id;
       propId=propertiesItemData[i].id;
       ids = docId + id;
       propIds = propId + id;
       idsString = ids.toString();
       propString = propIds.toString();
       console.log(propertiesItemData[i].description)
       propertiesItemData[i].description = propertiesItemData[i].description + "-1";
       console.log(propertiesItemData[i].description)
      //  console.log(propertiesItemData[i].code)
      //  propertiesItemData[i].code = propertiesItemData[i].code + "-1";
      //  console.log(propertiesItemData[i].code)

      try {
        await database.createDocument(Database, Property, propString, {
          name: propertiesItemData[i].description,
          code: propertiesItemData[i].code,
          department: idsString,
          users: userId,
          date: propertiesItemData[i].created_at,
          updated_date: propertiesItemData[i].updated_at,
          address: propertiesItemData[i].address,
        });
        message.success("Property " + propertiesItemData[i].id + " added successfully");

      } catch (error) {
        if (error.code === 409) {
          message.error("Properties name or code already exists");
          fileContent += `${i}\t${propertiesItemData[i].id}\t${propertiesItemData[i].code}\t\t${propertiesItemData[i].description}\t\t\t${error.message}\n`;
        } else {
          message.error("Failed to add properties item");
          console.error("Error creating properties item:", error);
          fileContent += `${i}\t${propertiesItemData[i].id}\t${propertiesItemData[i].code}\t\t${propertiesItemData[i].description}\t\t\t${error.message}\n`;
        }
      }
    }
     const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
     saveAs(blob, 'properties_data.txt');

    };

  const rent_contracts = async (contract) => {

    let userId = getUserId();
   // console.log(contract);
    const totalItems = 477;
    let fileContent = "index\tID\tcode\t\t\t\t\tappwriteId\t\t\terror\n\n"; 
      
    for (let i = 476; i < totalItems; i++) {

      id = 123456789111111;
      docId = contract[i].id;
      ids = docId + id;
      idsString = ids.toString();
      console.log(i);

      propId = contract[i].property_id;
      propIds = propId + id;
      propString = propIds.toString();


      vendorId = contract[i].vendor_id;
      vendorIds = vendorId + id;
      vendorString = vendorIds.toString();

      console.log(contract[i].agreement)
      contract[i].agreement = contract[i].agreement + "-1";
      console.log(contract[i].agreement)
        try {
          await database.createDocument(Database, Contract_db, idsString, {
            users: userId,
            startDate: contract[i].start_date,
            expiryDate: contract[i].expiry_date,
            paymentStartDate: contract[i].payment_start_date,
            duration: contract[i].duration,
            monthlyRent: contract[i].monthly_installment,
            numOfInstallment: contract[i].no_of_installment,
            Status: contract[i].status,
            date: contract[i].created_at,
            updated_at: contract[i].updated_at,
            frequency: contract[i].frequent_of_payment,
            remark: contract[i].remark,
            agreement: contract[i].file_path,
            code: contract[i].agreement,
            vendor: vendorString,
            properties: propString,
          });

          message.success("contract " + contract[i].id + " added successfully");
        } catch (error) {
          if (error.code === 409) {
            message.error("contract  code already exists");
            fileContent += `${i}\t${contract[i].id}\t${contract[i].agreement}\t\t\t\t\t${idsString}\t\t\t${error.message}\n`;
          } else {
            message.error("contract " + contract[i].id + " Failed ");
            console.error("Error creating properties item:", error);
            fileContent += `${i}\t${contract[i].id}\t${contract[i].agreement}\t\t\t\t\t${idsString}\t\t\t${error.message}\n`;
          }
        }
      }
       const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
       saveAs(blob, 'rent_contract_data.txt');
    
  };

  const schedule = async (schedule) => {
    
      const totalItems = 1;
    let fileContent = "Index\tID\tCode\t\t\t\t\terror\n\n"; 

    for (let i = 0; i < totalItems; i++) {
       
       console.log(i);
      
       id = 123456789111111;
       
       docId = schedule[i].id;
       ids = docId + id;
       idsString = ids.toString();
      
       propId=schedule[i].rent_contract_id;
       propIds = propId + id;
       propString = propIds.toString();
       console.log(propString);

      try {
        await database.createDocument(Database, Schedule_db, idsString, {
        //  code: schedule[i].agreement,
          updated_at: schedule[i].updated_at,
          created_at: schedule[i].created_at,
          payment_amount: schedule[i].payment_amount,
          next_payment_date: schedule[i].next_payment_date,
          status: schedule[i].status,
          contract: propString,
        });
        message.success("Schedule " + schedule[i].id + " added successfully");


      } catch (error) {
        if (error.code === 409) {
          message.error("contract name or code already exists");
          fileContent += `${i}\t${schedule[i].id}\t${schedule[i].agreement}\t\t\t\t${error.message}\n`;
        } else {
          message.error("Failed to add contract item");
          console.error("Error creating contract item:", error);
          fileContent += `${i}\t${schedule[i].id}\t${schedule[i].agreement}\t\t\t\t${error.message}\n`;
        }
      }
    }
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'schedule_data.txt');
  };
  const migration= async (migrations) => {
    let userId = getUserId();
    const totalItems = migrations.length;
    let fileContent = "ID\tBatch\t\tMigration\t\t\t\terror\n\n"; 

    for (let i = 0; i < totalItems; i++) {
        id = 123456789111111;
        docId = migrations[i].id;
        ids = docId + id;
        idsString = ids.toString();

      try {
        await database.createDocument(Database, migration_db, idsString, {
          migration: migrations[i].migration,
          batch: migrations[i].batch,
          users: userId,

        });
        message.success("migrations " + migrations[i].id + " added successfully");


      } catch (error) {
        if (error.code === 409) {
          message.error("migrations name or code already exists");
          fileContent += `${docId}\t${migrations[i].batch}\t\t${migrations[i].migration}\t\t\t${error.message}\n`;

        } else {
          message.error("Failed to add migrations item");
          console.error("Error creating migrations item:", error);
          fileContent += `${docId}\t${migrations[i].batch}\t\t${migrations[i].migration}\t\t\t${error.message}\n`;

        }
      }
    }
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'migration_data.txt');
  };

  const roles= async (role) => {
    let userId = getUserId();
    const totalItems = role.length;
    let fileContent = "ID\tdescription\t\t\terror\n\n"; 

    for (let i = 0; i < totalItems; i++) {
        id = 123456789111111;
        docId = role[i].id;
        ids = docId + id;
        idsString = ids.toString();

      try {
        await database.createDocument(Database, role_db, idsString, {
          description: role[i].description,
          created_at: role[i].created_at,
          updated_at: role[i].updated_at,
          users: userId,

        });
        message.success("role " + role[i].id + " added successfully");


      } catch (error) {
        if (error.code === 409) {
          message.error("role name or code already exists");
          fileContent += `${docId}\t${role[i].description}\t\t\t${error.message}\n`;

        } else {
          message.error("Failed to add role item");
          console.error("Error creating role item:", error);
          fileContent += `${docId}\t${role[i].description}\t\t\t${error.message}\n`;

        }
      }
    }
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'role_data.txt');
  };
  const contextData = {
    departments,
    vendors,
    properties,
    rent_contracts,
    migration,
    roles,
    schedule,

  };

  return (
    <ContractContext.Provider value={contextData}>
      {children}
    </ContractContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContract = () => useContext(ContractContext);

export default ContractContext;
