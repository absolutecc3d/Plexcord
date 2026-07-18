const copyButtons = document.querySelectorAll("[data-copy]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const originalText = button.textContent;
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select";
    }

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1500);
  });
});
