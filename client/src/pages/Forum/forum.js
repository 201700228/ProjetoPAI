import Chat from "../../pages/Chat/chat.js";

const Forum = ({ authState }) => {
  return (
    <>
      <div style={{ display: "flex", height: "90vh" }}>
        <div style={{ width: "1000px", margin: "auto" }}>
          <Chat authState={authState} />
        </div>
      </div>
    </>
  );
};

export default Forum;
