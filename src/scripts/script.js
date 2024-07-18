window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const transitionPoint = documentHeight / 4;

  const sections = document.querySelectorAll("section");
  const heroHeight = document.querySelector(".hero").offsetHeight;
  const scrollTop = window.scrollY;

  // Calculate the background color transition
  if (scrollPosition >= transitionPoint) {
    document.body.style.backgroundColor = "white";
  } else {
    document.body.style.backgroundColor = "#a8d5ba";
  }

  // Calculate the opacity based on the scroll position relative to the transition point
  sections.forEach((section) => {
    let opacity = scrollTop / (heroHeight / 2);
    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    section.style.opacity = opacity.toString();
  });
});

document.querySelectorAll(".navbar nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

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

    // Adjust the height of the FAQ section
    //adjustFAQHeight();
  });
});

// function adjustFAQHeight() {
//   const faqSection = document.getElementById("faq");
//   let totalHeight = 0;
//   faqSection.querySelectorAll(".faq-item").forEach((item) => {
//     totalHeight += item.querySelector(".collapsible").offsetHeight;
//     if (item.querySelector(".content").style.display === "block") {
//       totalHeight += item.querySelector(".content").scrollHeight;
//     }
//   });
//   faqSection.style.height = `${totalHeight}px`;
// }

// // Initial adjustment on page load
// window.addEventListener("load", adjustFAQHeight);

// // Adjust FAQ height on window resize
// window.addEventListener("resize", adjustFAQHeight);

// // Adjust FAQ height on scroll
// window.addEventListener("scroll", adjustFAQHeight);
