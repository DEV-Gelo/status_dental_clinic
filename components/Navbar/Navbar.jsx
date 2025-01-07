"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useVelocity, useCycle } from "framer-motion";
import { usePathname } from "next/navigation";
import MobileMenu from "../NavbarMobileMenu/MobileMenu";

const Navbar = () => {
  // Scroll-away Navbar ----------------------------------------//

  const slideDistance = 80; // if we are sliding out a nav bar at the top of the screen, this will be it's height
  const threshold = 200; // only slide it back when scrolling back at velocity above this positive (or zero) value

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const [isScrollingBack, setIsScrollingBack] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true); // true if the page is not scrolled or fully scrolled back
  const [isInView, setIsInView] = useState(true);

  useEffect(
    () =>
      scrollVelocity.on("change", (latest) => {
        if (latest > 0) {
          setIsScrollingBack(false);
          return;
        }
        if (latest < -threshold) {
          setIsScrollingBack(true);
          return;
        }
      }),
    []
  );

  useEffect(
    () => scrollY.on("change", (latest) => setIsAtTop(latest <= 0)),
    []
  );

  useEffect(
    () => setIsInView(isScrollingBack || isAtTop),
    [isScrollingBack, isAtTop]
  );

  // Scroll-away Navbar ----------------------------------------//

  const pathname = usePathname();

  const links = [
    { href: "/", label: "ГОЛОВНА" },
    { href: "/about", label: "ПРО НАС" },
    { href: "/service", label: "ПОСЛУГИ" },
    { href: "/contacts", label: "КОНТАКТИ" },
  ];

  return (
    <>
      <motion.nav
        animate={{ y: isInView ? 0 : -slideDistance }}
        transition={{ duration: 0.2, delay: 0.25, ease: "easeInOut" }}
        style={{ height: slideDistance }}
        className="flex w-full justify-between items-center py-[1.5rem] nav-gradient fixed top-0 right-0"
      >
        <div className="flex justify-start items-center px-[2rem] sm:px-[4rem] mr-[2rem]">
          <Image src="/Tooth.png" alt="Логотип зуба" width={50} height={50} />
          <Link href="/" className="font-bold text-[20px]">
            Denta<span className="text-[#5ba3bb]">Pro</span>
          </Link>
        </div>
        <div className="hidden lg:flex w-full h-full justify-center items-center font-bold text-[16px] gap-[8%]">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`mx-[0rem] text-nowrap inline-block transition ease-in-out duration-150 hover:scale-[1.05] hover:text-[#5ba3bb] ${
                  pathname === link.href ? "text-[#5ba3bb]" : "text-black"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
        <MobileMenu links={links} />

        <Link
          href="/appointment"
          className="hidden lg:flex justify-end items-center pr-[2rem] ml-[2rem]"
        >
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.5 }}
            type="button"
            className="font-bold text-[16px] text-white blue px-[2rem] py-[1rem] text-nowrap "
          >
            ЗАПИС НА ПРИЙОМ
          </motion.button>
        </Link>
      </motion.nav>
    </>
  );
};

export default Navbar;
