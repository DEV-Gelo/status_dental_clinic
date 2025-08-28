import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// -----------Import React icons--------------//
import { FaStar } from "react-icons/fa";

// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// -----------Import React icons--------------//
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";

const Testimonials = () => {
  // -----Translation-----//
  const t = useTranslations("TestimonialsSection");
  // -----Testimonials Data------//
  const testimonials = [
    {
      id: 1,
      image: "/avatar-1.webp",
      name: t("Card.name1"),
      specialization: t("Card.specialization1"),
      description: t("Card.description1"),
    },
    {
      id: 2,
      image: "/avatar-3.webp",
      name: t("Card.name2"),
      specialization: t("Card.specialization2"),
      description: t("Card.description2"),
    },
    {
      id: 3,
      image: "/avatar-2.webp",
      name: t("Card.name3"),
      specialization: t("Card.specialization3"),
      description: t("Card.description3"),
    },
  ];

  return (
    <>
      <section className="flex relative flex-col w-full h-auto py-10 justify-start items-center bg-[url('/BackgroundAbstraction.png')] bg-cover bg-center container-padding">
        <div className="flex flex-col max-w-[52rem] h-auto justify-center items-center m-5 mb-10">
          <p className="blue-text">{t("nameTitle")}</p>
          <h2 className="title-text-m sm:title-text text-center">
            {t("Title1")}
          </h2>
        </div>
        <div className="flex relative flex-col sm:flex-row w-full h-auto sm:h-full justify-center items-center">
          {/* <button
            className="hidden sm:flex custom-prev m-4 sm:m-10 text-[1.5rem] text-[#444] hover:text-[#006eff]"
            aria-label="Previous slide"
          >
            <BsArrowLeftCircle />
          </button> */}
          <div className="flex w-full h-auto sm:h-full">
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
              spaceBetween={5}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 5,
                },
                768: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
              }}
              //   onSlideChange={() => console.log("slide change")}
              //   onSwiper={(swiper) => console.log(swiper)}
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="pb-10">
                  <div
                    className={`flex w-auto h-[25rem] p-1 items-center ${
                      testimonial.id % 2 === 0
                        ? "lg:items-start"
                        : "lg:items-center"
                    }`}
                  >
                    <div className="flex flex-col w-full min-h-[55%] h-auto rounded-lg p-4 shadow-lg border-[1px] bg-[#fdfdfd]">
                      <div className="flex pb-2">
                        <div className="flex relative min-w-[4rem] h-[5rem] rounded-md bg-red-400 overflow-hidden">
                          <Image
                            src={testimonial.image}
                            alt={`Photo of ${testimonial.name}, ${testimonial.specialization}`}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col w-full h-full justify-start items-center mx-4">
                          <p className="font-semibold text-nowrap">
                            {testimonial.name}
                          </p>
                          <p className="text-[0.8rem] text-nowrap">
                            {testimonial.specialization}
                          </p>
                          <span className="flex mx-2 my-3 text-[#FF9800]">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="mx-[3px]" />
                            ))}
                          </span>
                        </div>
                      </div>
                      <p className="text-center text-[0.8rem] relative">
                        {testimonial.description}
                        {/* SVG Quotes */}
                        <span className="blue-text absolute -top-2 -right-3">
                          <svg
                            width="23"
                            height="16"
                            viewBox="0 0 23 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.4438 14.4327C13.8625 13.625 14.8349 12.7596 15.3612 11.8365C15.8874 10.9327 16.1505 10.0673 16.1505 9.24038C16.1505 8.35577 15.8645 7.56731 15.2925 6.875C14.6976 6.20192 14.0455 5.61539 13.3362 5.11539C13.0159 4.82692 12.8557 4.50962 12.8557 4.16346C12.8557 3.75962 13.0159 3.34615 13.3362 2.92308C13.6565 2.5 14.0798 2.10577 14.6061 1.74039C15.1323 1.375 15.7501 1.07692 16.4594 0.846155C17.1459 0.615386 17.8666 0.500002 18.6217 0.500002C19.3539 0.500002 19.9717 0.653847 20.475 0.96154C20.9555 1.26923 21.3445 1.64423 21.642 2.08654C21.9394 2.52885 22.1568 2.99039 22.2941 3.47116C22.4314 3.97116 22.5 4.41346 22.5 4.79808C22.5 5.91346 22.2598 6.98077 21.7793 8C21.2988 9.03846 20.6466 10.0096 19.8229 10.9135C18.9992 11.8173 18.0382 12.6442 16.9399 13.3942C15.8417 14.1635 14.6862 14.8462 13.4735 15.4423L12.4438 14.4327ZM0.499998 14.4904C1.89573 13.6827 2.86817 12.8173 3.41731 11.8942C3.94358 10.9904 4.20671 10.125 4.20671 9.29808C4.20671 8.41346 3.9207 7.625 3.34867 6.93269C2.75377 6.25961 2.10166 5.67308 1.39235 5.17308C1.07202 4.88461 0.911855 4.56731 0.911855 4.22115C0.911855 3.81731 1.07202 3.40385 1.39235 2.98077C1.71269 2.55769 2.13599 2.16346 2.66225 1.79808C3.18851 1.43269 3.80629 1.13462 4.5156 0.903846C5.20203 0.673077 5.92278 0.557692 6.67785 0.557692C7.41004 0.557692 8.01638 0.711539 8.49688 1.01923C8.97738 1.32692 9.3778 1.70192 9.69813 2.14423C9.99558 2.58654 10.2129 3.04808 10.3502 3.52885C10.4646 4.02885 10.5218 4.47115 10.5218 4.85577C10.5218 5.97115 10.2816 7.03846 9.80109 8.05769C9.32059 9.09615 8.66849 10.0673 7.84477 10.9712C7.02106 11.875 6.0715 12.7019 4.9961 13.4519C3.89781 14.2212 2.74233 14.9038 1.52964 15.5L0.499998 14.4904Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* <button
            className="hidden sm:flex custom-next m-4 sm:m-10 text-[1.5rem] text-[#444] hover:text-[#006eff]"
            aria-label="Next slide"
          >
            <BsArrowRightCircle />
          </button> */}
        </div>
        <div className="flex sm:hidden absolute bottom-[5rem] right-[calc(50%-56px)] z-30">
          <button
            className="custom-prev m-4 sm:m-10 text-[1.5rem] text-[#444] hover:text-[#006eff]"
            aria-label="Previous slide"
          >
            <BsArrowLeftCircle />
          </button>
          <button
            className="custom-next m-4 sm:m-10 text-[1.5rem] text-[#444] hover:text-[#006eff]"
            aria-label="Next slide"
          >
            <BsArrowRightCircle />
          </button>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
