import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const PagesLayout = ({ children }) => {
  return (
    <main className="flex flex-col w-full h-auto">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default PagesLayout;
