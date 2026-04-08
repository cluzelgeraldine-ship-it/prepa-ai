const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, context } = req.body;
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        { role: "user", content: `Contexte: ${context}\n\nQuestion: ${message}` }
      ],
    });

    res.status(200).json({ reply: response.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
