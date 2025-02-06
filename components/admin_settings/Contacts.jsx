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
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_Buttons/stylisation_button_MUI";
// --------------Map component---------------------//
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map/CustomMap"), {
  ssr: false,
});

// Function for receiving contacts data
// const fetchData = async () => {
//   const response = await fetch("/api/admin_setting/contacts");
//   if (!response.ok) throw new Error("Помилка при отриманні даних");
//   return response.json();
// };

const Contacts = () => {
  const [loading, setLoading] = useState(false);
  // ------- Calling function for receiving data from server------------//
  //   const { data, error } = useSWR("/api/admin_setting/contacts", fetchData);
  return (
    <div className="flex flex-col lg:flex-row w-full h-full justify-center items-center lg:justify-start lg:items-start">
      {/* ----Contacts container------ */}
      <address className="flex flex-col w-full sm:w-[35rem] h-[44rem] border-[1px] rounded-md overflow-auto p-3 my-6 lg:my-0">
        <TextField
          id="country"
          label="Країна"
          name="country"
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
          id="Phone1"
          label="Телефон №1"
          name="Phone1"
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
          id="Phone2"
          label="Телефон №2"
          name="Phone2"
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
          id="Phone3"
          label="Телефон №3"
          name="Phone3"
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
          id="Phone4"
          label="Телефон №4"
          name="Phone4"
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
          id="Phone5"
          label="Телефон №5"
          name="Phone5"
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

        <ThemeProvider theme={theme}>
          <LoadingButton
            // onClick={handleSubmit}
            sx={{ m: 1 }}
            color="save"
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            size="large"
          >
            ЗБЕРЕГТИ
          </LoadingButton>
        </ThemeProvider>
      </address>
      {/* ------Map container-------- */}
      <div className="flex flex-col w-full h-[40rem] px-0 sm:px-5">
        <div className="flex w-full justify-center mb-3">
          <div className="flex flex-wrap justify-center items-center max-w-[38rem] h-full bg-[#f5f5f5] px-4 rounded-md">
            <h6 className="font-semibold text-[1.2rem] text-[#a7adaf] mx-2">
              Координати:
            </h6>
            <div className="Flex w-[8rem] h-auto m-1">
              <TextField
                id="coordinate-x"
                label="X"
                name="coordinate-x"
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
            </div>
            <div className="Flex w-[8rem] h-auto m-1">
              <TextField
                id="coordinate-y"
                label="Y"
                name="coordinate-y"
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
            </div>
            <div className="Flex w-[8rem] h-auto m-1">
              <TextField
                id="coordinate-z"
                label="Z"
                name="coordinate-z"
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
            </div>
          </div>
        </div>
        <MapComponent />
      </div>
    </div>
  );
};

export default Contacts;
