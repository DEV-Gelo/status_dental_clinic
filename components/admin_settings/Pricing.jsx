import React, { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useTranslations } from "next-intl";
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
// --------------Import React icons-----------------//
import { FaCheck } from "react-icons/fa6";

import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

// Function for receiving category data
const fetchData = async () => {
  const response = await fetch("/api/admin_setting/category");
  if (!response.ok) throw new Error("An error occurred while receiving data");
  return response.json();
};
// Function for receiving pricing data
const fetchPricingData = async () => {
  const response = await fetch("/api/admin_setting/pricing");
  if (!response.ok) throw new Error("An error occurred while receiving data");
  return response.json();
};

const Pricing = ({ onAlert }) => {
  // const [categoryId, setCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenEditRow, setIsOpenEditRow] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [serviceEdit, setServiceEdit] = useState("");
  const [priceEdit, setPriceEdit] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingRow, setIsDeletingRow] = useState(false);

  // ---------------Translations-----------------//
  const t = useTranslations("settings__Pricing");

  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/category", fetchData);
  const { data: dataPricing, error: errorPricing } = useSWR(
    "/api/admin_setting/pricing",
    fetchPricingData
  );

  // ---Cancellation of line selection with a key Esc and delete with key Delete---//
  const ignoreClickRef = useRef(false);
  const containerRefs = useRef(new Map());

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isOpen) {
        setSelectedRow(null);
        setSelectedCategory(null);
        setIsOpenEditRow(false);
        closeAddWindow();
      }
    };

    const handleClickOutside = (event) => {
      if (ignoreClickRef.current) {
        ignoreClickRef.current = false; // drop the flag
        return; // doing nothing — it was "inner click"
      }

      let isInsideAnyContainer = false;

      containerRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          isInsideAnyContainer = true;
        }
      });

      if (!isInsideAnyContainer && !isOpen) {
        setSelectedRow(null);
        setSelectedCategory(null);
        setIsOpenEditRow(false);
        closeAddWindow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  //--- The function of sending the form to the server ---//
  const handleSubmit = async () => {
    if (categoryInput.trim().length === 0) {
      onAlert("warning", t("NameService_alert"));
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/admin_setting/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryInput }),
      });

      if (!response.ok)
        throw new Error(result.message || t("Error sending data"));

      const result = await response.json();

      setCategoryInput("");
      mutate("/api/admin_setting/category");
      onAlert("success", t("SuccessAlert"));
      setIsOpenCategory(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ----Delete category function ---------//
  async function deleteCategory(id) {
    if (!id || id <= 0) {
      onAlert("warning", t("Missing deletion details"));
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin_setting/category/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || t("DeleteError"));
      }
      mutate("/api/admin_setting/category");
      onAlert("success", t("SuccessAlertDel"));
      setIsOpenDelete(false);
    } catch (error) {
      console.error(t("DeleteError"), error);
      onAlert("error", t("ErrorAlertDel"));
    } finally {
      setIsDeleting(false);
    }
  }

  //-------- Category editing function---------------//
  const handleEditSubmit = async (id) => {
    if (categoryName.trim().length === 0) {
      onAlert("warning", t("NameOfCategoryAlert"));
      return;
    }
    try {
      const response = await fetch(`/api/admin_setting/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) throw new Error(t("Update error"));

      mutate("/api/admin_setting/category");
      onAlert("success", t("SuccessUpdateCategoryAlert"));
      setIsOpenEdit(false);
    } catch (error) {
      console.error(error);
      onAlert("error", t("EditError"));
    }
  };

  //--- The function of sending the form to the server ---//
  const handlePriceSubmit = async (categoryId) => {
    if (service.trim().length === 0) {
      onAlert("warning", t("Please enter the service name"));
      return;
    }
    if (!price.trim() || isNaN(price)) {
      onAlert("warning", t("Please enter the price"));
      return;
    }
    try {
      setLoadingPrice(true);
      const response = await fetch("/api/admin_setting/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: service, price, categoryId }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || t("Error sending data"));

      setService("");
      setPrice("");
      mutate("/api/admin_setting/pricing");
      onAlert("success", t("SuccessAlert"));
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      onAlert("error", error.message || t("An error occurred"));
    } finally {
      setLoadingPrice(false);
    }
  };

  // ----Delete and Edite Price function ---------//
  const handlePriceAction = async (action, id, data = {}) => {
    if (!id || id <= 0) {
      onAlert("warning", t("Missing details for the operation"));
      return;
    }

    let method, body, successMessage, errorMessage, mutatePath;

    if (action === "delete") {
      method = "DELETE";
      body = JSON.stringify({ id });
      successMessage = t("SuccessAlertDel");
      errorMessage = t("Deletion error");
      mutatePath = "/api/admin_setting/pricing";
      setIsDeletingRow(id);
    } else if (action === "edit") {
      if (!data.name || data.name.trim().length === 0) {
        onAlert("warning", t("NameOfCategoryAlert"));
        return;
      }
      if (!data.price || data.price.trim().length === 0) {
        onAlert("warning", t("Please enter the price"));
        return;
      }

      method = "PUT";
      body = JSON.stringify(data);
      successMessage = t("SuccessUpdateCategoryAlert");
      errorMessage = t("EditError");
      mutatePath = "/api/admin_setting/pricing";
    } else {
      console.error(t("Unknown operation type"), action);
      return;
    }

    try {
      const response = await fetch(`/api/admin_setting/pricing/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || errorMessage);
      }
      setIsDeletingRow(null);
      mutate(mutatePath);
      onAlert("success", successMessage);

      if (action === "edit") setIsOpenEditRow(false);
    } catch (error) {
      console.error(errorMessage, error);
      onAlert("error", errorMessage);
    }
  };

  // -------Close add window function----------------//
  const closeAddWindow = () => {
    setIsOpen(false);
    setService("");
    setPrice("");
  };
  // -------Close category window function----------------//
  const closeCategoryWindow = () => {
    setIsOpenCategory((prev) => !prev);
    setCategoryInput("");
  };

  return (
    <div className="flex relative w-full h-full items-center justify-center flex-wrap overflow-auto">
      <span
        title={t("AddCategory")}
        onClick={() => closeCategoryWindow()}
        className="fixed top-[4rem] left-[0.8rem] sm:top-[2rem] sm:left-[10rem]"
      >
        <ThemeProvider theme={theme}>
          <Fab sx={{ zIndex: 0 }} color="primary" size="small" aria-label="add">
            <AddIcon />
          </Fab>
        </ThemeProvider>
      </span>
      {!data && !error && (
        <div className="flex justify-center items-center w-full h-full">
          <CircularProgress />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center w-full h-full">
          <Alert
            className="flex justify-center items-center"
            severity="warning"
          >
            <h6>{t("Error loading data")}</h6>
          </Alert>
        </div>
      )}
      {isOpenCategory && (
        <div className="flex flex-col sm:w-[30rem] h-auto justify-center items-center fixed z-30 mt-auto mr-auto rounded-md p-2 border-[1px] border-[#006eff] bg-[#fff]">
          <div className="flex sticky top-2 right-2 ml-auto mb-auto">
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => closeCategoryWindow()}
              className="text-[#44444495]"
              title={t("close")}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <TextField
            id="categoryInput"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            helperText=" "
            label={t("Name of the category")}
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
                onClick={handleSubmit}
                sx={{ m: 1 }}
                color="primary"
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

      {data &&
        data.map((category, index) => (
          <div
            ref={(el) => containerRefs.current.set(index, el)}
            onClick={() => {
              if (!isOpenEdit && !isOpenDelete && !isOpen) {
                ignoreClickRef.current = true;
                setSelectedCategory(index);
              }
            }}
            key={category.id}
            className={`flex flex-col relative w-full sm:w-[30rem] h-[30rem] m-2 sm:m-5 justify-start items-start rounded-md bg-[#f5f5f5] overflow-hidden ${
              selectedCategory === index
                ? "outline outline-2 outline-[#006eff]"
                : "outline-none"
            }`}
          >
            {/* ---------------------Category header and navbar------------------------------- */}
            <header className="flex justify-end items-center w-full h-[4rem] p-2 bg-[#006eff]">
              {/* ---------------Edit window---------------------- */}
              {selectedCategory === index && isOpenEdit && (
                <form className="flex absolute top-0 left-0 z-30 justify-center items-center w-full h-[4rem] p-[0.3rem] bg-[#006eff]">
                  <div className="flex flex-[20%]"></div>
                  <div className="flex flex-[60%] justify-center items-center">
                    <input
                      type="text"
                      name="categoryInputEdit"
                      id="categoryInputEdit"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="flex w-full px-3 py-1 rounded-sm bg-slate-200"
                    />
                  </div>
                  <div className="flex mr-3 flex-[20%] justify-end items-center">
                    <IconButton
                      size="small"
                      edge="start"
                      color="inherit"
                      aria-label="close"
                      onClick={() => handleEditSubmit(category.id)}
                      className="text-[#fff]"
                      title={t("Save")}
                    >
                      <FaCheck />
                    </IconButton>
                  </div>
                </form>
              )}

              <div className="flex flex-[15%]"></div>
              <div className="flex flex-[70%]">
                <h1 className="w-full text-center text-[1rem] sm:text-[1.2rem] text-white font-semibold ">
                  {category.name}
                </h1>
              </div>

              <nav className="flex flex-[15%] h-auto justify-end items-center">
                {selectedCategory === index && (
                  <>
                    <span title={t("Edit")}>
                      <EditIcon
                        onClick={() => {
                          setIsOpenEdit(true),
                            setSelectedCategory(index),
                            setCategoryName(category.name);
                        }}
                        sx={{
                          mx: 1,
                          color: "#00000030",
                          "@media (max-width: 600px)": {
                            fontSize: 20,
                          },
                          "&:hover": { color: "#fff", cursor: "pointer" },
                        }}
                      />
                    </span>
                    <span title={t("Delete")}>
                      <DeleteIcon
                        onClick={() => {
                          setSelectedCategory(index), setIsOpenDelete(true);
                        }}
                        sx={{
                          mx: 1,
                          color: "#00000030",
                          "@media (max-width: 600px)": {
                            fontSize: 20,
                          },
                          "&:hover": { color: "#fff", cursor: "pointer" },
                        }}
                      />
                    </span>
                  </>
                )}
              </nav>
            </header>
            {/* -------------------Service & price content ---------------------- */}
            <div className="flex flex-col w-full h-[75%] overflow-auto">
              {dataPricing &&
                dataPricing
                  .filter((pricing) => pricing.categoryId === category.id) // Filter by category
                  .map((pricing, index) => (
                    <div
                      ref={(el) => containerRefs.current.set(pricing.id, el)}
                      onClick={() => setSelectedRow(pricing.id)}
                      key={pricing.id}
                      className={`flex relative ${
                        selectedRow === pricing.id
                          ? "bg-[#e1f1f8] border-t-[1px] border-b-[1px] border-[#5ba3bb]"
                          : index % 2 === 0
                          ? "bg-[#f9f9f9]"
                          : "bg-[#f0f0f0]"
                      } justify-start w-full font-semibold text-[1rem] sm:text-[1.2rem] text-wrap p-2 hover:bg-[#e1f1f8] cursor-default`}
                    >
                      {/* -----------Edit window --------------- */}
                      {selectedRow === pricing.id && isOpenEditRow && (
                        <form className="flex absolute top-0 left-0 z-30 justify-center items-center w-full h-auto p-[0.3rem] bg-[#1976D2]">
                          <div className="flex flex-[60%]">
                            <input
                              type="text"
                              name="service"
                              id="service"
                              value={serviceEdit}
                              onChange={(e) => setServiceEdit(e.target.value)}
                              className="flex w-full px-3 py-1 rounded-sm bg-slate-200 text-[#444]"
                            />
                          </div>
                          <div className="flex flex-[30%] justify-center items-center">
                            <input
                              type="number"
                              name="price"
                              id="price"
                              value={priceEdit}
                              onChange={(e) => setPriceEdit(e.target.value)}
                              className="flex w-[6rem] px-3 py-1 rounded-sm bg-slate-200 text-[#444]"
                            />
                          </div>
                          <div className="flex mr-3 flex-[10%] justify-end items-center">
                            <IconButton
                              size="small"
                              edge="start"
                              color="inherit"
                              aria-label="close"
                              onClick={() =>
                                handlePriceAction("edit", pricing.id, {
                                  name: serviceEdit,
                                  price: priceEdit,
                                  categoryId: category.id,
                                })
                              }
                              className="text-[#fff]"
                              title={t("Save")}
                            >
                              <FaCheck />
                            </IconButton>
                          </div>
                        </form>
                      )}
                      {/*------------- Main content------------- */}
                      <div className="flex w-full">
                        <p>
                          <span className="mr-2">{index + 1}.</span>
                          {pricing.name}
                        </p>
                      </div>
                      <div className="flex w-full justify-end items-center ml-3">
                        <p className="flex items-center flex-nowrap">
                          {pricing.price}&nbsp;<span>{t("Currency")}</span>
                        </p>
                        <span
                          title={t("Edit")}
                          className="flex w-10 justify-center items-center ml-2 text-[#a7adaf60] hover:text-[#df9f8c] cursor-pointer"
                        >
                          {selectedRow === pricing.id && (
                            <EditIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpenEditRow(true);
                                setServiceEdit(pricing.name);
                                setPriceEdit(pricing.price);
                              }}
                            />
                          )}
                        </span>
                        <span
                          title={t("Delete")}
                          className="flex w-10 justify-center items-center ml-1 text-[#a7adaf60] hover:text-[#df9f8c] cursor-pointer"
                        >
                          {selectedRow === pricing.id && !isDeletingRow && (
                            <DeleteIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePriceAction("delete", pricing.id);
                              }}
                            />
                          )}
                          {isDeletingRow === pricing.id ? (
                            <CircularProgress size="1rem" />
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    </div>
                  ))}

              {/* -------------------Add services window --------------------------- */}

              {selectedCategory === index && isOpen && (
                <div className="flex flex-col w-full h-full items-center absolute inset-0 z-30 p-3 bg-white">
                  <div className="flex sticky top-2 right-2 ml-auto mb-auto">
                    <IconButton
                      size="small"
                      edge="start"
                      color="inherit"
                      aria-label="close"
                      onClick={() => closeAddWindow()}
                      className="text-[#44444495]"
                      title={t("close")}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <TextField
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    helperText=" "
                    label={t("Name of the service")}
                    name="service"
                    sx={{
                      width: "100%",
                      my: 1,
                      "& .MuiInputBase-input": {
                        fontSize: "18px",
                        "@media (max-width: 600px)": {
                          fontSize: "14px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "16px",
                        "@media (max-width: 600px)": {
                          fontSize: "14px",
                        },
                      },
                    }}
                  />
                  <TextField
                    id="price"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value.replace(/\D/g, ""))
                    }
                    helperText=" "
                    label={t("Cost")}
                    name="price"
                    type="number"
                    sx={{
                      width: "35%",
                      my: 1,
                      "& .MuiInputBase-input": {
                        fontSize: "18px",
                        "@media (max-width: 600px)": {
                          fontSize: "14px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "16px",
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
                        color="primary"
                        onClick={() => handlePriceSubmit(category.id)}
                        loading={loadingPrice}
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

              {/*------------------- Delete modal window -----------------------------*/}
              {selectedCategory === index && isOpenDelete && (
                <div className="flex flex-col absolute top-[8rem] left-0 w-[90%] h-auto mx-[0.8rem] sm:mx-[1.5rem] z-30 justify-center items-center bg-slate-100 border-[1px] p-1 sm:p-5 border-[#006eff] rounded-md">
                  <div className="flex mb-5">
                    <WarningAmberIcon sx={{ color: "#ffa726" }} />
                    <h6 className="w-full text-[0.8rem] sm:text-[1rem] text-center ml-1 sm:ml-3">
                      {t("delete the category")}{" "}
                      <strong>{category.name.toLowerCase()}</strong>{" "}
                      {t("and all content")}
                    </h6>
                  </div>
                  <div>
                    <LoadingButton
                      sx={{
                        m: { xs: 1, sm: 1.5 },
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: 12, sm: 14, md: 16 },
                      }}
                      variant="outlined"
                      loading={isDeleting}
                      loadingPosition="end"
                      size="small"
                      onClick={() => deleteCategory(category.id)}
                    >
                      {!isDeleting ? t("Yes") : t("Deleting")}
                    </LoadingButton>
                    <LoadingButton
                      sx={{
                        m: { xs: 1, sm: 1.5 },
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: 12, sm: 14, md: 16 },
                      }}
                      variant="outlined"
                      size="small"
                      onClick={() => setIsOpenDelete(false)}
                    >
                      {t("No")}
                    </LoadingButton>
                  </div>
                </div>
              )}
            </div>
            <span
              title={t("AddService_title")}
              onClick={() => {
                setIsOpen(true), setSelectedCategory(index);
              }}
              className="sticky bottom-2 right-2 ml-auto mt-auto"
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
        ))}
    </div>
  );
};

export default Pricing;
