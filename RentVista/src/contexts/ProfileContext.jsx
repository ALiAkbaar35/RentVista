// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect, useContext } from "react";
import { database } from "../configs/appwriteConfig";
import { Query } from "appwrite";
import { useAuth } from "./authContext";

const ProfileContext = createContext();

// eslint-disable-next-line react/prop-types
export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    // eslint-disable-next-line no-unused-vars
    const userId = user.id || user.$id;
  }

  const getUserId = () => {
    const userId = user.id || user.$id;
    return userId;
  };

  const [Profile, setProfile] = useState([]);

  const fetchData = async () => {
          let userId = getUserId();

  try {
   
    const response = await database.listDocuments(
      "65d59de3458b98878f9c",
      "65d59df089a1a97810a0",
      [Query.equal("userId", userId)]
    );
    setProfile(response.documents);
  } catch (error) {
    console.error("Error fetching unit data:", error);
  }
};

  
  useEffect(() => {
    fetchData();
  }, []); // Include userId as a dependency for useEffect

  const contextData = {
    Profile,
    fetchData,
  };

  return (
    <ProfileContext.Provider value={contextData}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileContext;
