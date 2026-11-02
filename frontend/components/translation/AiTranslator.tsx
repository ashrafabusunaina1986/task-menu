// frontend/components/translation/AiTranslator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FiGlobe, FiCpu } from "react-icons/fi";
import { translateTextViaFreeAi } from "@/lib/translation/server";

export default function AiTranslator() {
    const [currentLang, setCurrentLang] = useState("en");
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem("workora_lang") || "en";
        setCurrentLang(savedLang);

        if (savedLang === "ar") {
            document.documentElement.dir = "rtl";
            document.documentElement.lang = "ar";
            setTimeout(() => executeLiveAiPipeline(), 600);
        }
    }, []);

    const executeLiveAiPipeline = async () => {
        setIsTranslating(true);
        
        // # Scrape all localized raw text components from the active viewport
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        const textNodes: Node[] = [];
        const textStrings: string[] = [];

        let node;
        while ((node = walker.nextNode())) {
            const cleanText = node.nodeValue?.trim() || "";
            // # Filter out non-translatable interface symbols, icons, and operational back buttons
            if (cleanText.length > 1 && isNaN(Number(cleanText)) && !cleanText.includes("←") && !cleanText.includes("▼") && !cleanText.includes("📋")) {
                textNodes.push(node);
                textStrings.push(cleanText);
            }
        }

        if (textStrings.length === 0) {
            setIsTranslating(false);
            return;
        }

        // # Dispatch string bundles directly into the secure open-source AI server proxy pipeline
        const translatedArray = await translateTextViaFreeAi({ textCluster: textStrings });

        // # Force structural transformation by replacing active tree text parameters live
        textNodes.forEach((targetNode, index) => {
            if (translatedArray[index]) {
                targetNode.nodeValue = translatedArray[index];
            }
        });

        setIsTranslating(false);
    };

    const toggleLanguageWorkflow = async () => {
        if (currentLang === "en") {
            setCurrentLang("ar");
            localStorage.setItem("workora_lang", "ar");
            document.documentElement.dir = "rtl";
            document.documentElement.lang = "ar";
            await executeLiveAiPipeline();
        } else {
            setCurrentLang("en");
            localStorage.setItem("workora_lang", "en");
            document.documentElement.dir = "ltr";
            document.documentElement.lang = "en";
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Premium Open-Source AI Core Dynamic Switch Action Trigger Button */}
            <button
                type="button"
                disabled={isTranslating}
                onClick={toggleLanguageWorkflow}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-[11px] font-bold uppercase tracking-wider text-purple-400 hover:bg-purple-600 hover:text-white transition duration-150 cursor-pointer shadow-lg disabled:opacity-50 active:scale-[0.98]"
            >
                {isTranslating ? (
                    <>
                        <FiCpu className="text-xs animate-spin text-purple-500" />
                        <span className="text-gray-400">AI Localizing...</span>
                    </>
                ) : (
                    <>
                        <FiGlobe className="text-xs" />
                        <span>{currentLang === "en" ? "AI Translate (AR)" : "Switch to English"}</span>
                    </>
                )}
            </button>
        </div>
    );
}
