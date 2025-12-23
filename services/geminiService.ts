
import { GoogleGenAI } from "@google/genai";
import { Task, TimerMode } from "../types";

// Fix: Initialize GoogleGenAI strictly following the provided guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFocusCoachAdvice = async (
  currentTask: Task | null, 
  mode: TimerMode, 
  sessionsCompleted: number
): Promise<string> => {
  try {
    const prompt = `
      Act as a high-performance productivity coach. 
      Current status:
      - Mode: ${mode}
      - Sessions completed today: ${sessionsCompleted}
      - Current task: ${currentTask ? currentTask.title : 'No specific task yet'}
      
      Provide a short, punchy (max 2 sentences) motivational advice or productivity tip 
      appropriate for the current state. 
      If it's focus mode, push for deep work. 
      If it's break mode, encourage true disconnection.
      If no task is selected, suggest picking one small win.
      Use a supportive but direct tone. Avoid cliches.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "Keep your eyes on the prize. You've got this.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focus is the superpower of the 21st century.";
  }
};