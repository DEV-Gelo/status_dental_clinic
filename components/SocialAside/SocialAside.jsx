import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagramSquare,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

// ------------Social network icons--------------//
const socialIcons = [
  { id: 1, icon: <FaFacebookF />, link: "https://facebook.com" },
  { id: 2, icon: <FaInstagramSquare />, link: "https://instagram.com" },
  { id: 3, icon: <FaYoutube />, link: "https://youtube.com" },
  { id: 4, icon: <FaTwitter />, link: "https://twitter.com" },
];

const SocialAside = () => {
  return (
    <aside className="hidden sm:flex flex-col w-[4rem] h-full fixed top-0 right-0">
      <div className="flex flex-[60.9%] flex-col justify-center items-center bg-[#ccdde4]">
        {socialIcons.map((item) => (
          <Link
            className="m-4"
            href={item.link}
            key={item.id}
            aria-label={item.link.split(".")[0].split("/")[2]}
          >
            {item.icon}
          </Link>
        ))}
      </div>
      <div className="flex flex-[39.1%] justify-center items-center">
        <div className="flex flex-col w-full h-[60%] justify-center items-center">
          <Link href="#Up">
            <Image
              src="/Arrow Up.svg"
              alt="Arrow Up"
              width={8}
              height={30}
              className="m-3"
            />
          </Link>
          <Link href="#Down">
            <Image
              src="/Arrow Down.svg"
              alt="Arrow Down"
              width={8}
              height={30}
              className="m-3"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SocialAside;
