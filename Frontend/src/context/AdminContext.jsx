import { useState } from "react";
import AdminDataContext from "./AdminDataContext";

const AdminContext = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateAdmin = (adminData) => {
        setAdmin(adminData);
    };

    const value = {
        admin,
        setAdmin,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateAdmin,
    };

    return (
        <AdminDataContext.Provider value={value}>
            {children}
        </AdminDataContext.Provider>
    );
};

export default AdminContext;