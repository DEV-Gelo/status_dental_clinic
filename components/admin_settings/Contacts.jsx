import React, { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
// --------------Import MUI components-----------------//
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_Buttons/stylisation_button_MUI";
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
  if (!response.ok) throw new Error("Помилка при отриманні даних");
  return response.json();
};

const Contacts = ({ onAlert }) => {
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
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
    x: "",
    y: "",
    z: "",
  });

  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/contact", fetchData);
  console.log("Data :", data);

  // ---------Send data to server-------------------------//
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        throw new Error(`Помилка: ${response.statusText}`);
      }

      const result = await response.json();
      onAlert("success", "Дані успішно збережені");
    } catch (error) {
      console.error("Помилка при відправці даних:", error);
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

  return (
    <div className="flex flex-col justify-start items-start sm:justify-center sm:items-center overflow-auto">
      <div className="flex flex-col sm:flex-row mr-2">
        <address className="flex flex-col w-full h-auto lg:w-[35rem] sm:h-[38rem] border-[1px] rounded-md sm:overflow-auto mr-4 my-10 sm:my-0 p-3">
          <TextField
            id="country"
            label="Країна"
            name="country"
            value={contactData.country}
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
            label="Місто"
            name="city"
            value={contactData.city}
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
          <TextField
            id="district"
            label="Район"
            name="district"
            value={contactData.district}
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
          <TextField
            id="region"
            label="Область"
            name="region"
            value={contactData.region}
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
            label="Вулиця"
            name="street"
            value={contactData.street}
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
            label="Будинок №"
            name="house"
            value={contactData.house}
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
            label="Офіс №"
            name="office"
            value={contactData.office}
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
            label="Індекс"
            name="zipCode"
            value={contactData.zipcode}
            onChange={(e) =>
              setContactData({ ...contactData, zipcode: e.target.value })
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
            id="e-mail"
            label="E-пошта"
            name="e-mail"
            value={contactData.email}
            onChange={(e) =>
              setContactData({ ...contactData, email: e.target.value })
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
          {contactData.phoneNumbers.map((phone, index) => (
            <div className="flex items-center my-2 relative" key={index}>
              <TextField
                id={`Phone${index + 1}`}
                label={`Телефон №${index + 1}`}
                name={`Phone${index + 1}`}
                type="number"
                value={phone}
                onChange={(e) => handlePhoneChange(e, index)}
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
                Координати:
              </h6>
              <div className="Flex w-[8rem] h-auto m-1">
                <TextField
                  id="coordinate-x"
                  label="X"
                  name="coordinate-x"
                  size="small"
                  value={contactData.x || ""}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      x: parseFloat(e.target.value) || "",
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
                  value={contactData.y || ""}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      y: parseFloat(e.target.value) || "",
                    })
                  }
                />
              </div>
              <div className="Flex w-[8rem] h-auto m-1">
                <TextField
                  id="coordinate-z"
                  label="Z"
                  name="coordinate-z"
                  size="small"
                  value={contactData.z || ""}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      z: parseFloat(e.target.value) || "",
                    })
                  }
                />
              </div>
            </div>
          </div>
          {/* <MapComponent /> */}
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
            Записати
          </LoadingButton>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Contacts;
