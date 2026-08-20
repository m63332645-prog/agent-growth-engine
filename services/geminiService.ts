
import { GoogleGenAI } from "@google/genai";

export const getGrowthInsights = async (stats: any, view: string) => {
  // Use recommended initialization with named parameter and direct process.env.API_KEY access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = `
    作为保险公司个险管理部的资深专家，请分析以下${view === 'PERSONAL' ? '代理人个人' : '团队'}数据并给出3条简短有力的成长建议：
    数据详情：${JSON.stringify(stats)}
    请用中文回复，包含鼓励的语气，指出弱项并提供行动指南。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "暂时无法生成AI建议，请继续保持努力！";
  }
};
