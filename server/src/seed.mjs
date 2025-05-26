import { readFile } from "fs/promises";

const data = JSON.parse(
  await readFile(new URL("./mock_expenses.json", import.meta.url))
);

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzNjZDM2ZDNmNjk5Njc0YmQxZGNjYyIsImlhdCI6MTc0ODI4ODc5MCwiZXhwIjoxNzQ4Mzc1MTkwfQ.skTqEmAOFsK2X6CCdY9P7EVZ342lqIgV-CnktXnsfxk";
const API_URL = "http://localhost:5051/api/transactions";

for (const item of data) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(item),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Failed:", result.message);
    } else {
      console.log(`Added: ${item.category} | $${item.amount} | ${item.date}`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}
