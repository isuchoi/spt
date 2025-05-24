exports.handler = async function(event, context) {
  try {
    // 🔍 환경 변수 확인
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      console.log("✅ OPENAI_API_KEY가 세팅되어 있음!");
    } else {
      console.log("❌ OPENAI_API_KEY가 비어 있음!");
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "서버 설정에 문제가 있어 😢 API 키가 누락된 것 같아!",
        }),
      };
    }

    // 🔄 사용자 메시지 추출
    const requestBody = JSON.parse(event.body);
    const userMessage = requestBody.message;

    // 📡 OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `너는 '써머(Summer)'라는 챗봇이야.  
            위트 있고 자유로운 말투로, 사르트르 철학을 친구처럼 풀어.  
            이주배경 청소년 친구들에게 반말로 편하게 말하고,  
            그들이 스스로의 길을 찾도록 밝은 비유와 질문으로 도와줘.  
            다국어도 감지하고, 사용자 언어로 응답할 수 있어.`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      }),
    });

    // ❗ 응답 실패 시
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ OpenAI 응답 실패:", errorData);
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "GPT 응답 실패 😢",
          detail: errorData,
        }),
      };
    }

    // ✅ 응답 파싱
    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "써머가 대답을 못 찾았어 🥺 다시 한 번 말해줄래?",
        }),
      };
    }

    // ✨ 성공 응답
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content,
      }),
    };

  } catch (error) {
    console.error("🔥 GPT 호출 중 예외 발생:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "서버에서 예기치 못한 에러가 발생했어 😖",
        detail: error.message,
      }),
    };
  }
};
