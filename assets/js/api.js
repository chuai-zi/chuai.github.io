import { CONFIG } from './config.js';

/**
 * 标准化的 API 调用模块
 * 负责处理所有的 Fetch 请求、错误处理和数据格式化
 */

/**
 * 核心功能：上传图片并生成试穿结果
 * @param {string} modelImageBase64 - 模特图片的 Base64 字符串
 * @param {string} clothImageBase64 - 衣服图片的 Base64 字符串
 * @returns {Promise<string>} - 返回生成后的图片 URL
 */
export async function generateTryOn(modelImageBase64, clothImageBase64) {
    if (CONFIG.USE_MOCK) {
        console.log("🔧 [Mock Mode] 模拟 API 调用中...");
        return mockApiCall();
    }

    try {
        // 1. 准备数据 (通常后端接收 JSON 或 FormData)
        const payload = {
            model_image: modelImageBase64,
            cloth_image: clothImageBase64,
            // 可扩展参数:
            // category: "upper_body",
            // guidance_scale: 7.5
        };

        // 2. 发起请求
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + CONFIG.API_KEY // 如果需要鉴权
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // 3. 处理返回 (假设后端直接返回 { result_url: "..." })
        // 如果是异步任务，这里可能需要实现轮询逻辑 (Polling)
        return data.result_url;

    } catch (error) {
        console.error("❌ API 请求失败:", error);
        throw error; // 将错误抛出给 UI 层处理
    }
}

/**
 * 模拟 API 行为 (用于演示)
 */
function mockApiCall() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 返回一张高质量的占位图
            resolve("https://images.unsplash.com/photo-1550639525-c97d455acf74?q=80&w=1200&auto=format&fit=crop");
        }, 3500); // 模拟 3.5秒 网络延迟
    });
}