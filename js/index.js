const title = document.querySelector('.title')
const text = "Gửi Anh";

// Sử dụng Segmenter để tách ký tự có dấu đầy đủ
const segmenter = new Intl.Segmenter('vi', { granularity: 'grapheme' });
const characters = [...segmenter.segment(text)].map(s => s.segment);

// Tạo span cho từng ký tự
characters.forEach(char => {
  if (char !== ' ') {
    title.innerHTML += `<span>${char}</span>`;
  } else {
    title.innerHTML += `<span style="width: 1rem"></span>`;
  }
});

// Set delay dần từ trái sang phải
const textElements = document.querySelectorAll('.title span');
textElements.forEach((element, index) => {
  element.style.setProperty('--delay', `${index * 0.1}s`);
});
