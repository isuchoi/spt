exports.handler = async function(event, context) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "API 키가 설정되지 않았어요 😢" }),
      };
    }

    const requestBody = JSON.parse(event.body);
    const userMessage = requestBody.message;
    const character = requestBody.character || "summer";
    const userId = requestBody.userId || "anonymous"; // 사용자 구분 키

    // 🧠 메모리 기반 세션 저장소 (서버리스라서 임시)
    if (!global.userSessions) global.userSessions = {};
    if (!global.userSessions[userId]) global.userSessions[userId] = [];

    // 💬 캐릭터별 system 메시지
    let systemMessage = "";

    if (character === "popo") {
      systemMessage = "넌 포포야. 다정하고 느릿하며, 도가 철학처럼 흐르듯 말해. 간결하고 여백 있는 말투를 쓰고, 물처럼 자연스럽게 흘러가듯 대화해.";
    } else if (character === "telly") {
      systemMessage = "넌 텔리야. 소크라테스처럼 논리적이고 질문을 통해 상대의 생각을 이끌어내는 챗봇이야. 차분하지만 예리한 관찰력으로 대화를 이끌고, 사유를 자극해.";
    } else {
      systemMessage = "넌 써머야. 위트 있고 자유로운 말투로, 사르트르 철학을 친구처럼 풀어. 이주배경 청소년에게 반말로 편하게 말하고, 밝은 비유와 질문으로 자기 길을 찾도록 도와줘.";
    }

    // 💾 이전 흐름에 사용자 메시지 추가
    global.userSessions[userId].push({ role: "user", content: userMessage });

    // 🧠 전체 메시지 구성
    const messages = [
      { role: "system", content: systemMessage },
      ...global.userSessions[userId],
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "GPT 응답 실패 😢", detail: errorData }),
      };
    }

    const data = await response.json();

    // 💬 GPT 응답 저장
    global.userSessions[userId].push({
      role: "assistant",
      content: data.choices[0].message.content,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "서버 에러 발생 😖",
        detail: error.message,
      }),
    };
  }
};
