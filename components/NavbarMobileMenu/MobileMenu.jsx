import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
// -----------Iternal components----------//
import { MenuToggle } from "./MenuToggle";
import { section_variants } from "@/utils/variants";
import { li_variants } from "@/utils/variants";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

export default function MobileMenu({ links }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // -------Translations---------//
  const t = useTranslations("Navbar");
  // -----------Get the path--------------//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const handleClickOutside = (event) => {
    // Checking if the user clicked outside of the menu and button
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  const handleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.classList.add("no-scroll");
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  function Section({ children }) {
    return (
      <motion.section
        className="flex flex-col justify-center items-center p-[4rem] fixed top-0 right-0 h-screen w-full sm:w-[55vw] bg-white/50 backdrop-blur-md"
        initial="closed"
        animate="open"
        exit="closed"
        variants={section_variants}
        ref={menuRef}
      >
        <ul>{children}</ul>
      </motion.section>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="flex lg:hidden justify-end w-full absolute top-[3.5rem] right-0"
    >
      <div ref={toggleButtonRef}>
        <MenuToggle toggle={handleMenu} aria-label="Menu" />
      </div>
      <AnimatePresence>
        {isOpen && (
          <Section>
            {links.map((link, index) => {
              return (
                <motion.li
                  key={link.href}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={li_variants}
                  className="font-semibold text-[1.5rem] text-start m-[1rem] ml-[2.5rem]"
                  custom={index}
                >
                  <Link onClick={() => setIsOpen(false)} href={link.href}>
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}

            <Link href={`/${locale}/appointment`}>
              <ThemeProvider theme={theme}>
                <Button
                  size="large"
                  color="appointment"
                  variant="contained"
                  sx={{
                    mt: 4,
                    whiteSpace: "nowrap",
                    borderRadius: 10,
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: "semibold",
                  }}
                >
                  {t("appointment")}
                </Button>
              </ThemeProvider>
            </Link>
          </Section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
