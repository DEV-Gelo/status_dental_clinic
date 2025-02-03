import React, { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
// --------------Import MUI components-----------------//
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
import Skeleton from "@mui/material/Skeleton";

import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_Buttons/stylisation_button_MUI";

const Pricing = ({ onAlert }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const containerRef = useRef(null);

  return (
    <div className="flex relative w-full h-full justify-center items-center">
      <span
        onClick={() => setIsOpenCategory((prev) => !prev)}
        className="sticky ml-5 mr-auto mb-auto"
      >
        <Fab sx={{ zIndex: 0 }} color="primary" size="small" aria-label="add">
          <AddIcon />
        </Fab>
      </span>
      {isOpenCategory && (
        <div className="flex flex-col w-[30rem] h-[15rem] justify-center items-center absolute mt-auto mr-auto rounded-md p-2 bg-[#ccdde4]">
          <div className="flex sticky top-2 right-2 ml-auto mb-auto">
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => setIsOpenCategory((prev) => !prev)}
              className="text-[#44444495]"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <TextField
            id="categoryInput"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            helperText=" "
            label="Назва категорії"
            name="categoryInput"
            sx={{
              width: "100%",
              my: 2,
              "& .MuiInputBase-input": {
                fontSize: "18px",
                "@media (max-width: 600px)": {
                  fontSize: "14px",
                },
              },
            }}
          />

          <div className="flex mb-auto">
            <ThemeProvider theme={theme}>
              <LoadingButton
                sx={{ m: 1 }}
                color="save"
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
      )}
      <div
        ref={containerRef}
        className={`hidden flex-col relative w-full sm:w-[30rem] h-[38rem] justify-start items-start border-[1px] border-[#5ba3bb] rounded-md ${
          isOpen ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        <h1 className="w-full text-center text-[1rem] sm:text-[1.2rem] text-[#333] font-semibold p-2 bg-[#5ba3bb]">
          Послуги
        </h1>
        {/* {error && (
        <div className="flex justify-center items-center w-full h-full">
          <Alert
            className="flex justify-center items-center"
            severity="warning"
          >
            <h6>Помилка завантаження даних</h6>
            <p>Перевірте з'єднання</p>
          </Alert>
        </div>
      )}
      {!serverData && !error && (
        <div className="flex flex-col justify-center items-center w-full h-full p-10">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width="100%"
              height={40}
              sx={{ m: 1 }}
            />
          ))}
        </div>
      )}
      {isOpen && (
        <div className="flex flex-col w-full h-full items-center absolute inset-0 z-30 p-3 bg-white bg-opacity-50 backdrop-blur-sm">
          <div className="flex sticky top-2 right-2 ml-auto mb-auto">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => setIsOpen(false)}
              className="text-[#44444495]"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <TextField
            id="serviceInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText=" "
            label="Назва послуги"
            name="serviceInput"
            sx={{
              width: "100%",
              my: 5,
              "& .MuiInputBase-input": {
                fontSize: "18px",
                "@media (max-width: 600px)": {
                  fontSize: "14px",
                },
              },
            }}
          />

          <div className="flex mb-auto">
            <ThemeProvider theme={theme}>
              <LoadingButton
                sx={{ m: 1 }}
                color="save"
                onClick={handleSubmit}
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
      )}
      {serverData && (
        <>
          {serverData.map((service, index) => (
            <div
              onClick={() => {
                setSelectedRow(index);
              }}
              key={service.id}
              className={`flex ${
                selectedRow === index
                  ? "bg-[#e1f1f8] outline outline-2 outline-[#5ba3bb]"
                  : ""
              } justify-between w-full font-semibold text-[1rem] sm:text-[1.2rem] text-[#555] text-wrap py-2 px-5 hover:bg-[#e1f1f8] cursor-default`}
            >
              <p>
                <span className="mr-2">{index + 1}.</span>
                {service.name}
              </p>
              <span className="flex w-10 justify-center items-center ml-5 text-[#a7adaf60] hover:text-[#df9f8c] cursor-pointer">
                {selectedRow === index && isDeleting !== service.id ? (
                  <DeleteIcon
                    onClick={(e) => {
                      e.stopPropagation(); // Stop the event so that onClick does not fire on the <div>
                      deleteService(service.id);
                    }}
                  />
                ) : (
                  ""
                )}
                {isDeleting === service.id ? (
                  <CircularProgress size="1rem" />
                ) : (
                  ""
                )}
              </span>
            </div>
          ))}
        </>
      )}

      <span
        onClick={() => setIsOpen(true)}
        className="sticky bottom-2 right-2 ml-auto mt-auto text-red-300"
      >
        <Fab sx={{ zIndex: 0 }} color="primary" size="small" aria-label="add">
          <AddIcon />
        </Fab>
      </span> */}
      </div>
    </div>
  );
};

export default Pricing;
