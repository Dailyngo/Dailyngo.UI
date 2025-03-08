import { useModal } from "@/hooks/useModal";
import { MODALS } from "@/hooks/useModal/types";
import { useStore } from "@/store";
import { ERRORS } from "@/store/slices/errorSlice";
import {  useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const FriendlyMessage = () => {
  const { errors } = useStore();
  const { modals, changeVisibility } = useModal();

  const { errorMessage, errorTitle, type, onOk } = errors[ERRORS.GENERIC_INFO_AND_ERRORS];

  const decideIcon = () => {
    switch (type) {
      case "error":
        return "material-symbols:close";
      case "success":
        return "mdi:success";
      case "warning":
        return "material-symbols:warning-outline";
      case "info":
        return "material-symbols:info-outline";
      default:
        return "material-symbols:close";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "error":
        return "text-red-600";
      case "success":
        return "text-emerald-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-red-600";
    }
  };

  const getDescColor = () => {
    switch (type) {
      case "error":
        return "text-red-500";
      case "success":
        return "text-emerald-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
  };

  const getLineBgColor = () => {
    switch (type) {
      case "error":
        return "bg-red-400";
      case "success":
        return "bg-emerald-400";
      case "warning":
        return "bg-yellow-400";
      case "info":
        return "bg-blue-400";
      default:
        return "bg-red-400";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "error":
        return "bg-red-100";
      case "success":
        return "bg-emerald-100";
      case "warning":
        return "bg-yellow-100";
      case "info":
        return "bg-blue-100";
      default:
        return "bg-red-100";
    }
  };

  const handleCloseModal = () => {
    changeVisibility(MODALS.GENERIC_MESSAGE_MODAL, false);
  };

  const isOpen = modals[MODALS.GENERIC_MESSAGE_MODAL]?.isOpen;

  useEffect(() => {
    setTimeout(() => {
      handleCloseModal();
    }, 10000);
  }, [isOpen]);
  return (
    <div
      className={`shadow-2xl font-satoshi fixed z-[2147483646] top-24 w-96 ${
        isOpen ? "right-5" : "-right-96"
      } rounded-md transition-all duration-300 flex justify-between ${getBgColor()}`}
    >
      <div className="flex">
        <div className={`w-2 ${getLineBgColor()} rounded-l-md`}></div>
        <div className="flex justify-center items-center ml-4">
          <div className={`flex justify-center items-center w-9 h-9 rounded-md ${getLineBgColor()}`}>
            <Icon icon={decideIcon()} className="text-white text-xl" />
          </div>
        </div>
        <div className="mt-4 mb-4 ml-4">
          <p className={`${getTitleColor()} font-bold`}> {errorTitle} </p>
          <p className={`${getDescColor()}`}> {errorMessage} </p>
        </div>
      </div>
      <Icon
        icon={"material-symbols:close"}
        className={`${getTitleColor()} text-xl m-2 cursor-pointer`}
        onClick={() => handleCloseModal()}
      />
      {/* <div className="flex justify-end">
        <Button label="Tamam" onClick={onOk} type="primary" />
      </div> */}
    </div>
  );
 
 
};

export default FriendlyMessage;
