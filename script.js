const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const copyLinkButton = document.querySelector(".copy-link-btn");
const shareUrlInput = document.querySelector(".share-link-box input");

copyLinkButton?.addEventListener("click", async () => {
  const url = shareUrlInput.value;

  try {
    await navigator.clipboard.writeText(url);
    copyLinkButton.textContent = "Copied!";
    setTimeout(() => {
      copyLinkButton.textContent = "Copy link";
    }, 1200);
  } catch (error) {
    copyLinkButton.textContent = "Copy failed";
    setTimeout(() => {
      copyLinkButton.textContent = "Copy link";
    }, 1200);
  }
});
