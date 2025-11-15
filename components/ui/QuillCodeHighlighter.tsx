"use client";

import { useEffect } from "react";
import hljs from "highlight.js/lib/core";

// Import languages you need
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import php from "highlight.js/lib/languages/php";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("php", php);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);

export default function HighlightJsLoader() {
  useEffect(() => {
    // Delay untuk menghindari hydration mismatch
    const timer = setTimeout(() => {
      // Find all code blocks with ql-syntax class (from Quill editor)
      const codeBlocks = document.querySelectorAll("pre.ql-syntax:not([data-highlighted])");

      codeBlocks.forEach((block) => {
        try {
          // Try to auto-detect language and highlight
          hljs.highlightElement(block as HTMLElement);
          block.setAttribute("data-highlighted", "true");
        } catch (error) {
          console.error("Error highlighting code block:", error);
        }
      });

      // Also highlight regular code blocks
      document.querySelectorAll("pre code:not([data-highlighted])").forEach((block) => {
        try {
          hljs.highlightElement(block as HTMLElement);
          block.setAttribute("data-highlighted", "true");
        } catch (error) {
          console.error("Error highlighting code block:", error);
        }
      });
    }, 100); // 100ms delay setelah mount

    return () => clearTimeout(timer);
  }, []);

  return null;
}
