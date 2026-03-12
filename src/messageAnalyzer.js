const keywordMap = {
  fail: ["fail", "failed", "exam", "test", "lost", "bad grade", "rip"],
  celebration: ["win", "won", "success", "passed", "promotion", "lets go"],
  funny: ["lol", "haha", "funny", "lmao", "rofl", "joke"],
  sad: ["sad", "cry", "crying", "depressed", "heartbroken"],
  angry: ["angry", "mad", "rage", "annoyed", "wtf"],
  tired: ["tired", "sleepy", "exhausted", "burnt out"],
  confused: ["confused", "what", "huh", "idk", "dont understand"],
  cringe: ["cringe", "awkward", "bruh"]
};

function detectKeyword(messageText) {
  const text = String(messageText || "").toLowerCase();

  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return "meme";
}

module.exports = {
  detectKeyword
};
