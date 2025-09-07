onload = () => {
  setTimeout(() => {
    // bỏ pause để chạy animation
    document.body.classList.remove("not-loaded");

    const text = "EM YÊU ANH"; // đổi sang tiếng Việt ok
    const titleElement = document.getElementById("title");

    // Dùng Intl.Segmenter để không bị tách dấu tiếng Việt
    const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
    const characters = [...segmenter.segment(text)].map(seg => seg.segment);

    characters.forEach((char, index) => {
      if (char !== " ") {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.setProperty("--delay", `${index * 0.15}s`);
        titleElement.appendChild(span);
      } else {
        titleElement.appendChild(document.createTextNode(" "));
      }
    });
  }, 1000);
};
