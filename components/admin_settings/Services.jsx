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
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

// Function for receiving data
const fetchData = async () => {
  const response = await fetch("/api/admin_setting/service");
  if (!response.ok) throw new Error("Помилка при отриманні даних");
  return response.json();
};

const Services = ({ onAlert }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const containerRef = useRef(null);

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
      mutate("/api/admin_setting/service");
      onAlert("success", "Запис успішно виконано");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ---Cancellation of line selection with a key Esc and delete with key Delete---//
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedRow(null);
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

  // ----Delete service function ---------//
  async function deleteService(id) {
    if (!id || id <= 0) {
      onAlert("warning", "Будь ласка, оберіть рядок");
      return;
    }
    setIsDeleting(id);
    try {
      const response = await fetch("/api/admin_setting/service/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || "Помилка видалення");
      }
      mutate("/api/admin_setting/service");
      onAlert("success", "Запис успішно видалено!");
    } catch (error) {
      console.error("Помилка видалення:", error);
      onAlert("error", "Сталася помилка при спробі видалення.");
    } finally {
      setIsDeleting(null);
    }
  }
  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/service", fetchData);
  const serverData = data;

  // ------------Close window function-----------------------//

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
  };

  return (
    <div className="flex w-full h-full justify-center items-center py-5">
      <div
        ref={containerRef}
        className="flex flex-col relative w-full sm:w-[30rem] h-[38rem] justify-start items-start bg-[#f5f5f5] rounded-md overflow-hidden"
      >
        <h1 className="w-full h-[4rem] text-center text-[1rem] sm:text-[1.2rem] text-[#333] font-semibold p-4 bg-[#5ba3bb]">
          Послуги
        </h1>
        {error && (
          <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full">
            <Alert
              className="flex justify-center items-center"
              severity="warning"
            >
              <h6>Помилка завантаження даних</h6>
              <p>Перевірте з'єднання</p>
            </Alert>
          </div>
        )}
        <div className="flex flex-col w-full h-[80%] overflow-auto">
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
            <div className="flex flex-col w-full h-full items-center absolute inset-0 z-30 p-3 bg-[#f5f5f5]">
              <div className="flex sticky top-2 right-2 ml-auto mb-auto">
                <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="close"
                  onClick={() => handleClose()}
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
                      ? "bg-[#1976D2] text-[#fff]"
                      : index % 2 === 0
                      ? "bg-[#eaeaea]"
                      : "bg-[#f5f5f5]"
                  } justify-between w-full font-semibold text-[1rem] sm:text-[1.2rem] text-[#555] text-wrap py-2 px-5 hover:bg-[#1976D2] hover:text-[#fff] cursor-default`}
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
        </div>
        <span
          onClick={() => setIsOpen(true)}
          className="sticky bottom-2 right-2 ml-auto mt-auto"
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
