/**
 * Performance utilities for Three.js energy beam
 * Detects device capabilities and adjusts settings accordingly
 */



export interface DeviceCapabilities {
    isMobile: boolean;
    isLowEnd: boolean;
    pixelRatio: number;
    particleCount: number;
    enableBloom: boolean;
    enablePostProcessing: boolean;
    geometryDetail: 'low' | 'medium' | 'high';
}

/**
 * Detect if device is mobile
 */
export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
        navigator.userAgent
    );
};

/**
 * Detect if device is low-end based on hardware concurrency and memory
 */
export const isLowEndDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;

    // Low-end if fewer than 4 cores or less than 4GB RAM
    return cores < 4 || memory < 4;
};

/**
 * Get optimal pixel ratio for device
 */
export const getOptimalPixelRatio = (): number => {
    if (typeof window === 'undefined') return 1;
    const dpr = window.devicePixelRatio || 1;

    // Cap at 2 for performance
    // Use 1 for low-end devices
    if (isLowEndDevice()) return 1;
    return Math.min(dpr, 2);
};

/**
 * Calculate optimal particle count based on screen size and device capability
 */
export const getOptimalParticleCount = (): number => {
    if (typeof window === 'undefined') return 1000;
    const area = window.innerWidth * window.innerHeight;
    const isMobile = isMobileDevice();
    const isLowEnd = isLowEndDevice();

    if (isLowEnd) return 500;
    if (isMobile) {
        if (area < 500000) return 800;      // Small mobile
        if (area < 1000000) return 1200;    // Large mobile
        return 1500;                         // Tablet
    }

    // Desktop
    if (area < 2000000) return 2000;      // HD
    if (area < 4000000) return 2500;      // Full HD
    return 3000;                           // 2K/4K
};

/**
 * Get optimal geometry detail level
 */
export const getGeometryDetail = (): 'low' | 'medium' | 'high' => {
    if (isLowEndDevice()) return 'low';
    if (isMobileDevice()) return 'medium';
    return 'high';
};

/**
 * Geometry segments based on detail level
 */
export const getGeometrySegments = (detail: 'low' | 'medium' | 'high') => {
    const segments = {
        low: { radial: 16, height: 1, ring: 50 },
        medium: { radial: 32, height: 1, ring: 80 },
        high: { radial: 64, height: 1, ring: 100 }
    };
    return segments[detail];
};

/**
 * Get all device capabilities at once
 */
export const getDeviceCapabilities = (): DeviceCapabilities => {
    const isMobile = isMobileDevice();
    const isLowEnd = isLowEndDevice();
    const detail = getGeometryDetail();

    return {
        isMobile,
        isLowEnd,
        pixelRatio: getOptimalPixelRatio(),
        particleCount: getOptimalParticleCount(),
        enableBloom: !isLowEnd,
        enablePostProcessing: !isLowEnd,
        geometryDetail: detail
    };
};

/**
 * FPS Monitor for performance tracking
 */
export class FPSMonitor {
    private frames: number[] = [];
    private lastTime: number = 0;
    private frameCount: number = 0;

    constructor() {
        if (typeof window !== 'undefined') {
            this.lastTime = performance.now();
        }
    }

    update(): number {
        if (typeof window === 'undefined') return 60;
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;

        // Valid check to prevent division by zero or negative delta
        if (delta <= 0) return 60;

        const fps = 1000 / delta;
        this.frames.push(fps);

        // Keep last 60 frames
        if (this.frames.length > 60) {
            this.frames.shift();
        }

        this.frameCount++;
        return fps;
    }

    getAverageFPS(): number {
        if (this.frames.length === 0) return 60;
        const sum = this.frames.reduce((a, b) => a + b, 0);
        return sum / this.frames.length;
    }

    isPerformanceGood(): boolean {
        return this.getAverageFPS() >= 50;
    }

    reset(): void {
        this.frames = [];
        this.frameCount = 0;
    }
}

/**
 * Adaptive quality manager
 * Automatically reduces quality if FPS drops
 */
export class AdaptiveQualityManager {
    private fpsMonitor: FPSMonitor;
    private checkInterval: number = 60; // Check every 60 frames
    private framesSinceCheck: number = 0;

    constructor() {
        this.fpsMonitor = new FPSMonitor();
    }

    update(): { shouldReduceQuality: boolean; currentFPS: number } {
        const fps = this.fpsMonitor.update();
        this.framesSinceCheck++;

        if (this.framesSinceCheck >= this.checkInterval) {
            this.framesSinceCheck = 0;
            const avgFPS = this.fpsMonitor.getAverageFPS();

            // Reduce quality if FPS drops below 45
            return {
                shouldReduceQuality: avgFPS < 45,
                currentFPS: avgFPS
            };
        }

        return {
            shouldReduceQuality: false,
            currentFPS: fps
        };
    }

    reset(): void {
        this.fpsMonitor.reset();
        this.framesSinceCheck = 0;
    }
}

/**
 * Memory monitor for detecting memory leaks
 */
export class MemoryMonitor {
    private checkInterval: number;
    private onMemoryWarning?: (used: number, limit: number) => void;

    constructor(
        checkInterval: number = 5000,
        onMemoryWarning?: (used: number, limit: number) => void
    ) {
        this.checkInterval = checkInterval;
        this.onMemoryWarning = onMemoryWarning;
    }

    start(): NodeJS.Timeout | null {
        if (typeof window === 'undefined') return null;
        // Check if performance.memory is available (Chrome only)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(performance as Performance & { memory?: any }).memory) {
            //   console.warn('Memory monitoring not available in this browser');
            return null;
        }

        return setInterval(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const memory = (performance as Performance & { memory?: any }).memory;
            const usedMB = memory.usedJSHeapSize / 1048576;
            const limitMB = memory.jsHeapSizeLimit / 1048576;
            const percentUsed = (usedMB / limitMB) * 100;

            // Warn if using more than 75% of available memory
            if (percentUsed > 75 && this.onMemoryWarning) {
                this.onMemoryWarning(usedMB, limitMB);
            }
        }, this.checkInterval);
    }
}

/**
 * Debounced resize handler
 */
export const createResizeHandler = (
    callback: () => void,
    delay: number = 150
): (() => void) => {
    let timeout: NodeJS.Timeout;

    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    };
};

/**
 * Check WebGL support and capabilities
 */
export const checkWebGLSupport = (): {
    supported: boolean;
    version: number;
    maxTextureSize: number;
    maxVertexUniforms: number;
} => {
    if (typeof window === 'undefined') return { supported: false, version: 0, maxTextureSize: 0, maxVertexUniforms: 0 };
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) {
            return {
                supported: false,
                version: 0,
                maxTextureSize: 0,
                maxVertexUniforms: 0
            };
        }

        const version = gl instanceof WebGL2RenderingContext ? 2 : 1;

        return {
            supported: true,
            version,
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
        };
    } catch {
        return {
            supported: false,
            version: 0,
            maxTextureSize: 0,
            maxVertexUniforms: 0
        };
    }
};
