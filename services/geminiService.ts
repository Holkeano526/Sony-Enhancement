
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export async function enhancePortrait(base64Image: string, mimeType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Enhance the portrait while strictly preserving the subject’s identity with accurate facial geometry. 
    Do not change their expression or face shape. Only allow subtle feature cleanup without altering who they are.
    Keep the exact same background from the reference image. No replacements, no changes, no new objects, no layout shifts. The environment must look identical.
    The image must be recreated as if it was shot on a Sony A1, using an 85mm f1.4 lens, at f1.6, ISO 100, 1/200 shutter speed, cinematic shallow depth of field, perfect facial focus, and an editorial-neutral color profile.
    This Sony A1 + 85mm f1.4 setup is mandatory. The final image must clearly look like premium full-frame Sony A1 quality.
    Lighting must match the exact direction, angle, and mood of the reference photo. Upgrade the lighting into a cinematic, subject-focused style: soft directional light, warm highlights, cool shadows, deeper contrast, expanded dynamic range, micro-contrast boost, smooth gradations, and zero harsh shadows.
    Maintain neutral premium color tone, cinematic contrast curve, natural saturation, real skin texture (not plastic), and subtle film grain. No fake glow, no runway lighting, no oversmoothing.
    Render with cinematic editorial style, premium clarity, portrait crop, and keep the original environmental vibe untouched.
    Re-render the subject with improved realism, depth, texture, and lighting while keeping identity and background fully preserved.

    NEGATIVE INSTRUCTIONS:
    - No new background.
    - No background change.
    - No overly dramatic lighting.
    - No face morphing.
    - No fake glow.
    - No flat lighting.
    - No over-smooth skin.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    let resultImageUrl = '';
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          resultImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImageUrl) {
      throw new Error("Model did not return an enhanced image.");
    }

    return resultImageUrl;
  } catch (error: any) {
    throw error;
  }
}
