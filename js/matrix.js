class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-rain');
        this.ctx = this.canvas.getContext('2d');
        this.characters = '01';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.initialize();
    }

    initialize() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        // Semi-transparent black background to create fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set text style
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px monospace`;

        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            // Reset drop to top with random delay
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize matrix rain when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
}); 