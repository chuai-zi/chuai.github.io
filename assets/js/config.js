/**
 * 全局配置文件
 * * TODO: 在部署上线前，请确保以下配置已更新为你的真实后端服务地址。
 * 警告: 永远不要在前端代码中直接暴露真实的 API Key (如 OpenAI/Replicate Key)。
 * 这里的 API_URL 应该是你自己的后端服务器地址，由你的后端去调用 AI 模型。
 */

export const CONFIG = {
    // 修改 1: 指向我们刚才写的 Vercel 后端 (相对路径)
    API_ENDPOINT: "/api/index", 
    
    // 修改 2: 关闭 Mock 模式，开启实战！
    USE_MOCK: false, 

    // 轮询间隔
    POLL_INTERVAL: 2000,
};