import "./UpgradePopUp.css";
import upgradePopUpLogoIcon from "../../../../../../Assets/Home/Upgrade/upgrade-popup-logo.svg";
import upgradeCancelIcon from "../../../../../../Assets/Home/Upgrade/upgrade-cancel.svg";
import upgradeLogoIcon from "../../../../../../Assets/Home/Upgrade/upgrade-logo.svg";
import upgradeTonIcon from "../../../../../../Assets/Home/Upgrade/upgrade-ton.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  postPaymentDataBocUpgrade,
  upgradeServicePost
} from "./../../../../../Services/upgradeService";
import { setUpdateUbgradeData } from "../../../../../../Store/Slices/homePageSlice";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "react-toastify";
import { postWalletInfo } from "../../../../../Services/profilService";
import { useEffect } from "react";

const UpgradePopUp = ({ setShow, data }) => {
  const [tonConnectUI] = useTonConnectUI();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.telegramLogin?.token);
  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  const handleBuy = async () => {
    try {
      if (!wallet?.account?.address) {
        toast.error("Please connect your wallet first.");
        tonConnectUI.openModal();
        return;
      }

      const walletBalance = await getWalletBalance(rawAddress);

      const amountNeeded = data?.ton_price * 1e9;

      const destinationAddress =
        process.env.REACT_APP_PAYMENT_DESTINATION_ADDRESS ||
        "UQCLgHupBFquXlSxVUPm66DAR_HADugKgtclvEjaVoQesyar";

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: destinationAddress,
            amount: amountNeeded.toString()
          }
        ]
      };

      // EXTRA CHECK: only send if tonConnectUI is ready
      if (tonConnectUI.connected) {
        const res = await tonConnectUI.sendTransaction(transaction);

        if (res?.boc) {
          const dataPayment = {
            id: data?.id,
            boc: res.boc
          };

          const responseUpgrade = await postPaymentDataBocUpgrade({
            dataPayment,
            token
          });

          if (responseUpgrade) {
            setShow(false);
            dispatch(setUpdateUbgradeData(responseUpgrade));
          }
        }
        toast.success("Transaction sent successfully!");
      } else {
        toast.error("Please connect your wallet first.");
        tonConnectUI.openModal();
      }
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error("Transaction failed. Please try again.");
    }
  };

  // Example function to get wallet balance (replace with actual logic)
  const getWalletBalance = async (address) => {
    try {
      const res = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
      );
      const data = await res.json();

      return parseInt(data.result);
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
      return 0;
    }
  };

  // Handle purchase with native token
  const handleClickeBuyNative = async () => {
    const obj = {
      id: data?.id,
      type: "native"
    };
    const response = await upgradeServicePost({ obj, token });
    if (response) {
      dispatch(setUpdateUbgradeData(response?.data));
    }
    setShow(false);
  };

  const handleTONPurchase = async () => {
    if (wallet?.account?.address) {
      handleBuy();
    } else {
      tonConnectUI.openModal();
    }
  };

  useEffect(() => {
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
    <>
      <div className="upgradeOverlay" onClick={() => setShow(false)}></div>
      <div className="upgradePopUp">
        <img
          src={upgradeCancelIcon}
          alt="upgradeCancelIcon"
          className="upgradeCancel"
          onClick={() => setShow(false)}
        />

        <div className="upgradePopUpText">
          <img src={upgradePopUpLogoIcon} alt="upgradePopUpLogoIcon" />
          <p>Select your preferred option to enhance your rewards</p>
        </div>
        <div className="greenLinePopUp"></div>

        <div className="upgradePopUpFooter">
          <div className="leftClaim">
            <img
              src={upgradeLogoIcon}
              alt="upgradeLogoIcon"
              className="upgradeLogoIcon"
            />
            <p>{data?.native_price}</p>
            <button disabled={data?.is_active} onClick={handleClickeBuyNative}>
              Buy
            </button>
          </div>
          <div className="rightClaim">
            <img
              src={upgradeTonIcon}
              alt="upgradeTonIcon"
              className="upgradeTonIcon"
            />
            <p>{data?.ton_price}</p>
            <button
              className="tonButton"
              onClick={handleTONPurchase} // Open connection modal if wallet not connected
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradePopUp;
