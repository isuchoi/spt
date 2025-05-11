const chatbox = document.getElementById("chatbox");

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (text === "") return;
  appendMessage("user", text);
  input.value = "";

  const botReply = await getBotReply(text); // ✅ 여기 await 추가
  appendMessage("bot", botReply);           // ✅ 이제 제대로 답 나옴!
}

async function getBotReply(text) {
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  });

  const data = await response.json();
  return data.reply;
}
