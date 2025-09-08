onload = () => {
  // 🔹 Title xuất hiện từng chữ
  setTimeout(() => {
    document.body.classList.remove("not-loaded"); 

    const text = "TC";
    const titleElement = document.getElementById("title");

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

  // 🔹 Đồng bộ lyrics từng chữ, chia dòng theo từ
  (async () => {
    const response = await fetch("Music/lyrics.lrc");
    const lrcText = await response.text();
    const lines = lrcText.split("\n");

    const lyricsElement = document.getElementById("lyrics");
    const audio = document.getElementById("bgMusic");

    let lyrics = [];

    // Parse LRC
    lines.forEach(line => {
      const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        const text = match[3].trim();
        lyrics.push({ time, text });
      }
    });

    // Tạo li cho từng dòng
    lyrics.forEach(() => {
      const li = document.createElement("li");
      li.style.opacity = "0";
      li.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      lyricsElement.appendChild(li);
    });

    const liElements = lyricsElement.querySelectorAll("li");
    let lastIndex = -1;
    let intervalId = null;
    let musicStarted = false;

    // 🔹 Bật nhạc khi click bất kỳ đâu
    document.body.addEventListener("click", () => {
      if (!musicStarted) {
        audio.play().catch(err => console.log("Không thể phát nhạc:", err));
        musicStarted = true;
      }
    });

    audio.ontimeupdate = () => {
      const currentTime = audio.currentTime;

      let i = lyrics.findIndex((line, idx) => currentTime >= line.time && (idx === lyrics.length - 1 || currentTime < lyrics[idx + 1].time));
      if (i === -1) return;

      if (i !== lastIndex) {
        if (intervalId) clearInterval(intervalId);

        if (lastIndex >= 0) {
          liElements[lastIndex].style.opacity = "0";
          liElements[lastIndex].style.transform = "translateY(-20px)";
        }

        lastIndex = i;

        const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
        const chars = [...segmenter.segment(lyrics[i].text)].map(seg => seg.segment);

        // Chia nửa dòng, kéo tới khoảng trắng nếu cần
        let half = Math.ceil(chars.length / 2);
        while (half < chars.length && chars[half] !== " ") {
          half++;
        }

        let charIndex = 0;
        liElements[i].textContent = "";
        liElements[i].style.opacity = "1";
        liElements[i].style.transform = "translateY(20px)";

        intervalId = setInterval(() => {
          if (charIndex < chars.length) {
            const span = document.createElement("span");
            span.textContent = chars[charIndex];
            liElements[i].appendChild(span);

            if (charIndex === half - 1) {
              liElements[i].appendChild(document.createElement("br"));
            }

            charIndex++;
          } else {
            clearInterval(intervalId);
            intervalId = null;
            liElements[i].style.transform = "translateY(0)";
          }
        }, 50);
      }
    };
  })();
};
