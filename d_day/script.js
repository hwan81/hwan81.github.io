document.addEventListener('DOMContentLoaded', () => {
    const initialScreen = document.getElementById('initial-screen');
    const counterScreen = document.getElementById('counter-screen');
    const startButton = document.getElementById('start-button');
    const closeCounterButton = document.getElementById('close-counter-button'); // 닫기 버튼

    const guideMessageInput = document.getElementById('guide-message-input');
    const guideMessageDisplay = document.getElementById('guide-message-display');
    const targetDatetimeInput = document.getElementById('target-datetime');
    const ddayMessageInput = document.getElementById('dday-message-input');
    const animationRadios = document.querySelectorAll('input[name="animation"]');
    const objectImageUrlInput = document.getElementById('object-image-url');

    const countdownGuideMessageEl = document.getElementById('countdown-guide-message'); // 카운터 상단 안내 문구
    const countdownDisplay = document.getElementById('countdown-display');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const millisecondsEl = document.getElementById('milliseconds');

    const animationArea = document.getElementById('animation-area');
    const movingObject = document.getElementById('moving-object');
    const fillingCircleContainer = document.getElementById('filling-circle-container');
    const fillingCircle = document.getElementById('filling-circle');

    const finalMessageEl = document.getElementById('final-message');

    let targetDate;
    let selectedAnimation;
    let dDayMessageText;
    let guideMessageTextForCounter; // 카운터 화면용 안내 문구
    let countdownInterval;
    let initialDifference;

    guideMessageInput.addEventListener('input', () => {
        guideMessageDisplay.textContent = guideMessageInput.value;
    });

    animationRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isObjectAnim = document.querySelector('input[name="animation"]:checked').value === 'object';
            objectImageUrlInput.disabled = !isObjectAnim;
            objectImageUrlInput.style.opacity = isObjectAnim ? 1 : 0.5;
            if (!isObjectAnim) {
                 objectImageUrlInput.value = ''; // 다른 애니메이션 선택 시 URL 초기화 (선택사항)
            }
        });
    });
    // 초기 상태 설정
    const initialIsObjectAnim = document.querySelector('input[name="animation"]:checked').value === 'object';
    objectImageUrlInput.disabled = !initialIsObjectAnim;
    objectImageUrlInput.style.opacity = initialIsObjectAnim ? 1 : 0.5;


    startButton.addEventListener('click', () => {
        const targetValue = targetDatetimeInput.value;
        if (!targetValue) {
            alert('기준 일시를 선택해주세요!');
            return;
        }
        targetDate = new Date(targetValue).getTime();
        if (isNaN(targetDate) || targetDate <= Date.now()) {
            alert('유효한 미래의 날짜와 시간을 선택해주세요!');
            return;
        }

        selectedAnimation = document.querySelector('input[name="animation"]:checked').value;
        dDayMessageText = ddayMessageInput.value || "🎉 D-Day입니다! 🎉";
        guideMessageTextForCounter = guideMessageInput.value || "D-Day까지 카운트다운!"; // 카운터 화면용 안내문구 설정

        initialDifference = targetDate - Date.now();

        resetAnimationUI();
        if (selectedAnimation === 'ms') {
            millisecondsEl.classList.remove('hidden');
        }
        if (selectedAnimation === 'object') {
            const imageUrl = objectImageUrlInput.value || 'https://via.placeholder.com/80x80/007bff/ffffff?text=🚀';
            movingObject.src = imageUrl;
            movingObject.classList.remove('hidden');
        }
        if (selectedAnimation === 'circle') {
            fillingCircleContainer.classList.remove('hidden');
        }
        
        // 카운터 화면 안내 문구 설정
        countdownGuideMessageEl.textContent = guideMessageTextForCounter;
        countdownGuideMessageEl.classList.remove('hidden');

        finalMessageEl.classList.add('hidden'); // 이전 D-Day 메시지 숨김
        countdownDisplay.classList.remove('hidden'); // 카운트다운 숫자 표시
        animationArea.classList.remove('hidden'); // 애니메이션 영역 표시

        initialScreen.classList.add('hidden');
        counterScreen.classList.remove('hidden');

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {});
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }

        startCountdown();
    });

    closeCounterButton.addEventListener('click', () => {
        clearInterval(countdownInterval);
        counterScreen.classList.add('hidden');
        initialScreen.classList.remove('hidden');
        countdownGuideMessageEl.classList.add('hidden'); // 안내문구도 숨김

        // 전체화면 해제
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => {});
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        resetAnimationUI(); // 애니메이션 상태 초기화
    });


    function resetAnimationUI() {
        millisecondsEl.classList.add('hidden');
        movingObject.classList.add('hidden');
        movingObject.style.left = '0%';
        fillingCircleContainer.classList.add('hidden');
        fillingCircle.style.background = 'conic-gradient(#007bff 0deg, transparent 0deg)';
        countdownDisplay.style.color = 'white';
        // 카운터 화면 안내 문구도 필요시 초기화
        // countdownGuideMessageEl.classList.add('hidden');
    }

    function startCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 50);
    }

    function updateCountdown() {
        const now = Date.now();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            displayDdayReached();
            if (selectedAnimation === 'object') movingObject.style.left = `calc(100% - ${movingObject.offsetWidth}px)`;
            if (selectedAnimation === 'circle') fillingCircle.style.background = `conic-gradient(#007bff 360deg, transparent 0deg)`;
            if (selectedAnimation === 'textcolor') countdownDisplay.style.color = getRandomColor();
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        const ms = Math.floor((difference % 1000) / 10);

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
        if (selectedAnimation === 'ms') {
            millisecondsEl.textContent = String(ms).padStart(2, '0');
        }

        const progress = 1 - (difference / initialDifference);
        updateAnimation(progress);
    }

    function updateAnimation(progress) {
        switch (selectedAnimation) {
            case 'ms':
                break;
            case 'object':
                if (movingObject.offsetWidth > 0) {
                    const maxLeftPercentage = (animationArea.offsetWidth - movingObject.offsetWidth) / animationArea.offsetWidth * 100;
                    movingObject.style.left = `${Math.min(progress * 100, maxLeftPercentage)}%`;
                }
                break;
            case 'circle':
                const degrees = progress * 360;
                fillingCircle.style.background = `conic-gradient(#007bff ${degrees}deg, transparent ${degrees}deg)`;
                break;
            case 'textcolor':
                if (progress < 0.33) countdownDisplay.style.color = 'white';
                else if (progress < 0.66) countdownDisplay.style.color = 'yellow';
                else countdownDisplay.style.color = 'orangered';
                break;
        }
    }

    function displayDdayReached() {
        countdownDisplay.classList.add('hidden');
        animationArea.classList.add('hidden');
        countdownGuideMessageEl.classList.add('hidden'); // D-Day 도달 시 상단 안내문구도 숨김
        finalMessageEl.textContent = dDayMessageText;
        finalMessageEl.classList.remove('hidden');
    }
    
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }
});