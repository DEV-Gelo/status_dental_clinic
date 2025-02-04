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

// Function for receiving data
const fetchData = async () => {
  const response = await fetch("/api/admin_setting/category");
  if (!response.ok) throw new Error("Помилка при отриманні даних");
  return response.json();
};

const Pricing = ({ onAlert }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const containerRef = useRef(null);

  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/category", fetchData);

  //--- The function of sending the form to the server ---//
  const handleSubmit = async () => {
    if (categoryInput.trim().length === 0) {
      onAlert("warning", "Будь ласка, введіть назву послуги");
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
        throw new Error(result.message || "Помилка при відправці даних");

      const result = await response.json();

      setCategoryInput("");
      mutate("/api/admin_setting/category");
      onAlert("success", "Запис успішно виконано");
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
      onAlert("warning", "Відсутні реквізити видалення");
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
        throw new Error(errorResult.error || "Помилка видалення");
      }
      mutate("/api/admin_setting/category");
      onAlert("success", "Запис успішно видалено!");
      setIsOpenDelete(false);
    } catch (error) {
      console.error("Помилка видалення:", error);
      onAlert("error", "Сталася помилка при спробі видалення.");
    } finally {
      setIsDeleting(false);
    }
  }

  //-------- Category editing function---------------//
  const handleEditSubmit = async (id) => {
    if (categoryName.trim().length === 0) {
      onAlert("warning", "Будь ласка, введіть назву категорії");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/admin_setting/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) throw new Error("Помилка при оновленні");

      mutate("/api/admin_setting/category");
      onAlert("success", "Категорію успішно оновлено!");
      setIsOpenEdit(false);
    } catch (error) {
      console.error(error);
      onAlert("error", "Помилка редагування");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex relative w-full h-full items-center justify-center flex-wrap overflow-auto">
      <span
        onClick={() => setIsOpenCategory((prev) => !prev)}
        className="fixed top-[4rem] left-[0.8rem] sm:top-[2rem] sm:left-[10rem]"
      >
        <Fab sx={{ zIndex: 0 }} color="primary" size="small" aria-label="add">
          <AddIcon />
        </Fab>
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
            <h6>Помилка завантаження даних</h6>
            <p>Перевірте з'єднання</p>
          </Alert>
        </div>
      )}
      {isOpenCategory && (
        <div className="flex flex-col sm:w-[30rem] h-auto justify-center items-center fixed z-30 mt-auto mr-auto rounded-md p-2 bg-[#ccdde4]">
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
                onClick={handleSubmit}
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

      {data &&
        data.map((category, index) => (
          <div
            key={category.id}
            ref={containerRef}
            className={`flex flex-col relative w-full sm:w-[30rem] h-[38rem] m-2 sm:m-5 justify-start items-start border-[1px] border-[#5ba3bb] rounded-md ${
              isOpen ? "overflow-hidden" : "overflow-auto"
            }`}
          >
            {/* ---------------------Category header and navbar------------------------------- */}
            <header className="flex justify-end items-center w-full h-[4rem] p-2 bg-[#5ba3bb]">
              {/* ---------------Edit modal window---------------------- */}
              {selectedCategory === index && isOpenEdit && (
                <form className="flex absolute top-0 left-0 z-30 justify-center items-center w-full h-[4rem] p-[0.3rem] bg-[#5ba3bb]">
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
                  <div className="flex flex-[20%] justify-end items-center">
                    <IconButton
                      size="small"
                      edge="start"
                      color="inherit"
                      aria-label="close"
                      onClick={() => handleEditSubmit(category.id)}
                      className="text-[#44444495]"
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </form>
              )}
              <div className="flex flex-[15%]"></div>
              <div className="flex flex-[70%]">
                <h1 className="w-full text-center text-[1rem] sm:text-[1.2rem] text-[#333] font-semibold ">
                  {category.name}
                </h1>
              </div>
              <nav className="flex flex-[15%] h-auto justify-end items-center">
                <EditIcon
                  onClick={() => {
                    setIsOpenEdit(true),
                      setSelectedCategory(index),
                      setCategoryName(category.name);
                  }}
                  sx={{
                    mx: 1,
                    color: "#77777750",
                    "@media (max-width: 600px)": {
                      fontSize: 20,
                    },
                    "&:hover": { color: "#777", cursor: "pointer" },
                  }}
                />
                <DeleteIcon
                  onClick={() => {
                    setSelectedCategory(index), setIsOpenDelete(true);
                  }}
                  sx={{
                    mx: 1,
                    color: "#77777750",
                    "@media (max-width: 600px)": {
                      fontSize: 20,
                    },
                    "&:hover": { color: "#777", cursor: "pointer" },
                  }}
                />
              </nav>
            </header>
            {/*------------------- Delete modal window -----------------------------*/}
            {selectedCategory === index && isOpenDelete && (
              <div className="flex flex-col absolute top-[8rem] left-0 w-[90%] h-auto mx-[0.8rem] sm:mx-[1.5rem] z-30 justify-center items-center bg-slate-100 border-[1px] p-1 sm:p-5 border-[#ffa726] rounded-md">
                <div className="flex mb-5">
                  <WarningAmberIcon sx={{ color: "#ffa726" }} />
                  <h6 className="w-full text-[0.8rem] sm:text-[1rem] text-center ml-1 sm:ml-3">
                    Ви дійсно бажаєте видалити категорію{" "}
                    <strong>{category.name.toLowerCase()}</strong> та увесь її
                    вміст?
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
                    {!isDeleting ? "ТАК" : "ВИДАЛЕННЯ..."}
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
                    Ні
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Pricing;
