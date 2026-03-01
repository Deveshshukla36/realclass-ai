
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SubmissionFeedback, Concept, Question, ExamResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIExam = async (topic: string, language: string, count: number = 5): Promise<Question[] | null> => {
  const ai = getAI();
  const languageName = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali'
  }[language] || language;

  const prompt = `Generate a ${count}-question multiple choice exam for students on the topic: "${topic}". 
  Include questions that test deep conceptual understanding. 
  Each question should have 4 options and one clear answer.
  Provide a unique random ID (string) for each question.
  Target language for all content: ${languageName}.
  Format as a JSON array of objects.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              hint: { type: Type.STRING }
            },
            required: ["id", "question", "options", "answer", "hint"],
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (err) {
    console.error("Exam generation failed:", err);
    return null;
  }
};

export const generateCertificateVerification = async (studentName: string, courseTitle: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Create a 4-line poetic achievement statement for a student named "${studentName}" who completed the course "${courseTitle}". Format as a short verse. This is for the AMD Slingshot Hackathon project.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "Your dedication to learning has shaped your path to success.";
  } catch (err) {
    return "Achievement unlocked through cognitive excellence.";
  }
};

export const analyzeExamResult = async (score: number, total: number, topic: string, answers: any): Promise<{grade: string, analysis: string}> => {
  const ai = getAI();
  const percentage = (score / total) * 100;
  const prompt = `Analyze a student's performance in a ${topic} exam. 
  Score: ${score}/${total} (${percentage}%). 
  Provide a letter grade (A, B, C, D, F) and a detailed cognitive analysis. 
  Format as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            analysis: { type: Type.STRING }
          },
          required: ["grade", "analysis"]
        }
      }
    });
    return JSON.parse(response.text || '{"grade": "N/A", "analysis": "Analysis unavailable."}');
  } catch (err) {
    return { grade: "N/A", analysis: "AI analysis unavailable." };
  }
};

export const evaluateSubmission = async (text: string, type: string): Promise<SubmissionFeedback> => {
  const ai = getAI();
  const prompt = `Evaluate this ${type} submission: "${text}". Provide originality score (0-100), overall grade, criteria feedback, and check for plagiarism.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalityScore: { type: Type.NUMBER },
            overallGrade: { type: Type.STRING },
            cheatRisk: { type: Type.STRING },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  feedback: { type: Type.STRING }
                }
              }
            },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            citations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    throw new Error("Eval failed");
  }
};

export const generateAudioBrief = async (text: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (err) {
    return null;
  }
};

export const getConceptExplanation = async (concept: Concept, language: string, context: string = "") => {
  const ai = getAI();
  const languageName = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali'
  }[language] || language;

  const prompt = context 
    ? `Explain "${concept.name}" using the provided context: "${context}". Stepwise approach. Target language: ${languageName}.`
    : `Explain "${concept.name}" in ${languageName}. Tone: Academic Coach. Stepwise approach.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    return "Explanation currently unavailable.";
  }
};

export const transcribeAndTranslate = async (audioBase64: string, targetLang: string) => {
  const ai = getAI();
  const languageName = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali'
  }[targetLang] || targetLang;

  const prompt = `Transcribe this audio and translate it into ${languageName}. Return only the translated text.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      contents: [
        {
          inlineData: {
            mimeType: 'audio/webm',
            data: audioBase64
          }
        },
        { text: prompt }
      ]
    });
    return response.text;
  } catch (err) {
    console.error("Transcription failed:", err);
    return null;
  }
};
