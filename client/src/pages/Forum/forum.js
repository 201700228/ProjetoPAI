import Chat from "../../pages/Chat/chat.js";

const Forum = ({ authState }) => {
  return (
    <>
      <div style={{ display: "flex", height: "90vh" }}>
        <div style={{ width: "1000px", margin: "auto" }}>
          {/* <div style={{ backgroundColor: "yellow", padding: "25px", color: "black", fontSize: "40px", textAlign: "center", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                        Chat
                    </div> */}
          <Chat authState={authState} />
        </div>
      </div>
    </>
  );
};

export default Forum;
