import { CSpinner } from "@coreui/react";
import React from "react";

const Loading = () => {
  return (
    <div className="text-center d-flex align-items-center justify-content-center vh-100">
      <div className="sk-spinner sk-spinner-pulse">
        <CSpinner size="lg" color="primary" />
      </div>
    </div>
  );
};

export default Loading;
