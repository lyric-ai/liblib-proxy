// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  const { prompt } = req.body;

  const accessKey = "NRXABtFaq2nlj-fRV4685Q";
  const secretKey = "VnS-NP3SKlOgws0zGW8OfkpOm-vohzvf";

  // 模拟签名（真实使用中应加密签名）
  const requestBody = {
    templateUuid: "4df2efa0f18d46dc9758803e478eb51c",
    generateParams: {
      "65": {
        class_type: "CLIPTextEncode",
        inputs: {
          text: prompt
        }
      },
      workflowUuid: "dee7984fcace4d40aa8bc99ff6a4dc36"
    }
  };

  const signature = "随便填一个测试签名";
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 10);

  try {
    const apiRes = await fetch(`https://openapi.liblibai.cloud/api/generate/comfyui/app?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${nonce}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const result = await apiRes.json();

    // 此处应进一步调用 status 接口轮询，拿最终图片链接
    // 为简化演示，我们假设立即返回图像链接：
    const imageUrl = result?.data?.images?.[0]?.imageUrl || null;

    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error("代理错误：", error);
    res.status(500).json({ error: "服务器内部错误" });
  }
}
