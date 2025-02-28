import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const PagesLayout = ({ children }) => {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
};

export default PagesLayout;
