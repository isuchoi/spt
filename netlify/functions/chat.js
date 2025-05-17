exports.handler = async function(event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const userMessage = requestBody.message;

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

    // ✅ 응답이 올바르지 않을 때 방어
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "에러가 발생했어 😢",
        detail: error.message,
      }),
    };
  }
};
