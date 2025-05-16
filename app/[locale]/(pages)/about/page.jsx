import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  // ------Translations--------//
  const t = useTranslations("About_page");

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center text-[3rem] font-bold mt-[5rem]">
        <h1>Дана сторінка знаходиться у розробці.</h1>
      </div>
    </>
  );
}
