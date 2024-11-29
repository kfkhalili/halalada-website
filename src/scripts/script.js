// Function to update the background color based on scroll position
function updateBackgroundColor() {
  const scrollPosition =
    Math.max(document.documentElement.scrollTop, document.body.scrollTop) +
    window.innerHeight;
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  const isMobile = window.innerWidth <= 768;

  const transitionPoint = isMobile ? documentHeight / 4 : documentHeight / 3;

  // Calculate the background color transition
  if (scrollPosition >= transitionPoint) {
    document.body.style.backgroundColor = "white";
  } else {
    document.body.style.backgroundColor = "#a8d5ba";
  }
}

// Update background color on scroll
window.addEventListener("scroll", updateBackgroundColor);

// Initialize background color on page load
document.addEventListener("DOMContentLoaded", updateBackgroundColor);

// Handle section opacity on scroll
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section");
  const heroHeight = document.querySelector(".hero").offsetHeight;
  const scrollTop = window.scrollY;

  sections.forEach((section) => {
    let opacity = scrollTop / (heroHeight / 2);
    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    section.style.opacity = opacity.toString();
  });
});

// Smooth scroll for navbar links
document.querySelectorAll(".navbar nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Collapsible sections logic
const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach((collapsible) => {
  collapsible.addEventListener("click", function () {
    const content = this.nextElementSibling;
    const arrow = this.querySelector(".arrow");

    // Close all other collapsibles
    collapsibles.forEach((item) => {
      const itemContent = item.nextElementSibling;
      const itemArrow = item.querySelector(".arrow");
      if (item !== this) {
        itemContent.style.display = "none";
        itemArrow.style.transform = "rotate(0deg)";
      }
    });

    // Toggle the clicked collapsible
    if (content.style.display === "block") {
      content.style.display = "none";
      arrow.style.transform = "rotate(0deg)";
    } else {
      content.style.display = "block";
      arrow.style.transform = "rotate(180deg)";
    }
  });
});
