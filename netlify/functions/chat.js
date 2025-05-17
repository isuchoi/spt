exports.handler = async function(event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const userMessage = requestBody.message;

    // ✅ 테스트용 응답 강제 삽입 (OpenAI 호출 생략)
    const fakeReply = "나는 테스트 중이야! 써머가 곧 말을 시작할 거야 ☀️";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: fakeReply }),
    };

    // ❌ 아래 실제 OpenAI 호출은 지금은 주석 처리
    /*
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "써머가 대답을 못 찾았어 🥺 다시 한 번 말해줄래?",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
    */

  } catch (error) {
    console.error("🔥 테스트 중 에러:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "에러가 발생했어 😢",
        detail: error.message,
      }),
    };
  }
};
