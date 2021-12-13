import { faCheckCircle, faCircle, faExclamationTriangle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast, ToastOptions } from "react-toastify";

export const centerToast: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const bottomRightToast: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

interface IProp {
  message: string;
}

interface INotify {
  title: string;
  body: string;
}

const Success = (prop: IProp) => (
  <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
    <FontAwesomeIcon className="toastSuccessIcon" icon={faCheckCircle} size="lg" color="#45D42D" />
    <div style={{ color: "#333333", marginLeft: "5px" }}>{prop.message}</div>
  </div>
);

const Error = (prop: IProp) => (
  <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
    <FontAwesomeIcon className="toastSuccessIcon" icon={faExclamationTriangle} size="lg" color="#DC3545" />
    <div style={{ color: "#DC3545", marginLeft: "5px" }}>{prop.message}</div>
  </div>
);

const Info = (prop: IProp) => (
  <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
    <FontAwesomeIcon className="toastSuccessIcon" icon={faInfoCircle} size="lg" color="#007bff" />
    <div style={{ color: "#333333", marginLeft: "5px" }}>{prop.message}</div>
  </div>
);

const Notify = (prop: INotify) => (
  <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
    <FontAwesomeIcon className="toastSuccessIcon mr-1 mt-1" icon={faCircle} size="sm" color="#007bff" />
    <div style={{ color: "#333333", marginLeft: "5px" }}>
      <b>{prop.title}</b>
      <br />
      {prop.body}
    </div>
  </div>
);

export const ToastSuccess = (message: string) => {
  if (message) {
    toast(<Success message={message} />, centerToast);
  }
};

export const ToastError = (message: string) => {
  if (message) {
    toast(<Error message={message} />, centerToast);
  }
};

export const ToastInfo = (message: string) => {
  if (message) {
    toast(<Info message={message} />, centerToast);
  }
};

export const ToastNotification = (title: string, body: string) => {
  if (title && body) {
    toast(<Notify title={title} body={body} />, bottomRightToast);
  }
};
