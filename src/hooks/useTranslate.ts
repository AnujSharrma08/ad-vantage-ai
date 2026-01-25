'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

export function useTranslate(text: string): string {
    const { t, locale } = useTranslation();
    const [translatedText, setTranslatedText] = useState<string>(text);

    useEffect(() => {
        let isMounted = true;

        async function translate() {
            const result = await t(text);
            if (isMounted) {
                setTranslatedText(result);
            }
        }

        translate();

        return () => {
            isMounted = false;
        };
    }, [text, locale, t]);

    return translatedText;
}