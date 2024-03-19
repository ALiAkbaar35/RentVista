// eslint-disable-next-line no-unused-vars
import React from "react";
import { useAuth } from "../../contexts/authContext";
import "../../App.css"; // Import your custom CSS file

const Profile = () => {
  const { user } = useAuth();

  if (!user || user.length === 0) {
    // Handle loading or no data scenario
    return <p>Loading...</p>;
  }

  const userProfile = user; // Assuming there's only one profile per user

  return (
    <div className="flex overflow-auto items-center justify-center my-profile-container">
      <div className="p-5 rounded-md shadow-md w-full bg-slate-800 text-white">
        <h3 className="text-xl font-semibold mb-4">Applicant Information</h3>
        <p className="text-sm text-white mb-6">
          Personal details and application.
        </p>
        <div className="border-t border-white">
          <dl className="divide-y divide-white">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">
                Full name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                {userProfile.name || "N/A"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">
                Email
              </dt>
              <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                {userProfile.email || "N/A"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">
                Phone Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                {userProfile.phone || "N/A"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">
                Password
              </dt>
              <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">
                {userProfile.password || "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Styles
