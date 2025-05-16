import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const PagesLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow ">{children}</main>
      <Footer />
    </div>
  );
};

export default PagesLayout;
