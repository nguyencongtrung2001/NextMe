export const getMascotQuote = (progress: number, isTodayCompleted: boolean, title: string) => {
  // 1. Nếu ngày hôm nay chưa check-in (Mascot đang đi bộ thúc giục)
  if (!isTodayCompleted) {
    if (progress === 0) {
      return "Chào bạn mới! ☀️ Vạn sự khởi đầu nan, gieo mầm thử thách ngay hôm nay nào!";
    }
    if (progress > 0 && progress < 50) {
      return `Tớ đang đợi bạn check-in thử thách "${title}" đó nha! Đừng lười biếng, vào gieo hạt đi nào! 📢`;
    }
    if (progress >= 50 && progress < 80) {
      return "Này!! Bạn đã đi được hơn nửa chặng đường rồi đấy! Đừng để công sức đổ sông đổ biển, check-in ngay!";
    }
    if (progress >= 80) {
      return "⚠️ Báo động đỏ! Sắp cán đích rồi, chỉ còn vài ngày nữa thôi! Đừng bỏ cuộc ở phút chót chứ!";
    }
  }

  // 2. Kịch bản khi user VỪA BẤM CHECK-IN THÀNH CÔNG (Mascot đổi animation nhảy múa ăn mừng)
  const happyQuotes = [
    "Tuyệt vời ông mặt trời! Tớ vừa thưởng cho bạn một bánh mì trí nhớ vì sự chăm chỉ này! 🍞✨",
    "Tuyệt quá! Nhìn hạt mầm lớn lên từng ngày tớ sướng rơn cả người đây này! 🥳",
    "Kỷ luật chính là chiếc chong chóng tre giúp bạn bay cao. Hôm nay bạn làm tốt lắm! 🛸"
  ];

  // Nếu đã làm và rơi vào các mốc đặc biệt
  if (progress >= 50 && progress < 55) {
    return "🎉 Wowww!! Chúng ta đã chính thức đi được NỬA CHẶNG ĐƯỜNG rồi! Bạn có thấy mình siêu nhân không? Đi tiếp thôi!";
  }
  if (progress >= 90 && progress < 100) {
    return "🔥 Xuất sắc! Thử thách sắp hoàn thành rồi! Sắp có hoa đẹp nở rộ trong vườn NextMe rồi bạn ơi! 🌸";
  }
  if (progress === 100) {
    return "Tuyệt đỉnh! Chúng ta đã cùng nhau vượt qua hành trình này! Tự hào quá đi mất! 🌻🎉";
  }

  // Mặc định random câu thoại vui vẻ khi hoàn thành ngày thường
  return happyQuotes[Math.floor(Math.random() * happyQuotes.length)];
};
