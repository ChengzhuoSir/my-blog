(() => {
  const renderReveal = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((item, index) => {
      const delay = item.dataset.revealDelay || `${index * 120}ms`;
      item.style.animationDelay = delay;
      item.classList.add("is-visible");
    });
  };

  const renderMermaid = () => {
    const mermaidBlocks = document.querySelectorAll(
      "pre > code.language-mermaid, pre > code.lang-mermaid, pre.language-mermaid"
    );
    if (!mermaidBlocks.length || !window.mermaid) {
      return false;
    }
    mermaidBlocks.forEach((block) => {
      const target = block.tagName.toLowerCase() === "pre" ? block : block.parentElement;
      if (!target || target.dataset.mermaidProcessed === "true") {
        return;
      }
      const container = document.createElement("div");
      container.className = "mermaid";
      container.textContent =
        block.tagName.toLowerCase() === "pre" ? block.textContent : block.textContent;
      const wrapper =
        target.parentElement && target.parentElement.classList.contains("highlight")
          ? target.parentElement
          : target;
      wrapper.replaceWith(container);
      container.dataset.mermaidProcessed = "true";
    });
    window.mermaid.initialize({ startOnLoad: false, theme: "default" });
    const nodes = document.querySelectorAll(".mermaid");
    if (typeof window.mermaid.run === "function") {
      window.mermaid.run({ nodes });
    } else if (typeof window.mermaid.init === "function") {
      window.mermaid.init(undefined, nodes);
    }
    return true;
  };

  const addCopyButtons = () => {
    const blocks = document.querySelectorAll("pre > code");
    blocks.forEach((code) => {
      if (
        code.classList.contains("language-mermaid") ||
        code.classList.contains("lang-mermaid") ||
        code.classList.contains("no-copy")
      ) {
        return;
      }
      const pre = code.parentElement;
      if (!pre || pre.classList.contains("no-copy")) {
        return;
      }
      let wrapper =
        pre.closest(".highlighter-rouge") || pre.closest(".highlight") || pre;
      if (wrapper === pre) {
        const container = document.createElement("div");
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(pre);
        wrapper = container;
      }
      if (wrapper.dataset.copyReady === "true") {
        return;
      }
      wrapper.dataset.copyReady = "true";
      wrapper.classList.add("code-wrap");

      const lang = getLanguageLabel(code);
      const langTag = document.createElement("span");
      langTag.className = "code-lang";
      langTag.textContent = lang;

      const toast = document.createElement("span");
      toast.className = "code-toast";
      toast.textContent = "复制成功";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.textContent = "复制";
      let resetTimer;
      let toastTimer;
      button.addEventListener("click", async () => {
        const text = code.innerText;
        const ok = await copyText(text);
        button.textContent = ok ? "已复制" : "失败";
        button.classList.toggle("copied", ok);
        toast.textContent = ok ? "复制成功" : "复制失败";
        toast.classList.add("show");
        if (resetTimer) {
          clearTimeout(resetTimer);
        }
        if (toastTimer) {
          clearTimeout(toastTimer);
        }
        resetTimer = setTimeout(() => {
          button.textContent = "复制";
          button.classList.remove("copied");
        }, 1200);
        toastTimer = setTimeout(() => {
          toast.classList.remove("show");
        }, 1400);
      });
      wrapper.appendChild(langTag);
      wrapper.appendChild(toast);
      wrapper.appendChild(button);
    });
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        return false;
      }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  };

  const getLanguageLabel = (code) => {
    const langClass = Array.from(code.classList).find((cls) =>
      cls.startsWith("language-")
    );
    if (!langClass) {
      return "CODE";
    }
    let lang = langClass.replace("language-", "").toLowerCase();
    if (["plaintext", "text", "txt", "plain"].includes(lang)) {
      return "TEXT";
    }
    if (["bash", "shell", "sh", "zsh"].includes(lang)) {
      return "SHELL";
    }
    if (lang === "cpp") {
      return "C++";
    }
    if (lang === "csharp") {
      return "C#";
    }
    if (lang === "objective-c") {
      return "OBJ-C";
    }
    return lang.toUpperCase();
  };

  const renderMath = () => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise();
      return true;
    }
    return false;
  };

  const run = () => {
    renderReveal();
    const rendered = renderMermaid();
    addCopyButtons();
    if (!renderMath()) {
      scheduleMath();
    }
    if (!rendered) {
      scheduleMermaid();
    }
  };

  const scheduleMermaid = (retries = 8) => {
    if (retries <= 0) {
      return;
    }
    setTimeout(() => {
      if (!renderMermaid()) {
        scheduleMermaid(retries - 1);
      } else {
        renderMath();
      }
    }, 400);
  };

  const scheduleMath = (retries = 8) => {
    if (retries <= 0) {
      return;
    }
    setTimeout(() => {
      if (!renderMath()) {
        scheduleMath(retries - 1);
      }
    }, 400);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
