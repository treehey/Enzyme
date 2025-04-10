// 获取DOM元素
const startButton = document.getElementById('start-experiment');
const lab = document.getElementById('lab');
const hero = document.querySelector('.hero');
const breadVisualization = document.getElementById('bread-visualization');
const bakeButton = document.getElementById('bake-button');
const experimentResults = document.getElementById('experiment-results');
const tryAgainButton = document.getElementById('try-again');
const shareButton = document.getElementById('share-result');
const microscopeButton = document.getElementById('microscope-button');
const microscopeView = document.getElementById('microscope-view');
const closeMicroscope = document.getElementById('close-microscope');
const microscopeCanvas = document.getElementById('microscope-canvas');
const loadingAnimation = document.getElementById('lottie-loading');

// 滑块元素
const amylaseSlider = document.getElementById('amylase-slider');
const lipaseSlider = document.getElementById('lipase-slider');
const glucoseOxidaseSlider = document.getElementById('glucose-oxidase-slider');

// 滑块值显示
const amylaseValue = document.getElementById('amylase-value');
const lipaseValue = document.getElementById('lipase-value');
const glucoseOxidaseValue = document.getElementById('glucose-oxidase-value');

// 效果值显示
const volumeValue = document.getElementById('volume-value');
const textureValue = document.getElementById('texture-value');
const freshnessValue = document.getElementById('freshness-value');

// 结果文本
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');
const scienceExplanation = document.getElementById('science-explanation');
const expertTip = document.getElementById('expert-tip');
const microscopeDescription = document.getElementById('microscope-description');

// 初始化面包状态
let breadState = {
    amylase: 50,
    lipase: 50,
    glucoseOxidase: 50,
    temperature: 180,
    fermentation: 60,
    volume: "--",
    texture: "--",
    freshness: "--",
    status: "normal"
};

// 开始实验
startButton.addEventListener("click", () => {
    hero.style.display = 'none';
    lab.style.display = 'block';
    updateBreadVisualization();
});

// 滑块事件监听
amylaseSlider.addEventListener("input", () => {
    breadState.amylase = amylaseSlider.value;
    amylaseValue.textContent = `${amylaseSlider.value}%`;
    updateBreadVisualization();
});

lipaseSlider.addEventListener("input", () => {
    breadState.lipase = lipaseSlider.value;
    lipaseValue.textContent = `${lipaseSlider.value}%`;
    updateBreadVisualization();
});

glucoseOxidaseSlider.addEventListener("input", () => {
    breadState.glucoseOxidase = glucoseOxidaseSlider.value;
    glucoseOxidaseValue.textContent = `${glucoseOxidaseSlider.value}%`;
    updateBreadVisualization();
});

// 温度滑块事件监听
document.getElementById('temperature-slider').addEventListener("input", () => {
    document.getElementById('temperature-value').textContent = `${document.getElementById('temperature-slider').value}°C`;
    updateBreadVisualization();
});

// 发酵时间滑块事件监听
document.getElementById('fermentation-slider').addEventListener("input", () => {
    document.getElementById('fermentation-value').textContent = `${document.getElementById('fermentation-slider').value}分钟`;
    updateBreadVisualization();
});

//烘焙动画
function startBakingAnimation() {
    loadingAnimation.style.display = 'block';
    
    // 创建Lottie动画
    const anim = lottie.loadAnimation({
        container: loadingAnimation,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets5.lottiefiles.com/packages/lf20_bcwmx45q.json' // 面包烘焙动画的JSON文件路径
    });
    
    // 计时器展示进度
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        if (progress >= 100) {
            clearInterval(progressInterval);
            loadingAnimation.innerHTML = '<div style="text-align:center;padding-top:80px;"><h3>烘焙完成!</h3></div>';
            setTimeout(() => {
                loadingAnimation.style.display = 'none';
                loadingAnimation.innerHTML = '';
                bakeButton.disabled = false;
                bakeButton.textContent = '开始烘焙';
                experimentResults.classList.add('show-experiment-results');
                updateResultsContent();
            }, 1000);
        } else {
            loadingAnimation.innerHTML = `<div style="position:absolute;bottom:20px;width:100%;text-align:center;color:#ff3b30;font-weight:bold;">${progress}%</div>`;
        }
    }, 10);
}

// 烘焙按钮事件
bakeButton.addEventListener("click", () => {
    // 显示烘焙动画
    startBakingAnimation();
    bakeButton.disabled = true;
    bakeButton.textContent = '烘焙中...';

    // 计算结果
    calculateBreadResults();

        // 显示结果弹窗
        // experimentResults.classList.add('show-experiment-results');
        // updateResultsContent();
});

// 再试一次按钮事件
tryAgainButton.addEventListener("click", () => {
    experimentResults.classList.remove('show-experiment-results');
});

// 添加分享结果的实际功能代码
function shareResults() {
    // 创建分享内容
    const shareTitle = "我的面包实验结果";
    const shareText = `我在面包酶实验室创造了一个${breadState.status === "perfect" ? "完美" : breadState.status === "good" ? "优质" : "普通"}的面包！\n体积: ${breadState.volume}\n质地: ${breadState.texture}\n保鲜度: ${breadState.freshness}`;
    
    // 创建分享面板
    const sharePanel = document.createElement('div');
    sharePanel.style.position = 'fixed';
    sharePanel.style.top = '50%';
    sharePanel.style.left = '50%';
    sharePanel.style.transform = 'translate(-50%, -50%)';
    sharePanel.style.backgroundColor = 'white';
    sharePanel.style.padding = '30px';
    sharePanel.style.borderRadius = '18px';
    sharePanel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    sharePanel.style.zIndex = '1000';
    sharePanel.style.width = '90%';
    sharePanel.style.maxWidth = '500px';
    
    // 面板内容
    sharePanel.innerHTML = `
        <h3 style="font-size:22px;margin-bottom:20px;text-align:center;">分享你的面包实验</h3>
        <div style="margin-bottom:20px;background:#f5f5f7;padding:20px;border-radius:12px;">
            <p style="font-weight:bold;">${shareTitle}</p>
            <p style="white-space:pre-line;margin-top:10px;">${shareText}</p>
        </div>
        <div style="display:flex;justify-content:space-around;margin-top:30px;">
            <button id="copy-share" style="background:linear-gradient(90deg,#ff9500,#ff2d55);color:white;border:none;padding:12px 20px;border-radius:30px;font-weight:600;">复制内容</button>
            <button id="wechat-share" style="background:#07c160;color:white;border:none;padding:12px 20px;border-radius:30px;font-weight:600;">微信分享</button>
            <button id="close-share" style="background:#e0e0e0;color:#1d1d1f;border:none;padding:12px 20px;border-radius:30px;font-weight:600;">关闭</button>
        </div>
    `;
    
    document.body.appendChild(sharePanel);
    
    // 添加事件监听
    document.getElementById('copy-share').addEventListener('click', () => {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('分享内容已复制到剪贴板！');
        });
    });
    
    document.getElementById('wechat-share').addEventListener('click', () => {
        // 生成二维码或引导微信分享
        alert('微信分享功能即将上线，敬请期待！');
    });
    
    document.getElementById('close-share').addEventListener('click', () => {
        document.body.removeChild(sharePanel);
    });
}

// 分享结果按钮事件
shareButton.addEventListener("click", shareResults);

// 显示分子视角
microscopeButton.addEventListener("click", () => {
    microscopeView.style.display = 'flex';
    createMolecularAnimation();
});

// 关闭分子视角
closeMicroscope.addEventListener("click", () => {
    microscopeView.style.display = 'none';
});

// 更新面包可视化
function updateBreadVisualization() {
    // 获取所有参数
    const amylase = parseInt(breadState.amylase);
    const lipase = parseInt(breadState.lipase);
    const glucoseOxidase = parseInt(breadState.glucoseOxidase);
    const temperature = parseInt(document.getElementById('temperature-slider').value);
    const fermentation = parseInt(document.getElementById('fermentation-slider').value);

    // 创建面包基础色调 - 受温度影响
    let baseColor;
    if (temperature > 200) {
        baseColor = '#a06a2c'; // 高温深褐色
    } else if (temperature < 160) {
        baseColor = '#f9e8c7'; // 低温浅色
    } else if (amylase > 80) {
        baseColor = '#b4833d';
    } else if (amylase < 20) {
        baseColor = '#f2e3be';
    } else {
        baseColor = '#e6c58e';
    }

    // 设置面包可视化的背景色
    breadVisualization.style.backgroundColor = baseColor;

    // 创建面包内部结构纹理 - 受发酵时间影响
    let bubbleSize = Math.min(Math.max(amylase, 30), 70) / 100;
    bubbleSize *= (fermentation / 60) * 0.7 + 0.6; // 发酵时间影响气泡大小
    
    let bubbleDensity = Math.min(Math.max(lipase, 30), 70) / 100;
    bubbleDensity *= (fermentation / 60) * 0.6 + 0.7; // 发酵时间影响气泡密度
    
    let bubbleStrength = Math.min(Math.max(glucoseOxidase, 30), 70) / 100;

    // 清除之前的气泡
    breadVisualization.innerHTML = '';

    // 根据参数创建面包内部气泡结构
    const bubbleCount = Math.floor(200 * bubbleDensity);

    // 创建气泡
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bread-bubble';

        // 根据参数设置气泡样式
        const size = Math.floor(3 + (20 * bubbleSize * Math.random())) + 'px';
        const posX = Math.floor(Math.random() * 100) + '%';
        const posY = Math.floor(Math.random() * 100) + '%';
        const opacity = 0.1 + (bubbleStrength * 0.4);

        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = posX;
        bubble.style.top = posY;
        bubble.style.backgroundColor = '#ffffff';
        bubble.style.opacity = opacity;
        bubble.style.position = 'absolute';
        bubble.style.borderRadius = '50%';

        breadVisualization.appendChild(bubble);
    }

    // 更新气泡样式
    const breadBubbles = document.querySelectorAll('.bread-bubble');
    breadBubbles.forEach(bubble => {
        const distortion = Math.random() * 0.4 + 0.8;
        bubble.style.transform = `scale(${distortion}, 1)`;
    });

    // 根据温度和葡萄糖氧化酶参数设置面包体积
    const tempFactor = (temperature >= 170 && temperature <= 190) ? 1.05 : 0.95;
    const volumeScale = (0.7 + (glucoseOxidase / 200)) * tempFactor;
    breadVisualization.style.transform = `scale(${volumeScale})`;
    
    // 根据温度添加烤色效果
    if (temperature > 200) {
        breadVisualization.style.boxShadow = "inset 0 0 40px rgba(100, 50, 0, 0.7)";
    } else if (temperature > 185) {
        breadVisualization.style.boxShadow = "inset 0 0 30px rgba(100, 50, 0, 0.4)";
    } else {
        breadVisualization.style.boxShadow = "none";
    }
}

// 计算面包烘焙结果
function calculateBreadResults() {
    const enzymes = {
        amylase: parseInt(breadState.amylase),
        lipase: parseInt(breadState.lipase),
        glucoseOxidase: parseInt(breadState.glucoseOxidase),
        temperature: parseInt(document.getElementById('temperature-slider').value), 
        fermentation: parseInt(document.getElementById('fermentation-slider').value)
    };

    // 动态评分曲线函数（S型曲线优化）
    function dynamicScore(value, optimal, range) {
        const deviation = Math.abs(value - optimal);
        // 使用Sigmoid函数实现平滑过渡，更容易达到高分
        const curve = 1 / (1 + Math.exp((deviation - range/2) / (range/6)));
        return Math.min(100, Math.round(curve * 100));
    }

    // 温度和发酵时间的额外加分
    const tempBonus = dynamicScore(enzymes.temperature, 180, 30) * 0.1;
    const fermentBonus = dynamicScore(enzymes.fermentation, 60, 25) * 0.1;

    // 体积分数：复合权重系统
    const volumeScore = 
        dynamicScore(enzymes.amylase, 65, 25) * 0.5 +  // 最佳值65，范围25
        dynamicScore(enzymes.lipase, 55, 30) * 0.3 +
        dynamicScore(enzymes.glucoseOxidase, 70, 20) * 0.2 +
        tempBonus + fermentBonus;

    // 质地分数：交互作用增强
    const textureScore = 
        (dynamicScore(enzymes.lipase, 60, 25) * 
         dynamicScore(enzymes.amylase, 55, 20)) / 100 * 0.6 +
        dynamicScore(enzymes.glucoseOxidase, 55, 25) * 0.4 +
        tempBonus + fermentBonus;

    // 保鲜度：指数衰减优化
    const freshnessScore = 
        Math.sqrt(
            dynamicScore(enzymes.lipase, 58, 22) * 
            dynamicScore(enzymes.amylase, 50, 18)
        ) * 0.7 +
        dynamicScore(enzymes.glucoseOxidase, 52, 28) * 0.3 +
        tempBonus + fermentBonus;

    // 设置分数（带动态范围压缩）- 更容易达到高分
    breadState.volume = Math.min(100, Math.round(volumeScore * 1.15));
    breadState.texture = Math.min(100, Math.round(textureScore * 1.1));
    breadState.freshness = Math.min(100, Math.round(freshnessScore * 1.1));

    // 显示分数
    volumeValue.textContent = breadState.volume;
    textureValue.textContent = breadState.texture;
    freshnessValue.textContent = breadState.freshness;

    // 确定面包状态 - 调低perfect的门槛
    const avgScore = (breadState.volume + breadState.texture + breadState.freshness) / 3;

    if (avgScore >= 85) {
        breadState.status = "perfect";
    } else if (avgScore >= 70) {
        breadState.status = "good";
    } else if (avgScore >= 50) { // 从50降到45
        breadState.status = "normal";
    } else {
        breadState.status = "bad";
    }

    // 检查极端情况
    if (enzymes.amylase > 85) {
        breadState.status = "overamylase";
    } else if (enzymes.amylase < 20) {
        breadState.status = "underamylase";
    }

    if (enzymes.lipase > 85) {
        breadState.status = "overlipase";
    } else if (enzymes.lipase < 20) {
        breadState.status = "underlipase";
    }

    if (enzymes.glucoseOxidase > 85) {
        breadState.status = "overglucose";
    } else if (enzymes.glucoseOxidase < 20) {
        breadState.status = "underglucose";
    }
}

// 计算各项得分的辅助函数
function calculateScore(value, optimal, range) {
    const deviation = Math.abs(value - optimal);
    const score = Math.max(0, 100 - (deviation / range) * 100);
    return score;
}

// 更新结果内容
function updateResultsContent() {
    // 根据面包状态设置结果文本
    switch (breadState.status) {
        case "perfect":
            resultTitle.textContent = "完美的面包！";
            resultDescription.textContent = "恭喜！你的酶配方创造了一个近乎完美的面包。它体积饱满、质地柔软且保鲜期长。";
            scienceExplanation.textContent = "你平衡了三种酶的用量：淀粉酶产生了足够的糖分供酵母发酵；脂肪酶改良了面包的组织结构；葡萄糖氧化酶强化了面团的筋力。这些酶协同工作，相互补充，创造出优质面包。";
            expertTip.textContent = "这个配方非常棒！可以考虑作为你的基础配方，并尝试微调以获得不同风味和质地的面包。";
            break;

        case "good":
            resultTitle.textContent = "不错的面包";
            resultDescription.textContent = "你的面包品质很好，味道和质地都令人满意。";
            scienceExplanation.textContent = "你的酶配方相当平衡，但还有小小的优化空间。酶的协同作用使面包的各项指标都达到了较高水平。";
            expertTip.textContent = "尝试略微调整一下淀粉酶的用量，可能会让面包的体积和保鲜度更上一层楼。";
            break;

        case "normal":
            resultTitle.textContent = "普通面包";
            resultDescription.textContent = "你的面包质量一般，没有明显缺陷，但也没有特别出彩的地方。";
            scienceExplanation.textContent = "酶的用量基本合理，但比例不够理想。各种酶之间的平衡对最终面包品质有很大影响。";
            expertTip.textContent = "建议调整三种酶的比例，特别是增加淀粉酶的比例到60%左右，可能会有明显改善。";
            break;

        case "bad":
            resultTitle.textContent = "有待改进的面包";
            resultDescription.textContent = "你的面包存在一些问题，体积、质地和保鲜度都不太理想。";
            scienceExplanation.textContent = "酶的用量失衡导致面包品质下降。酶之间的作用是相互影响的，一种酶的过量或不足会影响其他酶的效果。";
            expertTip.textContent = "建议重新调整配方，将淀粉酶设置在45-65%之间，脂肪酶在40-60%之间，葡萄糖氧化酶在50-70%之间。";
            break;

        case "overamylase":
            resultTitle.textContent = "淀粉酶过量！";
            resultDescription.textContent = "面包内部发黏，表皮颜色过深，甚至有些地方出现烧焦。";
            scienceExplanation.textContent = "淀粉酶过量导致淀粉被过度分解，产生过多糖分。这不仅会使面包内部发黏，还会使表面上色过深，甚至烧焦。";
            expertTip.textContent = "减少淀粉酶的用量至40-60%之间，这样可以保证有足够的糖分供酵母发酵，但又不至于过度分解淀粉。";
            break;

        case "underamylase":
            resultTitle.textContent = "淀粉酶不足！";
            resultDescription.textContent = "面包体积偏小，口感较干，并且保鲜期短。";
            scienceExplanation.textContent = "淀粉酶不足导致酵母缺乏足够的糖分进行发酵，面团膨胀不充分，同时面包老化速度加快。";
            expertTip.textContent = "增加淀粉酶的用量至45-60%，可以提供更多糖分供酵母发酵，改善面包体积和延缓老化。";
            break;

        case "overlipase":
            resultTitle.textContent = "脂肪酶过量！";
            resultDescription.textContent = "面团变得干硬，面包体积减小，并且有轻微的异味。";
            scienceExplanation.textContent = "脂肪酶过量会过度分解面团中的脂质，导致面团水分流失，同时产生的游离脂肪酸可能导致异味。";
            expertTip.textContent = "降低脂肪酶用量至40-55%之间，这样可以保证面包组织改良但又不会过度分解脂肪。";
            break;

        case "underlipase":
            resultTitle.textContent = "脂肪酶不足！";
            resultDescription.textContent = "面包质地不够柔软，老化速度快。";
            scienceExplanation.textContent = "脂肪酶不足导致面包内部组织结构改良不充分，无法形成足够稳定的乳化体系，使面包质地较硬且易老化。";
            expertTip.textContent = "增加脂肪酶用量至50-60%，可以改善面包的组织结构和延缓老化。";
            break;

        case "overglucose":
            resultTitle.textContent = "葡萄糖氧化酶过量！";
            resultDescription.textContent = "面团过于坚硬，面包质地粗糙且缺乏弹性。";
            scienceExplanation.textContent = "葡萄糖氧化酶过量导致面筋过度交联，面团变得过于坚韧，不利于气体保持和膨胀，最终导致面包质地变硬。";
            expertTip.textContent = "降低葡萄糖氧化酶用量至40-60%，可以避免面团过度增强而失去弹性。";
            break;

        case "underglucose":
            resultTitle.textContent = "葡萄糖氧化酶不足！";
            resultDescription.textContent = "面包结构松散，体积塌陷，缺乏良好的弹性。";
            scienceExplanation.textContent = "葡萄糖氧化酶不足导致面筋网络形成不充分，无法有效保持气体，面包在烘烤过程中容易塌陷。";
            expertTip.textContent = "增加葡萄糖氧化酶用量至50-70%，可以增强面团的筋力和气体保持能力。";
            break;
    }
}

// 创建分子动画
function createMolecularAnimation() {
    // 清除现有粒子
    microscopeCanvas.innerHTML = '';

    // 获取当前酶的用量
    const amylase = parseInt(breadState.amylase);
    const lipase = parseInt(breadState.lipase);
    const glucoseOxidase = parseInt(breadState.glucoseOxidase);

    // 创建底物分子（大分子）
    for (let i = 0; i < 10; i++) {
        const substrate = document.createElement('div');
        substrate.className = 'microscope-particle substrate';

        const size = Math.floor(30 + Math.random() * 20);
        const posX = Math.floor(Math.random() * 80) + 10;
        const posY = Math.floor(Math.random() * 80) + 10;

        substrate.style.width = size + 'px';
        substrate.style.height = size + 'px';
        substrate.style.left = posX + '%';
        substrate.style.top = posY + '%';
        substrate.style.backgroundColor = 'rgba(150, 150, 150, 0.5)';

        microscopeCanvas.appendChild(substrate);
    }

    // 创建酶分子（彩色小球）
    createEnzymes('amylase', amylase, '#ff9500');
    createEnzymes('lipase', lipase, '#ff3b30');
    createEnzymes('glucose-oxidase', glucoseOxidase, '#5856d6');

    // 更新分子视角描述
    let description = "在微观世界中，你可以观察到酶与底物的相互作用：";

    if (amylase > 70) {
        description += " 大量淀粉酶（橙色）活跃地分解淀粉长链，释放出糖分；";
    } else if (amylase < 30) {
        description += " 淀粉酶（橙色）数量不足，很多淀粉分子未被分解；";
    } else {
        description += " 淀粉酶（橙色）正在稳定地分解淀粉长链；";
    }

    if (lipase > 70) {
        description += " 脂肪酶（红色）大量存在，快速分解脂肪并释放脂肪酸；";
    } else if (lipase < 30) {
        description += " 脂肪酶（红色）数量稀少，脂肪分解缓慢；";
    } else {
        description += " 脂肪酶（红色）正在均匀地改变脂质结构；";
    }

    if (glucoseOxidase > 70) {
        description += " 葡萄糖氧化酶（紫色）大量催化蛋白质交联，使面团过度强化。";
    } else if (glucoseOxidase < 30) {
        description += " 葡萄糖氧化酶（紫色）不足，蛋白质网络形成缓慢。";
    } else {
        description += " 葡萄糖氧化酶（紫色）正在适度地促进蛋白质交联，增强面团弹性。";
    }

    microscopeDescription.textContent = description;

    // 添加动画效果
    animateMolecules();
}

// 创建特定类型的酶分子
function createEnzymes(type, amount, color) {
    const count = Math.floor(amount / 10);

    for (let i = 0; i < count; i++) {
        const enzyme = document.createElement('div');
        enzyme.className = `microscope-particle ${type}`;

        const size = Math.floor(8 + Math.random() * 4);
        const posX = Math.floor(Math.random() * 90) + 5;
        const posY = Math.floor(Math.random() * 90) + 5;

        enzyme.style.width = size + 'px';
        enzyme.style.height = size + 'px';
        enzyme.style.left = posX + '%';
        enzyme.style.top = posY + '%';
        enzyme.style.backgroundColor = color;
        enzyme.style.boxShadow = `0 0 5px ${color}`;

        microscopeCanvas.appendChild(enzyme);
    }
}

// 为分子添加随机运动动画
function animateMolecules() {
    const particles = document.querySelectorAll('.microscope-particle');

    particles.forEach(particle => {
        // 获取当前位置
        const currentLeft = parseFloat(particle.style.left);
        const currentTop = parseFloat(particle.style.top);

        // 创建随机运动
        function move() {
            // 随机位移
            const deltaX = (Math.random() - 0.5) * 5;
            const deltaY = (Math.random() - 0.5) * 5;

            // 新位置（确保不超出边界）
            let newLeft = Math.max(0, Math.min(95, currentLeft + deltaX));
            let newTop = Math.max(0, Math.min(95, currentTop + deltaY));

            // 应用新位置
            particle.style.left = newLeft + '%';
            particle.style.top = newTop + '%';

            // 如果是酶分子（小球），让它们向底物（大球）靠近
            if (!particle.className.includes('substrate')) {
                const substrates = document.querySelectorAll('.substrate');
                const randomSubstrate = substrates[Math.floor(Math.random() * substrates.length)];

                const substrateLeft = parseFloat(randomSubstrate.style.left);
                const substrateTop = parseFloat(randomSubstrate.style.top);

                // 有一定几率向底物移动
                if (Math.random() > 0.7) {
                    const moveTowardsX = (substrateLeft > newLeft) ? 1 : -1;
                    const moveTowardsY = (substrateTop > newTop) ? 1 : -1;

                    particle.style.left = (newLeft + moveTowardsX) + '%';
                    particle.style.top = (newTop + moveTowardsY) + '%';
                }
            }

            // 继续移动动画
            requestAnimationFrame(move);
        }

        // 启动移动
        move();
    });
}

// 添加CSS样式，确保面包气泡有正确的样式
const style = document.createElement('style');
style.textContent = `
        .bread-bubble {
            position: absolute;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .microscope-particle {
            transition: all 0.5s ease;
        }
    `;
document.head.appendChild(style);

// 初始化
updateBreadVisualization();