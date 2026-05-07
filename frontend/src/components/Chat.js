import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log({ data })
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []);

  const joinChat = () => {
    socket.emit("join", { username, room });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", { text: message });
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <>
          <h2>Join Chat</h2>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinChat}>Join</button>
        </>
      ) : (
        <>
          <h2>Room: {room}</h2>

          <div
            style={{
              border: "1px solid #ccc",
              height: 300,
              overflowY: "auto",
              padding: 10,
              marginBottom: 10,
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.text}<strong>.  {msg.time}</strong>
              </div>
            ))}
          </div>

          <input
            value={message}
            placeholder="Type message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default Chat;
