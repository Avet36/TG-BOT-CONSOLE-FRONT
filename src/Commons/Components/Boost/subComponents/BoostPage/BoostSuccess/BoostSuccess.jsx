import { useDispatch, useSelector } from "react-redux";
import "./BoostSuccess.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BoostSuccess = ({ data, setSelectedItem }) => {
  const showSuccess = useSelector((state) => state?.homePage?.showSuccess);
  const dispatch = useDispatch();

  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);
  const token = useSelector((state) => state?.telegramLogin?.token);

  const navigate = useNavigate();

  const onCancelSuccess = () => {
    // dispatch(getHomePageDataThunk({ token }));
    setSelectedItem(false);
  };

  const formatTime = (hour) => {
    const day = Math.floor(hour / 24);
    const remainingHour = hour % 24;

    return day > 0
      ? `${day} day${day > 1 ? "s" : ""}`.trim()
      : `${remainingHour} hour${remainingHour > 1 ? "s" : ""}`;
  };

  return (
    <>
      <div className="successOverlay" onClick={onCancelSuccess}></div>
      <div className="success">
        <h3>Success</h3>
        <h3> Daily Boost</h3>
        <p>Farming Booster: </p>
        <p>
          X{data?.speed} for {formatTime(data?.duration)}{" "}
        </p>
        <button onClick={onCancelSuccess}>OK</button>
      </div>
    </>
  );
};
export default BoostSuccess;
