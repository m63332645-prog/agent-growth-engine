
export const getGrowthInsights = async (stats: any, view: string) => {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stats, view }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "暂时无法生成AI建议，请继续保持努力！";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "暂时无法生成AI建议，请继续保持努力！";
  }
};

