import { db } from "./firebase.js";

const API =
  "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

async function fetchResults() {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();

  if (!json.data || !json.data.list) {
    throw new Error("Invalid API response");
  }

  return json.data.list;
}

async function saveResult(item) {
  const issue = item.issueNumber;

  const ref = db.ref(`results/${issue}`);

  const snap = await ref.get();

  if (snap.exists()) {
    console.log("Already Exists:", issue);
    return;
  }

  const number = Number(item.number);

  const data = {
    issueNumber: issue,
    number,
    color: item.color,
    premium: Number(item.premium),
    bigSmall: number >= 5 ? "BIG" : "SMALL",
    createdAt: Date.now()
  };

  await ref.set(data);

  console.log("Saved:", issue);
}

async function start() {
  const results = await fetchResults();

  for (const item of results) {
    await saveResult(item);
  }

  console.log("Completed");
}

start().catch(console.error);
