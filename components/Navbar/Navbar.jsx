"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useVelocity, useCycle } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../NavbarMobileMenu/MobileMenu";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";

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

  // -----------Translations--------------//
  const t = useTranslations("Navbar");
  // -----------Get the path--------------//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const links = [
    { href: `/${locale}`, label: t("main") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/service`, label: t("service") },
    { href: `/${locale}/price`, label: t("price") },
    { href: `/${locale}/contacts`, label: t("contact") },
  ];

  return (
    <>
      <motion.nav
        animate={{ y: isInView ? 0 : -slideDistance }}
        transition={{ duration: 0.2, delay: 0.25, ease: "easeInOut" }}
        style={{ height: slideDistance }}
        className="flex w-full justify-between items-center z-50 py-[1.5rem] px-[1rem] sm:px-[4rem] bg-[#fff] xl:bg-transparent absolute top-0 right-0"
      >
        <div className="flex justify-start items-center mr-[2rem]">
          <Image src="/Tooth.png" alt="logo" width={50} height={50} />
          <Link href="/" className="font-bold text-[20px]">
            Denta<span className="text-[#5ba3bb]">Pro</span>
          </Link>
        </div>
        <div className="hidden lg:flex w-full h-full justify-center items-center font-bold text-[16px] gap-[5%]">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`mx-[0rem] text-nowrap inline-block transition ease-in-out hover:scale-[1.04] hover:text-[#5ba3bb] ${
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
          href={`/${locale}/appointment`}
          className="hidden lg:flex justify-end items-center ml-[2rem]"
        >
          <Button
            size="large"
            variant="contained"
            className="text-nowrap blue rounded-none"
          >
            {t("appointment")}
          </Button>
        </Link>
      </motion.nav>
    </>
  );
};

export default Navbar;
