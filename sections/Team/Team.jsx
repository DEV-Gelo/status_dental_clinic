import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import React icons--------------//
import {
  BsArrowUpRightCircle,
  BsArrowRightCircle,
  BsArrowLeftCircle,
} from "react-icons/bs";

const Team = () => {
  // -----Translation-----//
  const t = useTranslations("TeamSection");

  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  // -----Doctors Data-----//
  const doctors = [
    {
      id: 1,
      image: "/Doc1.png",
      name: t("Doctor.Name1"),
      specialization: t("Doctor.Specialization1"),
    },
    {
      id: 2,
      image: "/Doc2.png",
      name: t("Doctor.Name2"),
      specialization: t("Doctor.Specialization2"),
    },
    {
      id: 3,
      image: "/Doc3.png",
      name: t("Doctor.Name3"),
      specialization: t("Doctor.Specialization3"),
    },
  ];

  return (
    <>
      <section className="flex flex-col w-full h-auto pb-5 sm:h-[55rem] justify-start items-center bg-[url('/IMG_BG.webp')] bg-cover bg-center">
        <div className="flex flex-col max-w-[52rem] h-auto justify-center items-center m-5 mb-10">
          <p className="blue-text">{t("nameTitle")}</p>
          <h2 className="title-text-m sm:title-text text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>
          </h2>
          <p className="text-center font-medium m-5">{t("Description")}</p>
        </div>
        <div className="flex w-[70%] sm:w-[80%] h-auto sm:h-full justify-center items-center">
          <button className="flex lg:hidden custom-prev m-4 sm:m-10 text-[1.5rem] text-[#444] hover:text-[#006eff]">
            <BsArrowLeftCircle />
          </button>
          <div className="flex w-[15rem] sm:w-[20rem] md:w-full h-auto sm:h-full items-center">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              spaceBetween={10}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
              //   onSlideChange={() => console.log("slide change")}
              //   onSwiper={(swiper) => console.log(swiper)}
            >
              {doctors.map((doctor) => (
                <SwiperSlide key={doctor.id} className="pb-10">
                  <div className="flex relative sm:max-w-[20rem] h-full sm:h-full rounded-xl overflow-hidden mx-auto">
                    <div className="flex relative w-[15rem] sm:w-[20rem] h-[20rem] sm:h-[25rem]">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center w-full h-1/4 absolute bottom-0 left-0 bg-[#006eff] opacity-75 text-white p-2">
                      <p className="text-center">{doctor.name}</p>
                      <p className="text-center text-[0.8rem]">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button className="flex lg:hidden custom-next m-4 sm:m-10 text-[1.5rem] text-[#444] hover:text-[#006eff]">
            <BsArrowRightCircle />
          </button>
        </div>
        <Link
          href={`/${locale}/doctors`}
          className="flex justify-start items-center my-5 lg:my-10"
        >
          <ThemeProvider theme={theme}>
            <Button
              size="large"
              color="appointment"
              variant="outlined"
              sx={{
                whiteSpace: "nowrap",
                borderRadius: 10,
                fontWeight: "600",
                fontFamily: "var(--font-montserrat)",
                borderWidth: 2,
                borderColor: "#006eff",
                color: "#006eff",
              }}
            >
              {t("More")}
              <span className="text-[1.5rem] ml-3">
                <BsArrowUpRightCircle />
              </span>
            </Button>
          </ThemeProvider>
        </Link>
      </section>
    </>
  );
};

export default Team;
