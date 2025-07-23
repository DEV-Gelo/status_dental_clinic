"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useVelocity, useCycle } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../NavbarMobileMenu/MobileMenu";
// -----Import React icons---------//
import { BiSolidPhone } from "react-icons/bi";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const Navbar = () => {
  // Scroll-away Navbar ----------------------------------------//

  const slideDistance = 100; // if we are sliding out a nav bar at the top of the screen, this will be it's height
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
    { href: `/${locale}/doctors`, label: t("doctors") },
    { href: `/${locale}/cases`, label: t("cases") },
    { href: `/${locale}/price`, label: t("price") },
    { href: `/${locale}/contacts`, label: t("contact") },
  ];

  return (
    <>
      <motion.nav
        animate={{ y: isInView ? 0 : -slideDistance }}
        transition={{ duration: 0.2, delay: 0.25, ease: "easeInOut" }}
        style={{ height: slideDistance }}
        className="flex fixed top-0 right-0 w-full min-h-[6rem] justify-center items-center z-50 bg-[#fff] px-[1rem] lg:px-[2rem] xl:px-[10rem] 2xl:px-[20rem]"
      >
        <div className="flex flex-col w-full h-full justify-center items-start border-b-2 border-[#006eff]">
          <div className="flex w-full justify-center items-center h-10 text-[0.8rem] sm:text-[1rem] py-1 bg-[#006eff10]">
            <span className="mx-1">
              <BiSolidPhone />
            </span>
            <a href="tel:+380667668819">+38 (066) 766-88-19</a>

            <span className="ml-4 mx-1">
              <BiSolidPhone />
            </span>
            <a href="tel:+3800637668819">+38 (063) 766-88-19</a>
          </div>
          <div className="flex w-full justify-between py-2">
            <div className="flex w-[13rem] justify-start items-center pr-5 mr-6">
              <div className="flex relative w-[34px] h-[50px]">
                <Image
                  src="/Tooth.webp"
                  alt="logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <Link href="/" className="w-[10rem]">
                <p className="w-auto text-[1.5rem] text-center leading-none font-astron font-bold blue-text">
                  STATUS
                </p>
                <p className="w-auto text-nowrap text-center leading-none text-[0.8rem]">
                  dental clinic
                </p>
              </Link>
            </div>
            <div className="hidden lg:flex w-full h-full justify-center items-center font-semibold text-[1rem] gap-[2%]">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`mx-[0rem] text-nowrap inline-block transition ease-in-out hover:scale-[1.04] hover:text-[#006eff] ${
                      pathname === link.href ? "blue-text" : "text-black"
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
              <ThemeProvider theme={theme}>
                <Button
                  size="large"
                  color="appointment"
                  variant="contained"
                  sx={{
                    whiteSpace: "nowrap",
                    borderRadius: 10,
                    fontWeight: "semibold",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  {t("appointment")}
                </Button>
              </ThemeProvider>
            </Link>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
