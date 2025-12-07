import "./BotFirstModal.css";
import modalCancelIcon from "../../../../../../Assets/Home/cancel-assistant-icon.svg";
import cristalIcon from "../../../../../../Assets/Home/cristal-icon.svg";
import { toast } from "react-toastify";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useDispatch, useSelector } from "react-redux";
import { postWalletInfo } from "../../../../../Services/profilService";
import { useEffect } from "react";
import { postPaymentDataBocBot } from "../../../../../Services/userRefferalsService";
import { getHomePageDataThunk } from "../../../../../../Store/Middlewares/homePageData";
import { setUpdateBotData } from "../../../../../../Store/Slices/homePageSlice";

const BotFirstModal = ({ setShowModal, title, description, data }) => {
  const dispatch = useDispatch();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const rawAddress = useTonAddress();
  const token = useSelector((state) => state?.telegramLogin?.token);

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
            boc: res.boc
          };

          const responseBot = await postPaymentDataBocBot({
            dataPayment,
            token
          });
          if (responseBot) {
            setShowModal(false);
            dispatch(setUpdateBotData(responseBot));
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
      return 0;
    }
  };
  const handleTONPurchase = async () => {
    if (wallet?.account?.address) {
      try {
        await handleBuy();
        setShowModal(false);
      } catch (err) {
        console.error("Error in purchase:", err);
      }
    } else {
      tonConnectUI.openModal();
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
    <>
      <div
        className="botOverlayFirst"
        onClick={() => setShowModal(false)}
      ></div>
      <div className="botModalFirst">
        <img
          src={modalCancelIcon}
          alt="modalCancelIcon"
          onClick={() => setShowModal(false)}
          className="cancelBot"
        />
        <div className="modalTextFirst">
          <div className="modalTextIntro">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="modalToken">
          <h2>Token</h2>
          <div className="selectToken">
            <div className="textAndImg">
              <img src={cristalIcon} alt="cristalIcon" />
              <p>{data?.ton_price || 1}</p>
            </div>
          </div>
        </div>

        <button onClick={handleTONPurchase}>Buy</button>
      </div>
    </>
  );
};
export default BotFirstModal;
