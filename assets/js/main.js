(() => {
  const revealItems = document.querySelectorAll("[data-reveal]");
  revealItems.forEach((item, index) => {
    const delay = item.dataset.revealDelay || `${index * 120}ms`;
    item.style.animationDelay = delay;
    item.classList.add("is-visible");
  });
})();
