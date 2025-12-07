import "./Profile.css";
import fon from "../../../Assets/fon.png";
import profileWalletCancelIcon from "../../../Assets/Profile/profile-cancel.svg";
import { useEffect, useRef, useState } from "react";
import ProfileModal from "./ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet
} from "@tonconnect/ui-react";
import {
  deleteWalletInfo,
  getProfileData,
  postWalletInfo
} from "../../Services/profilService";
import { toast } from "react-toastify";
import { formatLargeNumber } from "./../../../utils/index";
import LogoAnimation from "../LogoAnimation/LogoAnimation";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const rawAddress = useTonAddress();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.telegramLogin?.token);
  const hasSentWallet = useRef(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [data, setData] = useState(null);
  // it needts to change
  const tg = window.Telegram?.WebApp;
  const userData = tg?.initDataUnsafe?.user;

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const data = await getProfileData({ token });
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token, dispatch]);

  const getShortAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      setShowModal(false);

      await tonConnectUI.disconnect();

      await deleteWalletInfo(token);
      hasSentWallet.current = false;
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  const handleConnect = async () => {
    if (isConnecting || rawAddress || !tonConnectUI) return;

    try {
      setIsConnecting(true);
      await tonConnectUI.openModal(); // safely open
    } catch (error) {
      console.error("TonConnect Error:", error.message || error);
      toast.error("Failed to connect to TON Wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Debugging wallet connection
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

        hasSentWallet.current = true;
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.msg || "Claim failed!";
        toast.error(msg);
      }
    };
    if (wallet && rawAddress && token && !hasSentWallet.current) {
      sendWalletInfo();
    }
  }, [rawAddress]);

  return (
    <>
      <img src={fon} alt="fon" className="fon" />
      {!data ? (
        <LogoAnimation />
      ) : (
        <div className="profil">
          <div className="imgAndName">
            <div className="profilImg">
              <img src={data?.photo_url} alt="profileDefaultImg" />
            </div>
            <h2>{data?.username}</h2>
          </div>

          <div className="profilBalance">
            <p>
              Balance:{" "}
              <span>$CP {data?.total_balance ? +data?.total_balance : 0}</span>
            </p>
          </div>

          <div className="profilLine"></div>

          <div className="profilWallet">
            <h2>Wallet</h2>
            {rawAddress ? (
              <div className="profilWalletItem">
                <p>{getShortAddress(rawAddress)}</p>
                <img
                  src={profileWalletCancelIcon}
                  alt="Disconnect wallet"
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            ) : (
              <p className="noWalletText">You have no wallet connected.</p>
            )}
          </div>

          <button
            className="tonButton"
            disabled={!!rawAddress}
            onClick={handleConnect}
          >
            {rawAddress ? "Connected" : "Connect TON Wallet"}
          </button>
        </div>
      )}

      {showModal && (
        <ProfileModal
          setShowModal={setShowModal}
          handleDelete={handleDisconnect}
        />
      )}
    </>
  );
};

export default Profile;
