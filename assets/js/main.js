import { generateTryOn } from './api.js';

// --- 状态管理 ---
const state = {
    currentStep: 1,
    modelData: null,
    clothData: null
};

// --- DOM 元素引用 ---
const elements = {
    nextBtn: document.getElementById('next-btn'),
    statusText: document.getElementById('step-status-text'),
    sections: [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ],
    uploadInputs: {
        model: document.getElementById('user-upload'),
        cloth: document.getElementById('cloth-upload')
    },
    uploadBtns: {
        model: document.getElementById('upload-btn-model'),
        cloth: document.getElementById('upload-btn-cloth')
    },
    previews: {
        loadingModel: document.getElementById('loading-model-preview'),
        loadingCloth: document.getElementById('loading-cloth-preview'),
        finalResult: document.getElementById('final-result-img')
    },
    views: {
        loading: document.getElementById('loading-view'),
        result: document.getElementById('result-view')
    }
};

// --- 初始化 ---
function init() {
    setupEventListeners();
    updateUI();
}

// --- 事件监听设置 ---
function setupEventListeners() {
    // 下一步按钮
    elements.nextBtn.addEventListener('click', handleNextStep);

    // 上传点击代理
    elements.uploadBtns.model.addEventListener('click', () => elements.uploadInputs.model.click());
    elements.uploadBtns.cloth.addEventListener('click', () => elements.uploadInputs.cloth.click());

    // 文件选择监听
    elements.uploadInputs.model.addEventListener('change', (e) => handleFileSelect(e, 'model'));
    elements.uploadInputs.cloth.addEventListener('change', (e) => handleFileSelect(e, 'cloth'));

    // 预设图片点击监听 (事件委托)
    document.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const type = card.dataset.type; // 'model' or 'cloth'
            const src = card.dataset.src;
            handlePresetSelect(type, src, card);
        });
    });

    // 结果页按钮
    document.getElementById('btn-restart').addEventListener('click', () => location.reload());
    document.getElementById('btn-download').addEventListener('click', () => alert("开始下载..."));
}

// --- 逻辑处理 ---

function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            updateSelection(type, e.target.result, 'upload');
        };
        reader.readAsDataURL(file);
    }
}

function handlePresetSelect(type, src, cardElement) {
    updateSelection(type, src, 'preset', cardElement);
}

function updateSelection(type, data, sourceType, element = null) {
    // 1. 更新状态
    if (type === 'model') state.modelData = data;
    if (type === 'cloth') state.clothData = data;

    // 2. 清除当前步骤的选中样式
    const stepIndex = type === 'model' ? 1 : 2;
    clearStyles(stepIndex);

    // 3. 应用新样式
    if (sourceType === 'preset' && element) {
        element.querySelector('.img-container-ratio').classList.add('selected-ring');
    } else if (sourceType === 'upload') {
        const btn = elements.uploadBtns[type];
        btn.style.borderColor = '#000';
        btn.style.backgroundColor = '#f8fafc';
        btn.querySelector('p.text-lg').innerText = "已选择";
    }

    // 4. 验证
    validateStep();
}

function clearStyles(stepIndex) {
    const section = elements.sections[stepIndex - 1];
    section.querySelectorAll('.selected-ring').forEach(el => el.classList.remove('selected-ring'));
    // 重置上传框样式 (略简化)
}

function validateStep() {
    let isValid = false;
    let msg = "请先完成选择...";

    if (state.currentStep === 1 && state.modelData) {
        isValid = true;
        msg = "准备好选下一步了";
    } else if (state.currentStep === 2 && state.clothData) {
        isValid = true;
        msg = "准备生成试穿";
    }

    elements.nextBtn.disabled = !isValid;
    elements.statusText.innerText = msg;
    elements.statusText.className = isValid ? "text-primary font-bold" : "text-secondary";
}

function handleNextStep() {
    if (state.currentStep < 3) {
        // 切换视图逻辑
        elements.sections[state.currentStep - 1].classList.add('hidden');
        state.currentStep++;
        elements.sections[state.currentStep - 1].classList.remove('hidden');
        
        // 更新顶部指示器 (UI逻辑)
        updateIndicators();

        if (state.currentStep === 3) {
            startGenerationProcess();
        } else {
            validateStep();
        }
    }
}

function updateIndicators() {
    // 简单的指示器更新逻辑
    for(let i=1; i<=3; i++) {
        const el = document.getElementById(`step-indicator-${i}`);
        const line = el.querySelector('.indicator-line');
        if (i <= state.currentStep) {
            el.classList.replace('text-gray-300', 'text-primary');
            line.classList.replace('bg-gray-200', 'bg-primary');
        }
    }
}

// --- 核心业务对接 ---
async function startGenerationProcess() {
    // 1. 隐藏底部栏
    document.querySelector('footer').style.display = 'none';
    
    // 2. 设置 Loading 预览图
    elements.previews.loadingModel.src = state.modelData;
    elements.previews.loadingCloth.src = state.clothData;

    try {
        // 3. 调用通用 API 模块 (这就是解耦的魔力)
        const resultUrl = await generateTryOn(state.modelData, state.clothData);

        // 4. 显示结果
        elements.views.loading.classList.add('hidden');
        elements.views.result.classList.remove('hidden');
        elements.previews.finalResult.src = resultUrl;

    } catch (error) {
        alert("生成失败，请检查控制台");
        elements.views.loading.classList.add('hidden');
        // 这里可以添加错误重试按钮的显示逻辑
    }
}

// 启动应用
init();