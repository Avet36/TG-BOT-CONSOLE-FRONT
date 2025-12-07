import "./MiningProcess.css";
import miningLogo from "../../../../Assets/Home/home-logo.svg";
import miningBosstSpeedIcon from "../../../../Assets/Home/boost-roket-icon.svg";
import { useEffect, useState } from "react";
import Success from "./../../Success/Success";
import { useSelector, useDispatch } from "react-redux";
import { setUpdateHomeData } from "../../../../Store/Slices/homePageSlice";
import { toast } from "react-toastify";
import miningAnimation from "../../../../Assets/Home/mining-animation.svg";
import { motion } from "framer-motion";
import pureClient from "../../../Services";
import MiningBot from "./../../../MiningBot/MiningBot";
import { formatLargeNumber } from "./../../../../utils/index";

const totalSquares = 8;

const MiningProcess = () => {
  const token = useSelector((state) => state?.telegramLogin?.token);
  const showSuccess = useSelector((state) => state?.homePage?.showSuccess);
  const homeData = useSelector((state) => state?.homePage?.homeData);

  const dispatch = useDispatch();
  const userData = homeData?.user_mining_data;
  const [squares, setSquares] = useState(Array(totalSquares).fill(false));

  const [miningTimeLeft, setMiningTimeLeft] = useState(
    userData?.mining_left_second
  );
  const blockPoint = userData?.block_point; //block point value
  const boostSpeed = userData?.boost_speed; // this is boostSpped  if 1 should fill square 60 if 2 should 30 ...
  const [points, setPoints] = useState(userData?.mining_points); // this is my totoalPoint

  const totalMilisecond = 28800000;
  const timeForFillonesquare = 3600000 / boostSpeed;
  const hours = Math.round(miningTimeLeft / timeForFillonesquare);
  const [fractionalPart, setFractionApart] = useState(
    miningTimeLeft - hours * timeForFillonesquare
  );
  //this useEffect for whne user change page and return tg bot time work async
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const newFraction = miningTimeLeft - hours * timeForFillonesquare;
        setFractionApart(newFraction);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [miningTimeLeft, hours, timeForFillonesquare]);

  // this useEffect for fill squares derfault how many filles
  useEffect(() => {
    const newSquares = Array(totalSquares).fill(false);
    const squaresToFill = totalSquares - hours - 1;

    for (let i = 0; i < squaresToFill; i++) {
      newSquares[i] = true;
    }

    setSquares(newSquares);
  }, [hours]);

  // this useEffect for fill each square async

  useEffect(() => {
    if (fractionalPart === 0) return;

    const squareTimeout = setTimeout(() => {
      setSquares((prevSquares) => {
        const newSquares = [...prevSquares];
        if (hours < totalSquares) {
          newSquares[totalSquares - 1 - hours] = true;
        }
        return newSquares;
      });

      setFractionApart(miningTimeLeft - hours * timeForFillonesquare);
    }, fractionalPart);

    return () => {
      clearTimeout(squareTimeout);
    };
  }, [fractionalPart]);

  // this useEffect count down and mining date

  useEffect(() => {
    if (miningTimeLeft === 0) {
      setSquares(Array(totalSquares).fill(true));
      return;
    }

    // maining pointsi arzheqnery
    const valuePoint =
      (totalMilisecond / boostSpeed - userData?.mining_left_second) /
      userData?.mining_points;
    const number = 1000 / valuePoint;

    const countdownInterval = setInterval(() => {
      setPoints((prev) => {
        return prev + number;
      });
      setMiningTimeLeft((prev) => {
        if (prev > 1000) {
          return prev - 1000;
        } else {
          clearInterval(countdownInterval);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [
    blockPoint,
    boostSpeed,
    homeData,
    miningTimeLeft,
    points,
    userData?.mining_left_second,
    userData?.mining_points
  ]);

  const formatTime = (milliseconds) => {
    if (!milliseconds) return "00h 00m 00s";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  const handleClaim = async () => {
    try {
      const response = await pureClient.put(
        "user/mining-claim",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      dispatch(setUpdateHomeData(response.data));
      toast.success("Claimed successfully!");
      setSquares(Array(totalSquares).fill(false));
      setPoints(response.data?.user_mining_data?.mining_points);
      setMiningTimeLeft(response.data?.user_mining_data?.mining_left_second);
    } catch (err) {
      const msg = err?.response?.data?.msg || "Claim failed!";
      toast.error(msg);
    }
  };
  return (
    <>
      {showSuccess && <Success />}
      <div className="mining">
        <div className="miningHeader">
          <p className="miningText">Mining Process</p>
          <div className="miningSpeed">
            {homeData?.user_mining_data?.boost_speed > 1 && (
              <>
                <img src={miningBosstSpeedIcon} alt="miningBosstSpeedIcon" />
                <span>X {homeData?.user_mining_data?.boost_speed}</span>
              </>
            )}
          </div>

          <motion.div
            className="miningAnimation"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={miningAnimation} alt={miningAnimation} />
            <p>{homeData?.user_mining_data?.upgrade_level || 1}</p>
          </motion.div>
        </div>
        {homeData?.user_mining_data?.is_auto_claim ? (
          <MiningBot />
        ) : (
          <div className="squares">
            {squares.map((item, index) => {
              return (
                <div
                  key={index}
                  className="squareItem"
                  style={{
                    background: item ? "#64FFFF" : "transparent",
                    border: "1px solid #64FFFF"
                  }}
                ></div>
              );
            })}
          </div>
        )}

        <div className="miningTime">
          <span>Blocks complete in:</span>
          <span>{formatTime(miningTimeLeft)}</span>
        </div>
        <div className="oneBlock">
          One block point:{" "}
          <div className="oneBlockValue">
            $CP {formatLargeNumber(+blockPoint)}
          </div>
        </div>

        <div className="miningCompleted">
          <div className="squareCompleted">
            <img src={miningLogo} alt="miningLogo" />
          </div>
          <div className="completedText">
            <p>{formatLargeNumber(Math.round(+points))}</p>
          </div>
          <button
            onClick={handleClaim}
            disabled={
              !squares.some((item) => item === true) ||
              homeData?.user_mining_data?.is_auto_claim
            }
          >
            {homeData?.user_mining_data?.is_auto_claim ? "Autoclaim" : " Claim"}
          </button>
        </div>
        {showSuccess && <Success />}
      </div>
    </>
  );
};

export default MiningProcess;
