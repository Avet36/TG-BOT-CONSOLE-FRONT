import "./BoostPagePopUp.css";
import upgradePopUpLogoIcon from "../../../../../../Assets/Home/Upgrade/upgrade-popup-logo.svg";
import upgradeCancelIcon from "../../../../../../Assets/Home/Upgrade/upgrade-cancel.svg";
import upgradeLogoIcon from "../../../../../../Assets/Home/Upgrade/upgrade-logo.svg";
import upgradeTonIcon from "../../../../../../Assets/Home/Upgrade/upgrade-ton.svg";
import { useDispatch, useSelector } from "react-redux";
import { boostServicePost } from "../../../../../Services/upgradeService";
import { setUpdateboostData } from "../../../../../../Store/Slices/homePageSlice";
import {
  TonConnectButton,
  useTonWallet,
  useTonConnectUI,
  useTonAddress
} from "@tonconnect/ui-react";
import { toast } from "react-toastify";

const BoostPagePopUp = ({ setShow, data }) => {
  const [tonConnectUI] = useTonConnectUI();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.telegramLogin?.token);
  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  const handleBuy = async () => {
    try {
      if (!wallet?.account?.address) {
        toast.error("Please connect your wallet first.");
        return;
      }

      const walletBalance = await getWalletBalance(wallet.account.address);

      const amountNeeded = (data?.ton_price || 0) * 1e9; // Convert to nanoTON

      // if (walletBalance < amountNeeded) {
      //   const balanceShortage = (amountNeeded - walletBalance) / 1e9;
      //   toast.error(
      //     `You need ${balanceShortage.toFixed(
      //       2
      //     )} more TON to complete this transaction.`
      //   );
      //   return;
      // }

      const destinationAddress =
        process.env.REACT_APP_PAYMENT_DESTINATION_ADDRESS;
      if (!destinationAddress) {
        toast.error("Server error: Payment address not configured.");
        return;
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: destinationAddress,
            amount: amountNeeded.toString(),
            payload: createPayload(data?.id) // Attach payment info
          }
        ]
      };

      await tonConnectUI.sendTransaction(transaction);
      toast.success("Transaction sent!");
      setShow(false);
    } catch (err) {
      toast.error("Transaction failed.");
    }
  };

  // Mock example - replace with actual Ton blockchain RPC call
  const getWalletBalance = async (address) => {
    try {
      const res = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
      );
      const data = await res.json();
      return parseInt(data.result); // Return balance in nanoTON
    } catch (err) {
      return 0; // Fallback to 0 if there's an error
    }
  };
  // Helper to create payload (example)
  const createPayload = (paymentId) => {
    if (!paymentId) return undefined;
    const hexPaymentId = Buffer.from(paymentId.toString()).toString("hex");
    return `0x${hexPaymentId}`; // Basic conversion. Backend should know how to decode it.
  };

  const handleClickBuyNative = async () => {
    try {
      const obj = { id: data?.id, type: "native" };
      const response = await boostServicePost({ obj, token });

      if (response?.data) {
        dispatch(setUpdateboostData(response.data));
        toast.success("Purchase successful!");
      } else {
        toast.error("Purchase failed. Please try again.");
      }
      setShow(false);
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong during purchase.");
    }
  };

  const handleTONPurchase = async () => {
    if (wallet?.account?.address) {
      handleBuy();
    } else {
      tonConnectUI.openModal(); // Ask wallet to connect
    }
  };

  return (
    <>
      <div className="upgradeOverlay" onClick={() => setShow(false)}></div>
      <div className="upgradePopUp">
        <img
          src={upgradeCancelIcon}
          alt="Close"
          className="upgradeCancel"
          onClick={() => setShow(false)}
        />

        <div className="upgradePopUpText">
          <img src={upgradePopUpLogoIcon} alt="Upgrade" />
          <p>Select your preferred option to enhance your rewards</p>
        </div>
        <div className="greenLinePopUp"></div>

        <div className="upgradePopUpFooter">
          <div className="leftClaim">
            <img
              src={upgradeLogoIcon}
              alt="Native Token"
              className="upgradeLogoIcon"
            />
            <p>{data?.native_price || 0}</p>
            <button
              disabled={Boolean(data?.is_active)}
              onClick={handleClickBuyNative}
            >
              Buy
            </button>
          </div>
          <div className="rightClaim">
            <img
              src={upgradeTonIcon}
              alt="TON Token"
              className="upgradeTonIcon"
            />
            <p>{data?.ton_price || 0}</p>
            <button className="tonButton" onClick={handleTONPurchase}>
              Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoostPagePopUp;
