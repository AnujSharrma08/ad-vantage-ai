/* eslint-disable @typescript-eslint/no-explicit-any */

import { UsageTracker } from "../utils/usageTracker";

// Translation service using Google Translate API
export interface TranslationCache {
    [key: string]: string;
}

export async function translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
): Promise<string> {
    // Don't translate if target is English
    if (targetLanguage === 'en') {
        return text;
    }

    // Check cache first (only on client side)
    if (typeof window !== 'undefined') {
        const cacheKey = `translation_${sourceLanguage}_${targetLanguage}_${text}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            return cached; // Don't track cached translations
        }
    }

    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

        if (!apiKey) {
            console.error('Google Translate API key not found');
            return text;
        }

        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLanguage,
                    target: targetLanguage,
                    format: 'text',
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error('Translation error:', data.error);
            return text;
        }

        const translatedText = data.data.translations[0].translatedText;

        // Track usage (only for successful translations)
        if (typeof window !== 'undefined') {
            UsageTracker.trackTranslation(text);

            // Cache the translation
            const cacheKey = `translation_${sourceLanguage}_${targetLanguage}_${text}`;
            localStorage.setItem(cacheKey, translatedText);
        }

        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

// Batch translate multiple texts
export async function translateBatch(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
): Promise<string[]> {
    if (targetLanguage === 'en') {
        return texts;
    }

    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

        if (!apiKey) {
            console.error('Google Translate API key not found');
            return texts;
        }

        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: texts,
                    source: sourceLanguage,
                    target: targetLanguage,
                    format: 'text',
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error('Translation error:', data.error);
            return texts;
        }

        return data.data.translations.map((t: any) => t.translatedText);
    } catch (error) {
        console.error('Translation error:', error);
        return texts;
    }
}