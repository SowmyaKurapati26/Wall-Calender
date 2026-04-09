import { DominantColor } from '@/types/calendar';

const FALLBACK: DominantColor = {
  r: 217, g: 119, b: 52,
  hex: '#d97734',
  hsl: { h: 24, s: 68, l: 53 },
};

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

/**
 * Samples the image at 64×64 and computes a saturation-weighted average
 * biased toward midtones. The result is a vibrant accent color that
 * adapts to whatever hero image is loaded.
 */
export function extractDominantColor(src: string): Promise<DominantColor> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(FALLBACK); return; }

      const size = 64;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);
      const buckets: { r: number; g: number; b: number; weight: number }[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (a < 128) continue;

        const brightness = (r + g + b) / 3;
        if (brightness < 30 || brightness > 230) continue;

        const hsl = rgbToHsl(r, g, b);
        const weight = (hsl.s / 100) * (1 - Math.abs(hsl.l - 50) / 50);
        if (weight > 0.1) buckets.push({ r, g, b, weight });
      }

      if (buckets.length === 0) { resolve(FALLBACK); return; }

      let totalWeight = 0, sumR = 0, sumG = 0, sumB = 0;
      for (const px of buckets) {
        sumR += px.r * px.weight;
        sumG += px.g * px.weight;
        sumB += px.b * px.weight;
        totalWeight += px.weight;
      }

      const avgR = Math.round(sumR / totalWeight);
      const avgG = Math.round(sumG / totalWeight);
      const avgB = Math.round(sumB / totalWeight);

      const hsl = rgbToHsl(avgR, avgG, avgB);
      // Push saturation up so it works well as a UI accent
      hsl.s = Math.min(100, hsl.s + 15);
      hsl.l = Math.max(35, Math.min(55, hsl.l));

      resolve({ r: avgR, g: avgG, b: avgB, hex: rgbToHex(avgR, avgG, avgB), hsl });
    };

    img.onerror = () => resolve(FALLBACK);
    img.src = src;
  });
}
