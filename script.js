// ─── Conversion Table (all to meters first) ───────────────────────────────
const toMeters = {
    km:         1000,
    miles:      1609.344,
    meters:     1,
    feet:       0.3048,
    inches:     0.0254,
    cm:         0.01,
    yards:      0.9144,
    nautical:   1852,
    lightyears: 9.461e15
};

const unitLabels = {
    km:         "km",
    miles:      "mi",
    meters:     "m",
    feet:       "ft",
    inches:     "in",
    cm:         "cm",
    yards:      "yd",
    nautical:   "nm",
    lightyears: "ly"
};

const funMessages = [
    "🎉 Vroom! Conversion complete!",
    "🏎️ Speedy maths detected!",
    "📯 BEEP BEEP! Here's your answer!",
    "🛣️ Road trip math activated!",
    "🚦 Green light! Result incoming!",
    "⛽ Fuelled up with fresh numbers!",
    "🗺️ GPS updated successfully!",
    "🚗 Zoom zoom! Numbers crunched!",
    "🎊 Your car is a calculator now!",
    "🏁 Finish line! Here's your result!"
];

// ─── Step Tracker ─────────────────────────────────────────────────────────
function updateSteps(completedStep) {
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3')
    ];

    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === completedStep) {
            step.classList.add('active');
        }
    });
}

// ─── Format Result Nicely ─────────────────────────────────────────────────
function formatResult(value) {
    if (value >= 1e9 || (value < 0.0001 && value > 0)) {
        return value.toExponential(4);
    }
    return parseFloat(value.toFixed(6)).toString();
}

// ─── Show Result Bubble ───────────────────────────────────────────────────
function showBubble(message, duration = 4000) {
    const resultBubble = document.getElementById('resultBubble');
    resultBubble.textContent = message;
    resultBubble.classList.add('show');
    setTimeout(() => resultBubble.classList.remove('show'), duration);
}

// ─── Show Fun Message ─────────────────────────────────────────────────────
function showFunMessage() {
    const funMsg = document.getElementById('funMsg');
    const msg = funMessages[Math.floor(Math.random() * funMessages.length)];
    funMsg.textContent = msg;
    funMsg.classList.add('show');
    setTimeout(() => funMsg.classList.remove('show'), 2500);
}

// ─── Wheel Spin Animation ─────────────────────────────────────────────────
function spinWheels() {
    const frontWheel = document.getElementById('frontWheel');
    const rearWheel  = document.getElementById('rearWheel');
    const fSpoke1    = document.getElementById('fSpoke1');
    const fSpoke2    = document.getElementById('fSpoke2');
    const rSpoke1    = document.getElementById('rSpoke1');
    const rSpoke2    = document.getElementById('rSpoke2');

    [frontWheel, rearWheel, fSpoke1, fSpoke2, rSpoke1, rSpoke2].forEach(el => {
        if (el) el.classList.add('wheel-spin');
    });

    setTimeout(() => {
        [frontWheel, rearWheel, fSpoke1, fSpoke2, rSpoke1, rSpoke2].forEach(el => {
            if (el) el.classList.remove('wheel-spin');
        });
    }, 1500);
}

// ─── Honk Sound Effect (Web Audio API) ───────────────────────────────────
function playHonk() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        const oscillator = ctx.createOscillator();
        const gainNode   = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type      = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.setValueAtTime(480, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(440, ctx.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
        // Silently fail if audio not supported
    }
}

// ─── Button Shake Animation ───────────────────────────────────────────────
function shakeButton() {
    const btn = document.getElementById('convertBtn');
    btn.style.transform = 'scale(0.9) rotate(-5deg)';
    setTimeout(() => { btn.style.transform = 'scale(1.1) rotate(5deg)'; }, 100);
    setTimeout(() => { btn.style.transform = 'scale(1) rotate(0deg)'; }, 200);
}

// ─── Highlight Active Panel ───────────────────────────────────────────────
function highlightPanel(panelId) {
    document.querySelectorAll('.windshield-panel, .side-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(panelId).classList.add('active');
    setTimeout(() => {
        document.getElementById(panelId).classList.remove('active');
    }, 1000);
}

// ─── Main Conversion Function ──────────────────────────────────────────────
function convertDistance() {
    const fromUnit   = document.getElementById('fromUnit').value;
    const toUnit     = document.getElementById('toUnit').value;
    const inputValue = parseFloat(document.getElementById('distanceInput').value);

    // Validate: empty input
    if (isNaN(inputValue)) {
        showBubble('⚠️ Enter a number first!', 2500);
        highlightPanel('sidePanel');
        return;
    }

    // Validate: negative number
    if (inputValue < 0) {
        showBubble('😅 No negative distances! We go forward!', 2500);
        return;
    }

    // Validate: same unit
    if (fromUnit === toUnit) {
        showBubble(`😂 Same unit! It's still ${inputValue} ${unitLabels[fromUnit]}!`, 2500);
        return;
    }

    // ── Do the conversion ──
    const inMeters = inputValue * toMeters[fromUnit];
    const result   = inMeters / toMeters[toUnit];
    const formatted = formatResult(result);

    // ── Show everything ──
    showBubble(`🚗 ${inputValue} ${unitLabels[fromUnit]} = ${formatted} ${unitLabels[toUnit]}`);
    showFunMessage();
    spinWheels();
    playHonk();
    shakeButton();
    updateSteps(2);

    // Highlight both panels briefly
    document.getElementById('windshieldPanel').classList.add('active');
    document.getElementById('sidePanel').classList.add('active');
    setTimeout(() => {
        document.getElementById('windshieldPanel').classList.remove('active');
        document.getElementById('sidePanel').classList.remove('active');
    }, 1500);
}

// ─── Event Listeners ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Step 1 - changing unit dropdowns
    document.getElementById('fromUnit').addEventListener('change', () => {
        updateSteps(1);
        highlightPanel('windshieldPanel');
    });

    document.getElementById('toUnit').addEventListener('change', () => {
        updateSteps(1);
        highlightPanel('windshieldPanel');
    });

    // Step 2 - typing in the distance input
    document.getElementById('distanceInput').addEventListener('input', () => {
        updateSteps(2);
        highlightPanel('sidePanel');
    });

    // Allow pressing Enter to convert
    document.getElementById('distanceInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertDistance();
        }
    });

    // Windshield panel click focuses the first dropdown
    document.getElementById('windshieldPanel').addEventListener('click', () => {
        document.getElementById('fromUnit').focus();
        updateSteps(1);
    });

    // Side panel click focuses the input
    document.getElementById('sidePanel').addEventListener('click', () => {
        document.getElementById('distanceInput').focus();
        updateSteps(2);
    });

});
