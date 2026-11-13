const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'nvidia/nemotron-3.5-lightning:free';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ erro: 'Mensagem obrigatória' });

  try {
    const resposta = await axios.post('https://api.openrouter.ai/api/v1/chat/completions', {
      model: MODEL,
      messages: [
        { role: 'system', content: 'Você é a Felixia, uma IA simpática, amigável e conversacional, fala português do Brasil.' },
        { role: 'user', content: userMessage }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ resposta: resposta.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ erro: 'Falha na resposta da IA', detalhe: err.message });
  }
});

const porta = process.env.PORT || 3000;
app.listen(porta, () => console.log(`Felixia rodando na porta ${porta}`));
