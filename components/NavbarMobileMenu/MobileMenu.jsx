import { useState, useEffect, useRef } from "react";
import { MenuToggle } from "./MenuToggle";
import { section_variants } from "@/utils/variants";
import { li_variants } from "@/utils/variants";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MobileMenu({ links }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const handleClickOutside = (event) => {
    // Перевірка, чи клікнув користувач поза межами меню та кнопки
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
        className="flex flex-col justify-center items-center p-[4rem] absolute z-0 top-[-2rem] w-[50%] h-[100vh] bg-[#ccdde4]"
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
      className="flex lg:hidden justify-end w-full absolute top-[2rem] right-0"
    >
      <div ref={toggleButtonRef}>
        <MenuToggle toggle={handleMenu} />
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
                  className="font-bold text-[24px] text-center m-[2rem]"
                  custom={index}
                >
                  <Link href={link.href}>{link.label}</Link>
                </motion.li>
              );
            })}
            <motion.button
              whileTap={{ scale: 0.8 }}
              transition={{ duration: 0.5 }}
              type="button"
              className="font-bold text-[16px] text-white blue px-[2rem] py-[1rem] text-nowrap "
            >
              ЗАПИС НА ПРИЙОМ
            </motion.button>
          </Section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
