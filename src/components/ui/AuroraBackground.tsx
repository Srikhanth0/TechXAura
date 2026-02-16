"use client";

import React, { useEffect, useRef } from 'react';

export default function AuroraBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        // Resize handling
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Aurora parameters - extremely cheap
        const waves = [
            { y: 0.3, amplitude: 50, frequency: 0.002, speed: 0.002, color: 'rgba(88, 28, 135, 0.4)' },
            { y: 0.5, amplitude: 30, frequency: 0.003, speed: 0.0015, color: 'rgba(147, 51, 234, 0.3)' },
            { y: 0.7, amplitude: 40, frequency: 0.0015, speed: 0.0025, color: 'rgba(192, 132, 252, 0.2)' }
        ];

        let time = 0;

        const animate = () => {
            if (!ctx || !canvas) return;

            // Deep dark purple background
            ctx.fillStyle = '#0f0518';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            waves.forEach((wave, i) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * wave.y);

                // Reduce resolution for performance on weak devices
                const step = 5;

                for (let x = 0; x < canvas.width; x += step) {
                    const y = Math.sin(x * wave.frequency + time * wave.speed + i) * wave.amplitude;
                    ctx.lineTo(x, canvas.height * wave.y + y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();


                // Gradient fill
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.5, wave.color);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.fill();
            });

            time += 1;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ filter: 'blur(60px)', background: '#0f0518' }}
        />
    );
}
