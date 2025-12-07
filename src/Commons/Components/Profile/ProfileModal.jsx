import "./Profile.css";

const ProfileModal = ({ setShowModal,handleDelete }) => {
  return (
    <>
      <div className="profileOverlay" onClick={() => setShowModal(false)}></div>
      <div className="profilModal">
        <div className="profilText">
          <p>Are you sure you want to delete?</p>
        </div>

        <div className="modalButtons">
          <button className="yes" onClick={handleDelete}>Yes</button>
          <button className="no" onClick={() => setShowModal(false)}>
            No
          </button>
        </div>
      </div>
    </>
  );
};
export default ProfileModal;
