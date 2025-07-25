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

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const [editLoadingPrice, setEditLoadingPrice] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [order, setOrder] = useState("");
  const [dataOrder, setDataOrder] = useState("");
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // -----MUI Kebab Menu-----//
  const ITEM_HEIGHT = 48;

  const [menuState, setMenuState] = React.useState({
    anchorEl: null,
    openForIndex: null, // index or id of the element for which the menu is opened
  });

  const handleClick = (event, id) => {
    setMenuState({
      anchorEl: event.currentTarget,
      openForIndex: id,
    });
  };

  const handleClose = () => {
    setMenuState({
      anchorEl: null,
      openForIndex: null,
    });
  };

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

  // -----Event Escape Button-----//
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isOpen) {
        setSelectedRow(null);
        setSelectedCategory(null);
        setIsOpenEditRow(false);
        closeAddWindow();
      }
    };
    // -----Event Click Outside----//
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
        setIsOpenEdit(false);
        setIsOpenDelete(false);
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
        body: JSON.stringify({
          name: categoryInput,
          order: order ? parseInt(order, 10) : null,
        }),
      });

      if (!response.ok)
        throw new Error(result.message || t("Error sending data"));

      const result = await response.json();

      setCategoryInput("");
      setOrder("");
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
        body: JSON.stringify({
          name: categoryName,
          order: dataOrder !== "" ? Number(dataOrder) : null,
        }),
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
    if (!price.trim()) {
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
        body: JSON.stringify({ name: service, price, description, categoryId }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || t("Error sending data"));

      setService("");
      setPrice("");
      setDescription("");
      mutate("/api/admin_setting/pricing", undefined, { revalidate: true });
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

    setEditLoadingPrice(true);

    let method, body, successMessage, errorMessage, mutatePath;

    if (action === "delete") {
      method = "DELETE";
      body = JSON.stringify({ id });
      successMessage = t("SuccessAlertDel");
      errorMessage = t("Deletion error");
      mutatePath = "/api/admin_setting/pricing";
    } else if (action === "edit") {
      if (!data.name || data.name.trim().length === 0) {
        onAlert("warning", t("NameOfCategoryAlert"));
        setEditLoadingPrice(false);
        return;
      }
      if (!data.price || data.price.trim().length === 0) {
        onAlert("warning", t("Please enter the price"));
        setEditLoadingPrice(false);
        return;
      }

      method = "PUT";
      body = JSON.stringify(data);
      successMessage = t("SuccessUpdateCategoryAlert");
      errorMessage = t("EditError");
      mutatePath = "/api/admin_setting/pricing";
    } else {
      console.error(t("Unknown operation type"), action);
      setEditLoadingPrice(false);
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

      mutate(mutatePath);
      onAlert("success", successMessage);

      if (action === "edit") setIsOpenEditRow(false);
    } catch (error) {
      console.error(errorMessage, error);
      onAlert("error", errorMessage);
    } finally {
      setEditLoadingPrice(false);
    }
  };

  // -------Close add window function----------------//
  const closeAddWindow = () => {
    setIsOpen(false);
    setService("");
    setPrice("");
    setDescription("");
  };
  // -------Open/Close Category window function---------//
  const toggleCategoryWindow = () => {
    setIsOpenCategory((prev) => !prev);
    setCategoryInput("");
    setOrder("");
  };

  return (
    <div className="flex flex-col relative w-full h-full overflow-auto p-1 sm:p-5">
      <span
        title={t("AddCategory")}
        onClick={() => toggleCategoryWindow()}
        className="fixed top-[1rem] left-[1rem]"
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
        <div className="flex flex-col w-[calc(100%-4rem)] sm:w-auto sm:min-w-[30rem] sm:left-[calc(50%-15rem)] h-auto justify-center items-center fixed left-[3.5rem] top-[30%] z-30 rounded-md p-2 border-[1px] border-[#006eff] bg-[#fff]">
          <div className="flex sticky top-2 right-2 ml-auto mb-auto">
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => toggleCategoryWindow()}
              className="text-[#44444495]"
              title={t("close")}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <TextField
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value.replace(/\D/g, ""))}
            helperText=" "
            label={t("Order")}
            name="order"
            type="number"
            sx={{
              width: "auto",
              maxWidth: "8rem",
              "& .MuiInputBase-input": {
                fontSize: "18px",
                "@media (max-width: 600px)": {
                  fontSize: "14px",
                },
              },
            }}
          />
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
        [...data]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((category, index) => (
            <div
              ref={(el) => containerRefs.current.set(index, el)}
              onClick={() => {
                if (!isOpenEdit && !isOpenDelete && !isOpen) {
                  ignoreClickRef.current = true;
                  setSelectedCategory(index);
                }
              }}
              key={category.id}
              className={`flex flex-col relative w-full h-auto justify-start items-start rounded-md bg-[#f5f5f5] my-5 ${
                selectedCategory === index
                  ? "outline outline-2 outline-[#006eff]"
                  : "outline-none"
              }`}
            >
              {/* ---------------------Category header and navbar------------------------------- */}
              <header className="flex relative justify-end items-center w-full h-[4rem] min-h-[4rem] rounded-t-md p-2 bg-[#006eff]">
                {/* ---------------Edit window---------------------- */}
                {selectedCategory === index && isOpenEdit && !isOpenEditRow && (
                  <form className="flex absolute top-0 left-0 z-30 justify-center items-center w-full h-[4rem] p-[0.3rem] bg-[#006eff]">
                    <div className="flex flex-[20%]"></div>
                    <div className="flex flex-[60%] justify-center items-center">
                      <span className="text-white mx-2">№</span>
                      <input
                        type="number"
                        name="orderEdit"
                        id="orderEdit"
                        value={dataOrder}
                        onChange={(e) =>
                          setDataOrder(e.target.value.replace(/\D/g, ""))
                        }
                        className="flex w-[3rem] px-3 py-1 mr-3 rounded-sm bg-slate-200"
                      />
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
                        className="text-[#fff] hover:text-green-500"
                        title={t("Save")}
                      >
                        <FaCheck />
                      </IconButton>
                    </div>
                  </form>
                )}

                <div className="flex flex-[15%]">
                  <span className="flex w-8 h-8 rounded-full justify-center items-center font-semibold bg-white">
                    {category.order}
                  </span>
                </div>
                <div className="flex flex-[70%]">
                  <h2 className="w-full text-center text-[1rem] sm:text-[1.2rem] text-white font-semibold ">
                    {category.name}
                  </h2>
                </div>

                <nav className="flex flex-[15%] h-auto justify-end items-center">
                  {selectedCategory === index && (
                    <>
                      <IconButton
                        aria-label="more"
                        id={`long-button-${category.id}`}
                        aria-controls={
                          menuState.openForIndex === category.id
                            ? `long-menu-${category.id}`
                            : undefined
                        }
                        aria-expanded={
                          menuState.openForIndex === category.id
                            ? "true"
                            : undefined
                        }
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, category.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`long-menu-${category.id}`}
                        anchorEl={menuState.anchorEl}
                        open={menuState.openForIndex === category.id}
                        onClose={handleClose}
                        slotProps={{
                          paper: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: "auto",
                            },
                          },
                          list: {
                            "aria-labelledby": `long-button-${category.id}`,
                          },
                        }}
                      >
                        <MenuItem onClick={handleClose} title={t("Delete")}>
                          <DeleteIcon
                            onClick={() => {
                              setSelectedCategory(index), setIsOpenDelete(true);
                            }}
                            sx={{
                              color: "#00000030",
                              "@media (max-width: 600px)": {
                                fontSize: 20,
                              },
                              "&:hover": { color: "#000", cursor: "pointer" },
                            }}
                          />
                        </MenuItem>
                        <MenuItem onClick={handleClose} title={t("Edit")}>
                          <EditIcon
                            onClick={() => {
                              setIsOpenEdit(true), setIsOpenEditRow(false);
                              setSelectedRow(null);
                              setSelectedCategory(index),
                                setCategoryName(category.name);
                              setDataOrder(category.order);
                            }}
                            sx={{
                              color: "#00000030",
                              "@media (max-width: 600px)": {
                                fontSize: 20,
                              },
                              "&:hover": { color: "#000", cursor: "pointer" },
                            }}
                          />
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </nav>
              </header>
              {/* -------------------Service & price content ---------------------- */}
              <div className="flex flex-col w-full min-h-[20rem] rounded-md overflow-hidden pb-16">
                {dataPricing &&
                  dataPricing
                    .filter((pricing) => pricing.categoryId === category.id)
                    .sort((a, b) => a.id - b.id) // fixed order
                    .map((pricing, index) => (
                      <div
                        key={pricing.id}
                        onClick={() => setSelectedRow(pricing.id)}
                        ref={(el) => containerRefs.current.set(pricing.id, el)}
                        className={`flex ${
                          selectedRow === pricing.id
                            ? "bg-[#e1f1f8] border-t-[1px] border-b-[1px] border-[#5ba3bb]"
                            : index % 2 === 0
                            ? "bg-[#f9f9f9]"
                            : "bg-[#f0f0f0]"
                        } justify-start w-full h-auto font-semibold text-[1rem] sm:text-[1.2rem] text-wrap p-2 hover:bg-[#e1f1f8] cursor-default`}
                      >
                        {/* -----------Edit window --------------- */}
                        {selectedRow === pricing.id &&
                          isOpenEditRow &&
                          !isOpenCategory && (
                            <form className="flex flex-col w-full h-full items-center justify-center absolute inset-0 z-30 rounded-md p-3 bg-white border-[2px] border-[#006eff]">
                              <div className="flex stiky top-2 right-2 ml-auto mb-auto">
                                <IconButton
                                  size="small"
                                  edge="start"
                                  color="inherit"
                                  aria-label="close"
                                  onClick={() => setIsOpenEditRow(false)}
                                  className="text-[#44444495]"
                                  title={t("close")}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </div>
                              <TextField
                                id="editService"
                                value={serviceEdit}
                                onChange={(e) => setServiceEdit(e.target.value)}
                                label={t("Name of the service")}
                                name="editService"
                                sx={{
                                  width: "80%",
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
                                id="editPrice"
                                value={priceEdit}
                                onChange={(e) => setPriceEdit(e.target.value)}
                                label={t("Cost")}
                                name="editPrice"
                                type="text"
                                sx={{
                                  width: "auto",
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
                                id="editDescription"
                                label={t("Description")}
                                multiline
                                rows={4}
                                value={editDescription}
                                onChange={(e) =>
                                  setEditDescription(e.target.value)
                                }
                                sx={{
                                  width: "80%",
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
                                    onClick={() =>
                                      handlePriceAction("edit", pricing.id, {
                                        name: serviceEdit,
                                        price: priceEdit,
                                        description: editDescription,
                                        categoryId: category.id,
                                      })
                                    }
                                    loading={editLoadingPrice}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    size="large"
                                  >
                                    {t("save")}
                                  </LoadingButton>
                                </ThemeProvider>
                              </div>
                            </form>
                          )}
                        {/*------------- Main content------------- */}
                        <div className="flex w-full">
                          <p className="pr-3">
                            <span className="mr-2">{index + 1}.</span>
                            {pricing.name}
                          </p>
                        </div>
                        <div className="flex w-auto justify-end items-center ml-3">
                          <p className="text-nowrap ml-2">
                            {pricing.price}
                            {/* <span>
                              {!isNaN(Number(pricing.price))
                                ? t("Currency")
                                : ""}
                            </span> */}
                          </p>
                          {selectedRow === pricing.id && (
                            <>
                              <IconButton
                                sx={{ ml: 2, p: 0 }}
                                aria-label="more"
                                id={`long-button-${pricing.id}`}
                                aria-controls={
                                  menuState.openForIndex === pricing.id
                                    ? `long-menu-${pricing.id}`
                                    : undefined
                                }
                                aria-expanded={
                                  menuState.openForIndex === pricing.id
                                    ? "true"
                                    : undefined
                                }
                                aria-haspopup="true"
                                onClick={(e) => handleClick(e, pricing.id)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id={`long-menu-${pricing.id}`}
                                anchorEl={menuState.anchorEl}
                                open={menuState.openForIndex === pricing.id}
                                onClose={handleClose}
                                slotProps={{
                                  paper: {
                                    style: {
                                      maxHeight: ITEM_HEIGHT * 4.5,
                                      width: "auto",
                                    },
                                  },
                                  list: {
                                    "aria-labelledby": `long-button-${pricing.id}`,
                                  },
                                }}
                              >
                                <MenuItem
                                  onClick={handleClose}
                                  title={t("Delete")}
                                >
                                  <DeleteIcon
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClose();
                                      handlePriceAction("delete", pricing.id);
                                    }}
                                    sx={{
                                      color: "#00000030",
                                      "@media (max-width: 600px)": {
                                        fontSize: 20,
                                      },
                                      "&:hover": {
                                        color: "#000",
                                        cursor: "pointer",
                                      },
                                    }}
                                  />
                                </MenuItem>
                                <MenuItem
                                  onClick={handleClose}
                                  title={t("Edit")}
                                >
                                  <EditIcon
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsOpenEditRow(true);
                                      setIsOpenEdit(false);
                                      setServiceEdit(pricing.name);
                                      setPriceEdit(pricing.price);
                                      setEditDescription(pricing.description);
                                      handleClose();
                                      setSelectedCategory(null);
                                    }}
                                    sx={{
                                      color: "#00000030",
                                      "@media (max-width: 600px)": {
                                        fontSize: 20,
                                      },
                                      "&:hover": {
                                        color: "#000",
                                        cursor: "pointer",
                                      },
                                    }}
                                  />
                                </MenuItem>
                              </Menu>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                {/* -------------------Add services window --------------------------- */}

                {selectedCategory === index && isOpen && (
                  <div className="flex flex-col w-full h-full items-center justify-center absolute inset-0 z-30 rounded-md p-3 bg-white">
                    <div className="flex stiky top-2 right-2 ml-auto mb-auto">
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
                      label={t("Name of the service")}
                      name="service"
                      sx={{
                        width: "80%",
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
                      onChange={(e) => setPrice(e.target.value)}
                      label={t("Cost")}
                      name="price"
                      type="text"
                      sx={{
                        width: "auto",
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
                      id="description"
                      label={t("Description")}
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      sx={{
                        width: "80%",
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
                  <div className="flex flex-col absolute top-[8rem] left-[calc(50%-15rem)] w-auto max-w-[30rem] h-auto mx-[0.8rem] sm:mx-[1.5rem] z-30 justify-center items-center bg-slate-100 border-[1px] p-1 sm:p-5 border-[#006eff] rounded-md">
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
                className="absolute bottom-2 right-2 ml-auto mt-auto p-2"
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
