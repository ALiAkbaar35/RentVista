// eslint-disable-next-line no-unused-vars
import React from "react";
import { AuthProvider } from "./contexts/authContext";
import Routes from "./routes/Routes";
import { DepartmentProvider } from "./contexts/DepartmentContext";
import { PropertyProvider } from "./contexts/PropertyContext";
import { VendorProvider } from "./contexts/VendorContext";

function App() {
    return (
      <AuthProvider>
        <DepartmentProvider>
          <PropertyProvider>
            <VendorProvider>
            <Routes />
            </VendorProvider>
          </PropertyProvider>
          </DepartmentProvider>
        </AuthProvider>
    );
}

export default App;
