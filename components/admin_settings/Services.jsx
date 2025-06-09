import React, { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useTranslations } from "next-intl";
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

const Services = ({ onAlert }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const containerRef = useRef(null);

  // ---------------Translations-----------------//
  const t = useTranslations("settings__Services");

  // Function for receiving data
  const fetchData = async () => {
    const response = await fetch("/api/admin_setting/service");
    if (!response.ok) throw new Error(t("fetchError"));
    return response.json();
  };

  //--- The function of sending the form to the server ---//
  const handleSubmit = async () => {
    if (inputValue.trim().length === 0) {
      onAlert("warning", t("NameService_alert"));
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
        throw new Error(result.message || t("Error sending data"));

      const result = await response.json();

      setInputValue("");
      mutate("/api/admin_setting/service");
      onAlert("success", t("SuccessAlert"));
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
      onAlert("warning", t("RowAlert"));
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
        throw new Error(errorResult.error || t("DeleteError"));
      }
      mutate("/api/admin_setting/service");
      onAlert("success", t("SuccessAlertDel"));
    } catch (error) {
      console.error(t("DeleteError"), error);
      onAlert("error", t("ErrorAlertDel"));
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
        className="flex flex-col relative w-full sm:w-[30rem] max-h-[35rem] min-h-[20rem] justify-start items-start bg-[#f5f5f5] rounded-md overflow-hidden"
      >
        <h1 className="w-full h-[4rem] text-center text-[1rem] sm:text-[1.2rem] text-white font-semibold p-4 bg-[#006eff]">
          {t("Services")}
        </h1>
        {error && (
          <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full">
            <Alert
              className="flex justify-center items-center"
              severity="warning"
            >
              <h6>{t("Error loading data")}</h6>
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
                label={t("Name of the service")}
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
                    {t("save")}
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
                      ? "bg-[#e1f1f8] border-t-[1px] border-b-[1px] border-[#5ba3bb]"
                      : index % 2 === 0
                      ? "bg-[#f9f9f9]"
                      : "bg-[#f0f0f0]"
                  } justify-between w-full font-semibold text-[1rem] sm:text-[1.2rem] text-wrap py-2 px-5 hover:bg-[#e1f1f8] cursor-default`}
                >
                  <p>
                    <span className="mr-2">{index + 1}.</span>
                    {service.name}
                  </p>
                  <span
                    title={t("DelService_title")}
                    className="flex w-10 justify-center items-center ml-5 text-[#a7adaf60] hover:text-[#df9f8c] cursor-pointer"
                  >
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
          title={t("AddService_title")}
          onClick={() => setIsOpen(true)}
          className="sticky bottom-0 p-1 right-2 ml-auto mt-auto"
        >
          <ThemeProvider theme={theme}>
            <Fab
              sx={{ zIndex: 0 }}
              color="primary"
              size="small"
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </ThemeProvider>
        </span>
      </div>
    </div>
  );
};

export default Services;
