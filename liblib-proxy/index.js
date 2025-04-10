// index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const AccessKey = "NRXABtFaq2nlj-fRV4685Q";
const SecretKey = "VnS-NP3SKlOgws0zGW8OfkpOm-vohzvf";

function generateSignature(path, timestamp, nonce) {
  const plainText = `${path}&${timestamp}&${nonce}`;
  const hmac = crypto.createHmac("sha1", SecretKey);
  hmac.update(plainText);
  return hmac.digest("base64url");
}

app.post("/api/generate", async (req, res) => {
  const path = "/api/generate/comfyui/app";
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(2);

  const signature = generateSignature(path, timestamp, nonce);
  const url = `https://openapi.liblibai.cloud${path}?AccessKey=${AccessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${nonce}`;

  try {
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const json = await result.json();
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: "请求失败", detail: error.message });
  }
});

export default app;
