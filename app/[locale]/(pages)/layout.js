import Navbar from "@/components/Navbar/Navbar";

const PagesLayout = ({ children }) => {
  return (
    <main className="flex w-full h-full">
      <Navbar />
      {children}
    </main>
  );
};

export default PagesLayout;
