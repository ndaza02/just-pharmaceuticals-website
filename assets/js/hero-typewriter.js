/**
 * One-time typewriter effect for the hero section
 */
document.addEventListener('DOMContentLoaded', () => {
    const elements = [
        { id: 'type-1', text: 'Just', speed: 100 },
        { id: 'type-2', text: 'Strategic.', speed: 80, delay: 200 },
        { id: 'type-3', text: 'Supply.', speed: 120, delay: 300 }
    ];

    async function typewriter(el, text, speed) {
        if (!el) return;
        el.innerText = '';
        return new Promise(resolve => {
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    el.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            type();
        });
    }

    async function startEffect() {
        for (const item of elements) {
            const el = document.getElementById(item.id);
            if (el) {
                if (item.delay) await new Promise(r => setTimeout(r, item.delay));
                await typewriter(el, item.text, item.speed);
            }
        }
    }

    // Start the effect after a 0.3s delay
    setTimeout(startEffect, 300);
});
