
"use server";

interface TranslationPayload {
    textCluster: string[];
}

interface HuggingFaceTranslationResponse {
    translation_text: string;
}

const API_URL =
    "https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-en-ar";

export async function translateTextViaFreeAi(
    payload: TranslationPayload
): Promise<string[]> {
    const texts = payload.textCluster;

    if (!texts?.length) {
        return [];
    }

    const token = process.env.HF_TOKEN;

    if (!token) {
        console.error("HF_TOKEN is missing.");
        return texts;
    }

    try {
        const translatedResults = await Promise.all(
            texts.map(async (sourceText) => {
                if (!sourceText.trim()) {
                    return sourceText;
                }

                try {
                    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            inputs: sourceText,
                        }),
                        signal: AbortSignal.timeout(30000),
                    });

                    if (!response.ok) {
                        const errorBody = await response.text();

                        console.error(
                            "Translation API Error:",
                            response.status,
                            errorBody
                        );

                        return sourceText;
                    }

                    const result =
                        await response.json() as HuggingFaceTranslationResponse;

                    return result.translation_text ?? sourceText;

                } catch (error) {
                    console.error("Translation request failed:", error);
                    return sourceText;
                }
            })
        );

        return translatedResults;

    } catch (error) {
        console.error("Translation pipeline failed:", error);
        return texts;
    }
}
