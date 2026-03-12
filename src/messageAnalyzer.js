function detectKeyword(messageText) {
  const text = String(messageText || "").toLowerCase();

  if (text.includes("fail") || text.includes("exam") || text.includes("lost")) {
    return "fail";
  }

  if (text.includes("win") || text.includes("success") || text.includes("passed")) {
    return "celebration";
  }

  if (text.includes("lol") || text.includes("haha") || text.includes("funny")) {
    return "funny";
  }

  if (text.includes("sad") || text.includes("cry") || text.includes("depressed")) {
    return "sad";
  }

  return "meme";
}

module.exports = {
  detectKeyword
};
