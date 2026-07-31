const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

exports.saveEmail = onRequest({ region: "europe-west1" }, async (req, res) => {
  res.set("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const input = req.body || {};
  const emailRaw = input.email;
  const elapsedTime = typeof input.elapsedTime === "string" ? input.elapsedTime.trim() : "";

  if (!emailRaw || !elapsedTime) {
    return res.status(400).json({ success: false, message: "Niepoprawne dane." });
  }

  const email = String(emailRaw).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Niepoprawny adres e-mail." });
  }

  try {
    await db.collection("zapisane_emaile").add({
      email,
      elapsed_time: elapsedTime,
      created_at: FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Firestore write failed:", err);
    return res.status(500).json({ success: false, message: "Błąd bazy danych: " + err.message });
  }
});
