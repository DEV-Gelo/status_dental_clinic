import AdminNav from "@/components/AdminNav/AdminNav";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <nav className="flex flex-col w-full h-full">
      {children}
      <AdminNav />
    </nav>
  );
};

export default AdminLayout;
