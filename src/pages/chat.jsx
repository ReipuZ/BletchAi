import { useState } from "react";

function Chat() {

  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");

  const sendMessage = async () => {

    const response = await fetch(
      "http://localhost:5000/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: input
        })

      }
    );

    const data = await response.json();

    setAnswer(data.reply);

  };

  return (

    <div>

      <input
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Tanya AI..."
      />

      <button onClick={sendMessage}>
        Kirim
      </button>

      <p>{answer}</p>

    </div>

  );

}

export default Chat;