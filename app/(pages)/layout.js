import Navbar from "@/components/Navbar/Navbar";

const PagesLayout = ({ children }) => {
  return (
    <main className="flex">
      <Navbar />
      {children}
    </main>
  );
};

export default PagesLayout;
