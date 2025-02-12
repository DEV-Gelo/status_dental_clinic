import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const loading = () => {
  return (
    <div className="flex w-full h-full justify-center items-center text-[4rem]">
      <CircularProgress size="3rem" />
    </div>
  );
};

export default loading;
