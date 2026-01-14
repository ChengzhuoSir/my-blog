(() => {
  const onReady = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((item, index) => {
      const delay = item.dataset.revealDelay || `${index * 120}ms`;
      item.style.animationDelay = delay;
      item.classList.add("is-visible");
    });

    const mermaidBlocks = document.querySelectorAll(
      "pre > code.language-mermaid, pre > code.lang-mermaid"
    );
    if (mermaidBlocks.length && window.mermaid) {
      mermaidBlocks.forEach((block) => {
        const container = document.createElement("div");
        container.className = "mermaid";
        container.textContent = block.textContent;
        const pre = block.parentElement;
        const wrapper =
          pre && pre.parentElement && pre.parentElement.classList.contains("highlight")
            ? pre.parentElement
            : pre;
        wrapper.replaceWith(container);
      });
      window.mermaid.initialize({ startOnLoad: false, theme: "default" });
      const nodes = document.querySelectorAll(".mermaid");
      if (typeof window.mermaid.run === "function") {
        window.mermaid.run({ nodes });
      } else {
        window.mermaid.init(undefined, nodes);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
