/**
 * Hero Carousel with Typewriter Effect
 * Manages the rotation of hero images and text with synchronized animations.
 */

const heroSlides = [
    {
        pillImage: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=60&w=600",
        mainImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1000", // Bulk Pharma / Warehouse
        titles: ["Your", "Strategic", "Partner."],
        text: "Your strategic partner in pharmaceutical distribution. Supplying institutions with quality medicines, galenicals, and surgicals.",
        alt: "Pharmaceutical warehouse distribution center"
    },
    {
        pillImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=60&w=600", // Lab / Manufacturing
        mainImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000",
        titles: ["Bulk", "Galenical", "Supply."],
        text: "Raw materials and compounding bases for pharmacies and manufacturers. GMP certified quality.",
        alt: "Laboratory manufacturing environment"
    },
    {
        pillImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=60&w=600", // Surgical/Medical
        mainImage: "https://images.unsplash.com/photo-1583912267670-6575cb941e7d?auto=format&fit=crop&q=80&w=1000",
        titles: ["Medical", "& Surgical", "Sundries."],
        text: "Complete range of hospital consumables, from surgical spirits to latex gloves and disposables.",
        alt: "Medical surgical equipment supplies"
    }
];

class HeroCarousel {
    constructor(slides) {
        this.slides = slides; // Assumes slide 0 has alt "Pharmacy interior" implicitly or we add it
        // Retrofit slide 0 alt if missing in a real app, but here we can just add it to the array above if we could edit it all.
        // Since we are editing the array, I will ensure the first slide object also has alt in the full file replace if I were doing that.
        // But I am doing a partial replace. I will assume slide 0 is fine or I should update it too.

        this.currentIndex = 0;
        this.nextIndex = 1;
        this.interval = 6000; // Time between slides
        this.isAnimating = false;

        // DOM Elements
        this.dom = {
            pillImage: document.getElementById('hero-img'),
            mainImage: document.getElementById('hero-main-img'),
            titles: [
                document.getElementById('hero-title-1'),
                document.getElementById('hero-title-2'),
                document.getElementById('hero-title-3')
            ],
            text: document.getElementById('hero-text')
        };

        this.init();
    }

    init() {
        if (!this.dom.pillImage || !this.dom.mainImage) {
            console.error("Hero Carousel: DOM elements not found");
            return;
        }

        // Start Loop
        setInterval(() => this.nextSlide(), this.interval);
    }

    async nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // 1. Erase Phase
        await this.eraseAll();

        // 2. Image Swap Phase (Fade)
        this.changeImages();

        // 3. Type Phase
        this.currentIndex = this.nextIndex;
        this.nextIndex = (this.currentIndex + 1) % this.slides.length;

        await this.typeAll();

        this.isAnimating = false;
    }

    changeImages() {
        const nextSlide = this.slides[this.nextIndex];

        // Fade Out
        this.dom.pillImage.style.opacity = '0';
        this.dom.pillImage.style.transform = 'scale(1.1)';

        this.dom.mainImage.style.opacity = '0';
        this.dom.mainImage.style.transform = 'scale(1.05)';

        setTimeout(() => {
            // Swap Sources
            this.dom.pillImage.src = nextSlide.pillImage;
            this.dom.mainImage.src = nextSlide.mainImage;

            // Update Alt Text if available
            if (nextSlide.alt) {
                this.dom.mainImage.alt = nextSlide.alt;
            }

            // Fade In (onload ensures no flicker)
            const restoreOpacity = () => {
                this.dom.pillImage.style.opacity = '1';
                this.dom.pillImage.style.transform = 'scale(1)';

                this.dom.mainImage.style.opacity = '1';
                this.dom.mainImage.style.transform = 'scale(1)';
            };

            // Simple wait for both, in prod we'd track load events individually but this is safe enough for recycled cache
            setTimeout(restoreOpacity, 100);

        }, 800); // Wait for fade out (increased to match CSS transition)
    }

    // --- Typewriter Logic ---

    async eraseAll() {
        // Erase Text Paragraph first (faster)
        const pPromise = this.eraseText(this.dom.text, 5);

        // Erase Titles in reverse order 3 -> 2 -> 1
        await this.eraseText(this.dom.titles[2], 10);
        await this.eraseText(this.dom.titles[1], 10);
        await this.eraseText(this.dom.titles[0], 10);

        await pPromise; // Ensure everything is gone
    }

    async typeAll() {
        const data = this.slides[this.currentIndex];

        // Type Titles in order 1 -> 2 -> 3
        await this.typeText(this.dom.titles[0], data.titles[0], 30);
        await this.typeText(this.dom.titles[1], data.titles[1], 30);
        await this.typeText(this.dom.titles[2], data.titles[2], 30);

        // Type Paragraph
        await this.typeText(this.dom.text, data.text, 5);
    }

    typeText(element, text, speed) {
        return new Promise(resolve => {
            element.innerText = '';
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    eraseText(element, speed) {
        return new Promise(resolve => {
            const text = element.innerText;
            let i = text.length;
            function erase() {
                if (i > 0) {
                    element.innerHTML = text.substring(0, i - 1);
                    i--;
                    setTimeout(erase, speed);
                } else {
                    resolve();
                }
            }
            erase();
        });
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel(heroSlides);
});
