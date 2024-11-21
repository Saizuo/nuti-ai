const client = {
    baseURL: "https://api.zukijourney.com/v1",
    apiKey: 'zu-2009f6811a0335d3b7ef955f4697f8a7'
};

let isGenerating = false;
const cooldownTime = 10000; // 10 seconds
let lastGenerateTime = 0;

document.getElementById('generateBtn').addEventListener('click', async function() {
    if (isGenerating) return;
    
    const now = Date.now();
    if (now - lastGenerateTime < cooldownTime) {
        const remainingTime = (cooldownTime - (now - lastGenerateTime)) / 1000;
        alert(`Please wait ${remainingTime.toFixed(1)} seconds before generating another image!`);
        return;
    }

    const promptInput = document.querySelector('textarea');
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    isGenerating = true;
    const imageResult = document.getElementById('imageResult');

    const progressMessages = [
        "🎨 Preparing your masterpiece...",
        "🖌️ Adding artistic touches...",
        "✨ Sprinkling some magic...",
        "🌈 Bringing your vision to life...",
        "🎭 Almost there..."
    ];

    let messageIndex = 0;
    imageResult.innerHTML = `<div class="text-white font-ice text-2xl text-center">${progressMessages[0]}</div>`;
    
    const progressInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % progressMessages.length;
        imageResult.innerHTML = `<div class="text-white font-ice text-2xl text-center">${progressMessages[messageIndex]}</div>`;
    }, 2000);

    try {
        const response = await fetch(`${client.baseURL}/images/generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${client.apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        clearInterval(progressInterval);

        if (data.data && data.data[0].url) {
            imageResult.innerHTML = `<img src="${data.data[0].url}" alt="Generated Image" class="w-full h-full object-contain rounded-lg">`;
            lastGenerateTime = Date.now();
        } else {
            throw new Error('Invalid response data');
        }
    } catch (error) {
        clearInterval(progressInterval);
        imageResult.innerHTML = `<div class="text-white font-ice text-2xl text-center">Generation failed. Please try again.</div>`;
        console.error('Error:', error);
    } finally {
        isGenerating = false;
    }
});
