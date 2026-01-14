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

  const renderMath = () => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise();
    }
  };

  const run = () => {
    renderReveal();
    const rendered = renderMermaid();
    renderMath();
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
