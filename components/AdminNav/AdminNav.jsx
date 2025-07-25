"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./AdminNav.module.css";
// ------------Import React icons------------//
import { FiUsers } from "react-icons/fi";
import { RiPagesLine } from "react-icons/ri";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { SlNote } from "react-icons/sl";

const num = 0;

const AdminNav = () => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [activeIndex, setActiveIndex] = useState(0);

  // --------Translations----------//
  const t = useTranslations("AdminNav");

  const icons = [
    {
      icon: <FiUsers />,
      title: t("userTitle"),
      link: `/${locale}/admin/users`,
    },
    {
      icon: <RiPagesLine />,
      title: t("scheduleTitle"),
      link: `/${locale}/admin/appointment`,
    },
    {
      icon: <SlNote />,
      title: t("appointmentTitle"),
      link: `/${locale}/admin`,
    },
    {
      icon: <RiMoneyDollarBoxLine />,
      title: t("priceTitle"),
      link: `/${locale}/admin/settings`,
    },
  ];

  useEffect(() => {
    const currentIndex = icons.findIndex((item) => item.link === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]);

  return (
    <div className="flex w-full h-auto">
      <nav className={styles.navigation}>
        <ul>
          {icons.map((item, index) => (
            <li
              key={item.link}
              className={activeIndex === index ? `${styles.active}` : ""}
            >
              <Link href={item.link} title={item.title}>
                <span className={styles.icon}>{item.icon}</span>
              </Link>
              {activeIndex !== index && (
                <p className="text-[0.8rem] text-[#fff] mt-2">{item.title}</p>
              )}
            </li>
          ))}
          <div
            className={styles.indicator}
            style={{
              transform: `translateX(calc(80px * ${activeIndex}))`,
            }}
          >
            <span></span>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default AdminNav;
