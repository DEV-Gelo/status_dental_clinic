import AdminNav from "@/components/AdminNav/AdminNav";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <section className="flex flex-col w-full h-screen">
      {children}
      <AdminNav />
    </section>
  );
};

export default AdminLayout;
