/**
 * 全局配置文件
 * * TODO: 在部署上线前，请确保以下配置已更新为你的真实后端服务地址。
 * 警告: 永远不要在前端代码中直接暴露真实的 API Key (如 OpenAI/Replicate Key)。
 * 这里的 API_URL 应该是你自己的后端服务器地址，由你的后端去调用 AI 模型。
 */

export const CONFIG = {
    // 你的后端 API 地址 (示例: Python FastAPI / Node.js Express)
    API_ENDPOINT: "https://api.your-domain.com/v1/try-on",
    
    // 是否开启 Mock 模式 (True: 不调用 API，直接返回假数据，用于演示; False: 真实调用)
    USE_MOCK: true, 

    // 轮询间隔 (毫秒)
    POLL_INTERVAL: 2000,
};