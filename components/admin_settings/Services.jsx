import React, { useState, useEffect, useRef } from "react";
// --------------Import MUI components-----------------//
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_Buttons/stylisation_button_MUI";

const Services = ({ onAlert }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [serverData, setServerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  // --------Get data from server------//
  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin_setting/service");
      if (!response.ok)
        throw new Error(result.message || "Помилка при отриманні даних");
      const data = await response.json();
      setServerData(data);
    } catch (error) {
      console.error(error);
    }
  };
  //--- The function of sending the form to the server ---//
  const handleSubmit = async () => {
    if (inputValue.trim().length === 0) {
      onAlert("warning", "Будь ласка, введіть назву послуги");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/admin_setting/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputValue }),
      });

      if (!response.ok)
        throw new Error(result.message || "Помилка при відправці даних");

      const result = await response.json();

      setInputValue("");
      onAlert("success", "Запис успішно виконано");
      fetchData();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---Cancellation of line selection with a key Esc and delete with key Delete---//
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedRow(null);
      }
      if (event.key === "Delete") {
        // handleDelete();
      }
    };

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSelectedRow(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full h-full justify-center items-center py-5">
      <div
        ref={containerRef}
        className={`flex flex-col relative w-auto min-w-0 sm:min-w-[30rem] h-[38rem] justify-start items-start border-[1px] border-[#5ba3bb] rounded-md ${
          isOpen ? "overflow-hidden" : "overflow-auto"
        }`}
      >
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
        {serverData.map((service, index) => (
          <div
            onClick={() => setSelectedRow(index)}
            key={service.id}
            className={`flex ${
              selectedRow === index
                ? "bg-[#e1f1f8] outline outline-2 outline-[#5ba3bb]"
                : ""
            } justify-between w-full font-semibold text-[1.2rem] text-[#555] py-2 px-10 hover:bg-[#e1f1f8] cursor-default`}
          >
            <p>
              <span className="mr-2">{index + 1}.</span>
              {service.name}
            </p>
            <span className="ml-5 text-[#a7adaf60] hover:text-[#df9f8c] cursor-pointer">
              <DeleteIcon />
            </span>
          </div>
        ))}

        <span
          onClick={() => setIsOpen(true)}
          className="sticky bottom-2 right-2 ml-auto mt-auto text-red-300"
        >
          <Fab sx={{ zIndex: 0 }} color="primary" size="small" aria-label="add">
            <AddIcon />
          </Fab>
        </span>
      </div>
    </div>
  );
};

export default Services;
