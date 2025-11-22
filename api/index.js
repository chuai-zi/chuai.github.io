// api/index.js
// 这是运行在 Vercel 服务器上的后端代码 (Node.js)

export default async function handler(req, res) {
    // 1. 设置 CORS (允许你的网页跨域访问这个后端)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允许任何域名访问 (为了安全，生产环境可以改成你的域名)
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 处理预检请求 (浏览器的礼貌询问)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. 从 Vercel 的保险箱里取出 Replicate 的钥匙
        const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

        if (!REPLICATE_API_TOKEN) {
            throw new Error("后端没有配置 API Token");
        }

        // 3. 获取前端发来的图片数据
        const { model_image, cloth_image } = req.body;

        // 4. 呼叫 Replicate AI 超市 (使用 IDM-VTON 模型)
        // 这里的 version 是模型的具体版本号，可能会更新，目前使用的是一个稳定版本
        const response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Token ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // IDM-VTON 的模型版本 ID
                version: "c871e91c0372f922b959e00877f930b9f498cb962d663922aa3b35c1738ce913", 
                input: {
                    human_img: model_image,     // 模特图
                    garm_img: cloth_image,      // 衣服图
                    garment_des: "upper_body",  // 默认试穿上半身
                    crop: false,
                    seed: 42
                }
            }),
        });

        if (response.status !== 201) {
            let error = await response.text();
            throw new Error(`Replicate API error: ${error}`);
        }

        const prediction = await response.json();
        
        // 5. AI 生成需要时间，我们需要把任务 ID 返回给前端，让前端去轮询结果
        // 但为了简化 MVP，我们这里做一个简单的等待逻辑 (实际生产环境建议前端轮询)
        // 这里为了 MVP 简单，我们直接返回 prediction 对象，前端需要改代码来轮询
        
        res.status(200).json(prediction);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}