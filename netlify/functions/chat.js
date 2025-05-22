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
        messages: [{ role: "user", content: userMessage }],
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
