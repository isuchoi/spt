async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;
  if (!message) return;

  displayMessage("user", message);
  input.value = "";

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      character: "telly"  // 🧠 텔리 전용 캐릭터 설정!
    }),
  });

  const data = await response.json();
  displayMessage("bot", data.reply);
}

function displayMessage(role, text) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = role;
  msg.innerText = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
