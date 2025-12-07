import { useDispatch, useSelector } from "react-redux";
import "./TaskSuccess.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatLargeNumber } from "./../../../../../utils/index";

const TaskSuccess = ({ data, setIsOpen }) => {
  const showSuccess = useSelector((state) => state?.homePage?.showSuccess);
  const dispatch = useDispatch();

  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);
  const token = useSelector((state) => state?.telegramLogin?.token);

  const navigate = useNavigate();

  const onCancelSuccess = () => {
    // dispatch(getHomePageDataThunk({ token }));
    setIsOpen(false);
  };

  //   const formatTime = (minutes) => {
  //     const hours = Math.floor(minutes / 60);
  //     const remainingMinutes = minutes % 60;

  //     return hours > 0
  //       ? `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${
  //           remainingMinutes > 1 ? "s" : ""
  //         }`.trim()
  //       : `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
  //   };

  return (
    <>
      <div className="successOverlay" onClick={onCancelSuccess}></div>
      <div className="success">
        <h3>Success</h3>
        {/* <h3> Block Boost</h3>
        <p>Farming Booster: </p> */}
        <p>You claimed {formatLargeNumber(+data?.amount)} point</p>
        <button onClick={onCancelSuccess}>OK</button>
      </div>
    </>
  );
};
export default TaskSuccess;
