"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiUsers } from "react-icons/fi";
import { RiPagesLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { SlNote } from "react-icons/sl";
import Link from "next/link";
import styles from "./AdminNav.module.css";

const AdminNav = () => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [activeIndex, setActiveIndex] = useState(0);

  const icons = [
    {
      icon: <FiUsers />,
      title: "Користувачі",
      link: `/${locale}/admin/users`,
    },
    {
      icon: <RiPagesLine />,
      title: "Графік прийому",
      link: `/${locale}/admin/appointment`,
    },
    {
      icon: <SlNote />,
      title: "Записи на прийом",
      link: `/${locale}/admin`,
    },
    {
      icon: <IoSettingsOutline />,
      title: "Налаштування",
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
            </li>
          ))}
          <div
            className={styles.indicator}
            style={{
              transform: `translateX(calc(70px * ${activeIndex}))`,
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
