import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Server-side Gemini API proxy route
  app.post('/api/insights', async (req, res) => {
    try {
      const { stats, view } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ 
          text: "提示：尚未配置 GEMINI_API_KEY。如需 AI 实时深度洞察，请在系统设置中配置 API Key。" 
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const modelName = 'gemini-2.5-flash';
      
      const prompt = `
        作为保险公司个险管理部的资深专家，请分析以下${view === 'PERSONAL' ? '代理人个人' : '团队'}数据并给出3条简短有力的成长建议：
        数据详情：${JSON.stringify(stats)}
        请用中文回复，包含鼓励的语气，指出弱项并提供具体的行动指南。
      `;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Insight Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate insights" });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
