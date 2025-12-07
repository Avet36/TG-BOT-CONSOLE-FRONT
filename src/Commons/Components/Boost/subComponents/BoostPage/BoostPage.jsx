import "./BoostPage.css";
import boostRocketIcon from "../../../../../Assets/Home/boost-roket-icon.svg";
import boostSuccessIcon from "../../../../../Assets/Home/boost-success-icon.svg";
import boostCristalIcon from "../../../../../Assets/Home/cristal-icon.svg";
import { useEffect, useState } from "react";
import Success from "./../../../Success/Success";
import { useDispatch, useSelector } from "react-redux";
import CountdownTimer from "./CountDown/CountDown";
import { getHomePageDataThunk } from "../../../../../Store/Middlewares/homePageData";
import { resetIsSuccess } from "../../../../../Store/Slices/telegramLoginSLice";
import BoostSuccess from "./BoostSuccess/BoostSuccess";
import {
  boostClaim,
  freeBoostEndedService,
  postPaymentDataBocBoost
} from "../../../../Services/boostService";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "react-toastify";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import {
  setUpdateboostData,
  setUpdateboostDataDeactivate
} from "../../../../../Store/Slices/homePageSlice";
import { useLocation } from "react-router-dom";
import { postWalletInfo } from "../../../../Services/profilService";

const BoostPage = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const token = useSelector((state) => state?.telegramLogin?.token);
  const dispatch = useDispatch();
  const showSuccess = useSelector((state) => state?.homePage?.showSuccess);

  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);

  const isAnyActive =
    Array.isArray(data) && data.some((item) => item.is_active);

  // ton variables
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  // need optimizate get

  const location = useLocation();

  useEffect(() => {
    if (isSuccess || (location.pathname === "/boosts" && token)) {
      // if (isSuccess) {
      dispatch(getHomePageDataThunk({ token }));
      dispatch(resetIsSuccess(false));
    }
  }, [isSuccess, location.pathname, dispatch, token]);

  const formatTime = (hour) => {
    const day = Math.floor(hour / 24);
    const remainingHour = hour % 24;

    return day > 0
      ? `${day} day${day > 1 ? "s" : ""}`.trim()
      : `${remainingHour} hour${remainingHour > 1 ? "s" : ""}`;
  };
  // for when user open modal  can't scroll
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };

    if (selectedItem) {
      document.body.style.overflow = "hidden";
      document.body.addEventListener("touchmove", preventScroll, {
        passive: false
      });
    } else {
      document.body.style.overflow = "";
      document.body.removeEventListener("touchmove", preventScroll);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, [selectedItem]);

  const handleOPenPopUp = async (item) => {
    try {
      const res = await boostClaim({ id: item?.id, token });
      if (res) {
        dispatch(setUpdateboostData(res));
        setSelectedItem(item);
      }

      return res;
    } catch (err) {}
  };

  const handleBuy = async (item) => {
    try {
      if (!wallet?.account?.address) {
        toast.error("Please connect your wallet first.", {
          autoClose: 1500
        });
        tonConnectUI.openModal();
        return;
      }

      const walletBalance = await getWalletBalance(rawAddress);

      const amountNeeded = item?.ton_price * 1e9;

      const destinationAddress =
        process.env.REACT_APP_PAYMENT_DESTINATION_ADDRESS ||
        "UQCLgHupBFquXlSxVUPm66DAR_HADugKgtclvEjaVoQesyar";

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: destinationAddress,
            amount: amountNeeded.toString()
            // you can also add payload here if needed
          }
        ]
      };

      // EXTRA CHECK: only send if tonConnectUI is ready
      if (tonConnectUI.connected) {
        const res = await tonConnectUI.sendTransaction(transaction);

        if (res?.boc) {
          const data = {
            id: item?.id,
            boc: res.boc
          };

          const resultBoost = await postPaymentDataBocBoost({ data, token });
          if (resultBoost) {
            dispatch(setUpdateboostDataDeactivate(resultBoost));
          }
        }

        toast.success("Transaction sent successfully!", {
          autoClose: 1500
        });
      } else {
        toast.error("Please connect your wallet first.", {
          autoClose: 1500
        });
        tonConnectUI.openModal();
      }
    } catch (err) {
      if (
        err?.message?.includes("Operation aborted") ||
        err?.name === "TonConnectError"
      ) {
      } else {
        toast.error("Transaction failed. Please try again.", {
          autoClose: 1500
        });
      }
    }
  };

  // Example function to get wallet balance (replace with actual logic)

  const getWalletBalance = async (address) => {
    try {
      const res = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
      );
      const data = await res.json();
      return parseInt(data.result); // Return balance in nanoTON
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);

      return 0; // Fallback to 0 if there's an error
    }
  };

  const handleTONPurchase = async (item) => {
    if (wallet?.account?.address) {
      handleBuy(item);
    } else {
      tonConnectUI.openModal();
    }
  };

  const handlePutFreeData = async (item) => {
    try {
      const res = await freeBoostEndedService({ id: item?.id, token });
      if (res) {
        dispatch(setUpdateboostDataDeactivate(res));
      }
      return res;
    } catch (err) {
      console.error("Failed to update boost:", err);

      toast.error("Failed to update boost");
    }
  };

  useEffect(() => {
    if (wallet && wallet.device.appName === "Tonkeeper") {
      const requiredProtocolVersion = 2; // Your dApp expects protocol v2 or higher
      if (
        wallet.device.platformVersion &&
        wallet.device.platformVersion < requiredProtocolVersion
      ) {
        toast.error(
          "Please update Tonkeeper to the latest version for full support."
        );
      }
    }

    const sendWalletInfo = async () => {
      try {
        const walletData = {
          connected: !!wallet,
          walletAddress: rawAddress || "",
          walletAppName: wallet?.appName || "",
          accountAddress: wallet?.account?.address || "",
          chain: wallet?.account?.chain || "",
          publicKey: wallet?.account?.publicKey || "",
          walletName: wallet?.name || "",
          walletImageUrl: wallet?.imageUrl || "",
          walletAboutUrl: wallet?.aboutUrl || "",
          bridgeUrl: wallet?.bridgeUrl || "",
          universalLink: wallet?.universalLink || ""
        };
        const res = await postWalletInfo(walletData, token);
      } catch (err) {
        console.error(err);

        toast.error("Failed to send wallet info.");
      }
    };
    if (wallet && rawAddress && token) {
      sendWalletInfo();
    }
  }, [rawAddress]);

  return (
    <div className="boostPage">
      <div className="boostPageSuccess">
        <img src={boostSuccessIcon} alt="boostSuccessIcon" />
        <div className="boostTexts">
          <p>Boost your CP farming with a powerful booster!</p>
          <p>
            You can use only one booster at a time. While one is active, others
            will be disabled.
          </p>
        </div>
      </div>

      <div className="boostPageContent">
        {Array.isArray(data) &&
          data.map((item, index) => (
            <>
              <div className="boostItem" key={index}>
                <img
                  src={boostRocketIcon}
                  alt={boostRocketIcon}
                  className="rocket"
                />

                {item.speed > 1 && (
                  <div className="boostDoubling">X {item.speed}</div>
                )}
                <div className="boostItemText">
                  <h2>
                    {" "}
                    {item?.is_free ? (
                      <span className="dailyBosst">Daily Boost</span>
                    ) : (
                      "Block Boost"
                    )}
                  </h2>
                  <p>Farming Booster: </p>
                  <p>
                    X{item.speed} for {formatTime(item?.duration)}{" "}
                  </p>
                </div>

                <div className="boostPrice">
                  {item?.is_active && item?.left_minutes ? (
                    <div className="timer">
                      <p>Active</p>
                      <CountdownTimer
                        seconds={item?.left_minutes}
                        onEnd={() => handlePutFreeData(item)}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        {item?.ton_price !== "0" ? (
                          <>
                            <img
                              src={boostCristalIcon}
                              alt="boostCristalIcon"
                            />
                            <p>{item?.ton_price}</p>
                          </>
                        ) : (
                          <p>Free</p>
                        )}
                      </div>
                      {item?.is_free ? (
                        <button
                          onClick={() => handleOPenPopUp(item)}
                          disabled={
                            (isAnyActive && !item?.is_active) ||
                            !item?.is_can_claim
                          }
                          style={{
                            color:
                              (isAnyActive && !item?.is_active) ||
                              !item?.is_can_claim
                                ? "#FFF"
                                : "",
                            backgroundColor:
                              (isAnyActive && !item?.is_active) ||
                              !item?.is_can_claim
                                ? "gray"
                                : ""
                          }}
                        >
                          Claim
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTONPurchase(item)}
                          disabled={isAnyActive && !item?.is_active}
                          style={{
                            color:
                              isAnyActive && !item?.is_active ? "#FFF" : "",
                            backgroundColor:
                              isAnyActive && !item?.is_active ? "gray" : ""
                          }}
                        >
                          Buy
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              {showSuccess && <Success />}
              {selectedItem && (
                <BoostSuccess
                  data={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default BoostPage;
