import React, { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
// --------------Import MUI components-----------------//
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// --------------React icon------------------------//
import { BsFillTelephonePlusFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
// --------------Map component---------------------//
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map/CustomMap"), {
  ssr: false,
});

// Function for receiving contacts data
const fetchData = async () => {
  const response = await fetch("/api/admin_setting/contact");
  if (!response.ok) throw new Error("An error occurred while receiving data");
  return response.json();
};

const Contacts = ({ onAlert }) => {
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([51.5287398, -0.2664034]);
  const [contactData, setContactData] = useState({
    country: "",
    city: "",
    district: "",
    region: "",
    street: "",
    house: "",
    office: "",
    zipcode: "",
    email: "",
    phoneNumbers: [""],
    x: null,
    y: null,
    z: null,
  });

  // ---------Translations------------//
  const t = useTranslations("settings__Contacts");
  const pathname = usePathname();

  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/contact", fetchData);

  // -----------Save the data from the database---------------------//
  useEffect(() => {
    if (data) {
      setContactData(data[0]);
    }
  }, [data]);
  // ------------Saving coordinates in a state------------------//
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && data[0]?.x && data[0]?.y) {
      setPosition([data[0].x, data[0].y]);
    } else {
      setPosition([51.5287398, -0.2664034]); // Default fallback coordinates
    }
  }, [data]);

  // ---------Send data to server-------------------------//
  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin_setting/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      mutate("/api/admin_setting/contact");
      onAlert("success", t("SuccessAlert"));
    } catch (error) {
      console.error(t("Error sending data"), error);
    } finally {
      setLoading(false);
    }
  };

  // ---------Add phone number into contactData-----------//
  const handlePhoneChange = (e, index) => {
    const updatedPhones = [...contactData.phoneNumbers];
    updatedPhones[index] = e.target.value;
    setContactData({
      ...contactData,
      phoneNumbers: updatedPhones,
    });
  };
  // ------------Add empty field input-------------//
  const addPhoneNumberField = () => {
    setContactData({
      ...contactData,
      phoneNumbers: [...contactData.phoneNumbers, ""],
    });
  };

  // -------------Remove empty field-------------//
  const removePhoneNumber = (index) => {
    setContactData((prevData) => ({
      ...prevData,
      phoneNumbers: prevData.phoneNumbers.filter((_, i) => i !== index),
    }));
  };

  // ------Receiving and storing input data------//
  const handleInputEmail = (e) => {
    const { name, value } = e.target;

    // check the local states
    if (name === "email") {
      setContactData({ ...contactData, email: value });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value)); // Check email
    }
  };

  return (
    <>
      {/* {error && (
        <div className="flex justify-center items-center w-full h-full">
          <Alert
            className="flex justify-center items-center"
            severity="warning"
          >
            <h6>{t("Error loading data")}</h6>
          </Alert>
        </div>
      )} */}
      {!data && !error && (
        <div className="flex w-full h-full justify-center items-center">
          <CircularProgress size="3rem" />
        </div>
      )}
      {data && !error && (
        <div className="flex flex-col justify-start items-center sm:justify-center overflow-auto">
          <div className="flex flex-col sm:flex-row mr-2">
            <address className="flex flex-col w-full h-auto lg:w-[35rem] sm:h-[38rem] border-[1px] rounded-md sm:overflow-auto mr-4 my-10 sm:my-0 p-3">
              <TextField
                id="country"
                label={t("Country")}
                name="country"
                value={contactData.country ?? ""}
                onChange={(e) =>
                  setContactData({ ...contactData, country: e.target.value })
                }
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              <TextField
                id="city"
                label={t("City")}
                name="city"
                value={contactData.city ?? ""}
                onChange={(e) =>
                  setContactData({ ...contactData, city: e.target.value })
                }
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              {pathname.split("/")[1] === "uk" && (
                <TextField
                  id="district"
                  label={t("Area")}
                  name="district"
                  value={contactData.district ?? ""}
                  onChange={(e) =>
                    setContactData({ ...contactData, district: e.target.value })
                  }
                  sx={{
                    width: "100%",
                    my: 1,
                    "& .MuiInputBase-input": {
                      fontSize: "18px",
                      "@media (max-width: 600px)": {
                        fontSize: "14px",
                      },
                    },
                  }}
                />
              )}
              <TextField
                id="region"
                label={t("Region")}
                name="region"
                value={contactData.region ?? ""}
                onChange={(e) =>
                  setContactData({ ...contactData, region: e.target.value })
                }
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              <TextField
                id="street"
                label={t("Street")}
                name="street"
                value={contactData.street ?? ""}
                onChange={(e) =>
                  setContactData({ ...contactData, street: e.target.value })
                }
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              <TextField
                id="house"
                label={t("House")}
                name="house"
                value={contactData.house ?? ""}
                onChange={(e) =>
                  setContactData({ ...contactData, house: e.target.value })
                }
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              <TextField
                id="office"
                label={t("Office")}
                name="office"
                value={contactData.office ?? ""}
                onChange={(e) =>
                  setContactData({ ...contactData, office: e.target.value })
                }
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              <TextField
                id="zipCode"
                label={t("zipCode")}
                name="zipCode"
                type="number"
                value={contactData.zipcode ?? ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setContactData({
                    ...contactData,
                    zipcode: value,
                  });
                }}
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              <TextField
                id="email"
                label={t("email")}
                name="email"
                error={emailError}
                value={contactData.email ?? ""}
                onChange={(e) => handleInputEmail(e)}
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                    "@media (max-width: 600px)": {
                      fontSize: "14px",
                    },
                  },
                }}
              />
              {contactData.phoneNumbers.map((phone, index) => (
                <div className="flex items-center my-2 relative" key={index}>
                  <TextField
                    id={`Phone${index + 1}`}
                    label={`${t("Phone")} ${index + 1}`}
                    name={`Phone${index + 1}`}
                    type="text"
                    value={phone ?? ""}
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters
                      handlePhoneChange({ target: { value } }, index); // Transfer the cleared value
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            {t("prefix")}
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-input": {
                        fontSize: "18px",
                        "@media (max-width: 600px)": {
                          fontSize: "14px",
                        },
                      },
                    }}
                  />
                  {contactData.phoneNumbers[index].length <= 0 &&
                    contactData.phoneNumbers.length > 1 &&
                    index > 0 && (
                      <span
                        className="absolute top-0 right-0 text-red-500"
                        onClick={() => removePhoneNumber(index)}
                      >
                        <IoClose />
                      </span>
                    )}
                </div>
              ))}
              <Button
                onClick={() => addPhoneNumberField()}
                sx={{
                  width: "100%",
                  height: "100%",
                  background: "#f5f5f5",
                  padding: "1rem",
                }}
              >
                <BsFillTelephonePlusFill className="text-[1.2rem]" />
              </Button>
            </address>
            {/* ------Map container-------- */}
            <div
              className="flex flex-col w-full h-[38rem] border-[1px] rounded-md p-4 sm:px-5"
              style={{ touchAction: "pan-y" }}
            >
              <div className="flex h-auto w-full justify-center mb-3">
                <div className="flex flex-wrap justify-center items-center max-w-[38rem] h-auto bg-[#f5f5f5] px-4 rounded-md">
                  <h6 className="font-semibold text-[0.8rem] sm:text-[1.2rem] text-[#a7adaf] mx-2">
                    {t("Coordinates")}
                  </h6>
                  <div className="Flex w-[8rem] h-auto m-1">
                    <TextField
                      id="coordinate-x"
                      label="X"
                      name="coordinate-x"
                      size="small"
                      type="number"
                      step="any" // Allows to enter fractional values
                      value={contactData.x ?? ""} // if null, display an empty line
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          x:
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="Flex w-[8rem] h-auto m-1">
                    <TextField
                      id="coordinate-y"
                      label="Y"
                      name="coordinate-y"
                      size="small"
                      type="number"
                      step="any" // Allows to enter fractional values
                      value={contactData.y ?? ""} // if null, display an empty line
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          y:
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  {/* <div className="Flex w-[8rem] h-auto m-1">
                    <TextField
                      id="coordinate-z"
                      label="Z"
                      name="coordinate-z"
                      size="small"
                      type="number"
                      step="any" // Allows to enter fractional values
                      value={contactData.z ?? ""} // if null, display an empty line
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          z:
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value),
                        })
                      }
                    />
                  </div> */}
                </div>
              </div>
              <MapComponent position={position} />
            </div>
          </div>
          <div className="flex w-full justify-center items-center">
            <ThemeProvider theme={theme}>
              <LoadingButton
                sx={{ m: 1 }}
                color="save"
                onClick={() => handleSubmit()}
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                size="large"
              >
                {t("save")}
              </LoadingButton>
            </ThemeProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default Contacts;
