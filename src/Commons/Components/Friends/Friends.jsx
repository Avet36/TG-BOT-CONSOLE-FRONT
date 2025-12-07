import "./Friends.css";
import "./Toast.css";
import { toast } from "react-toastify";
import fon from "../../../Assets/fon.png";
import { useEffect, useState } from "react";
import friendSuccessIcon from "../../../Assets/Friends/friend-success.svg";
import friendSuccessIconCopy from "../../../Assets/Friends/friend-success-copy.svg";
import friendsCancelIcon from "../../../Assets/Friends/friend-cancel.svg";
import "share-api-polyfill";
import { getHomePageDataThunk } from "../../../Store/Middlewares/homePageData";
import { useDispatch, useSelector } from "react-redux";
import { formatLargeNumber } from "./../../../utils/index";
import { getUserRefferalsDataThunk } from "../../../Store/Middlewares/userRefferalsMiddleware";

const Friends = () => {
  const [linkCopied, setLinkCopied] = useState("");
  const [referralLink, setReferralLink] = useState(window.location.href);
  const token = useSelector((state) => state?.telegramLogin?.token);
  const referalsData = useSelector((state) => state?.refferals?.referalsData);
  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);

  const dispatch = useDispatch();

  const copyReferalLink = () => {
    navigator.clipboard
      .writeText(referalsData?.ref_link)
      .then(() => {
        setLinkCopied(referalsData?.ref_link);
        toast.success(
          <div className="friendsSuccessDiv">
            <p className="friendSuccess">Success</p>
            <p className="friendSuccessText">Your link copied!</p>
          </div>,
          {
            icon: <img src={friendSuccessIconCopy} alt="friendSuccessIcon" />,
            closeButton: false,
            autoClose: 1500
          }
        );
      })
      .catch((err) => {
        toast.error(
          <div className="friendsSuccessDiv">
            <p className="friendCancel">Cancel</p>
            <p className="friendSuccessText">Something went wrong!</p>
          </div>,
          {
            icon: <img src={friendsCancelIcon} alt="friendsCancelIcon" />,
            closeButton: false,
            autoClose: 1500
          }
        );
      });
  };

  useEffect(() => {
    if (isSuccess || token) {
      dispatch(getUserRefferalsDataThunk({ token }));
    }
  }, [dispatch, token, isSuccess]);

  return (
    <>
      <img src={fon} alt="fon" className="fon" />
      <div className="friends">
        <h2>Invite Friends</h2>

        <div className="myFriends">
          <div className="myFriendsText">
            <p>My Friends</p>
          </div>

          <div className="myFriendsClaim">
            <p>
              Total amount:{" "}
              {formatLargeNumber(+referalsData?.ref_total_balance)} CP
            </p>
          </div>
        </div>

        <div className="friendsItems">
          {Array.isArray(referalsData?.referees) &&
          referalsData.referees.length > 0 ? (
            referalsData.referees.map((item, index) => (
              <div className="friend" key={index}>
                <div className="friendIntro">
                  <div className="friendImg">
                    <img src={item?.photo_url} alt="friendPhoto" />
                  </div>
                  <div className="friendText">
                    <p>{item?.username}</p>
                  </div>
                </div>
                <div className="friendCp">
                  <p>{item?.point}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="noFriends">
              <p>Hey 👋 You don't have any referrals yet.</p>
            </div>
          )}
        </div>

        <div className="friendPointSuccess">
          <img src={friendSuccessIconCopy} alt="friendSuccessIconCopy" />
          <p>+{referalsData?.ref_point} Points for every successful referral</p>
        </div>

        <div className="friendsButton">
          <button className="invite">Leaderboard</button>
          <button className="copy" onClick={copyReferalLink}>
            Copy referral link
          </button>
        </div>
      </div>
    </>
  );
};

export default Friends;
