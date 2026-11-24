import * as THREE from 'three';

// Utility to generate procedural high-resolution PBR textures
// Gives photorealistic tactile realism to 3D materials

class TextureGenerator {
  // 1. Brushed Titanium Anisotropic Texture
  static createBrushedTitanium() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base titanium tone
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine brushed horizontal micro-streaks
    for (let i = 0; i < 4000; i++) {
      const y = Math.random() * 1024;
      const length = Math.random() * 200 + 50;
      const x = Math.random() * (1024 - length);
      const alpha = Math.random() * 0.12 + 0.02;
      const shade = Math.random() > 0.5 ? 255 : 30;

      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      ctx.fillRect(x, y, length, 1 + Math.random());
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  // 2. Real Twill Carbon Fiber Weave Texture
  static createCarbonFiber() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 512);

    const step = 16;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const isAlternate = ((x / step) + (y / step)) % 2 === 0;
        const grad = ctx.createLinearGradient(x, y, x + step, y + step);
        if (isAlternate) {
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(0.5, '#475569');
          grad.addColorStop(1, '#0f172a');
        } else {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#334155');
          grad.addColorStop(1, '#1e293b');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, step - 1, step - 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  // 3. Concentric Copper Voice Coil Windings
  static createCopperCoil() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 0, 512, 512);

    // Tightly wound copper wire stripes
    const wireCount = 48;
    const wireHeight = 512 / wireCount;
    for (let i = 0; i < wireCount; i++) {
      const y = i * wireHeight;
      const grad = ctx.createLinearGradient(0, y, 0, y + wireHeight);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.3, '#d97706');
      grad.addColorStop(0.6, '#f59e0b');
      grad.addColorStop(1, '#78350f');

      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 512, wireHeight - 1);

      // Wire separation groove
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, y + wireHeight - 1, 512, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // 4. Laser Micro-Perforated Acoustic Mesh Filter
  static createAcousticMesh() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Solid metal base
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 512, 512);

    // Hexagonal / staggered laser perforated acoustic holes
    ctx.fillStyle = '#0f172a';
    const radius = 5;
    const spacing = 18;

    for (let y = 0; y < 512; y += spacing) {
      const offsetX = (y / spacing) % 2 === 0 ? 0 : spacing / 2;
      for (let x = 0; x < 512; x += spacing) {
        ctx.beginPath();
        ctx.arc(x + offsetX, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  // 5. High-End Audio Circuit PCB Traces
  static createPCBTraces() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Matte black circuit substrate
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, 512, 512);

    // Gold circuit traces
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const drawTrace = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();

      // Solder via point
      const last = points[points.length - 1];
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(last[0], last[1], 6, 0, Math.PI * 2);
      ctx.fill();
    };

    drawTrace([[40, 60], [120, 60], [160, 100], [240, 100]]);
    drawTrace([[40, 120], [100, 120], [140, 160], [140, 240]]);
    drawTrace([[200, 40], [200, 140], [280, 220], [360, 220]]);
    drawTrace([[80, 320], [180, 320], [260, 400], [400, 400]]);
    drawTrace([[320, 80], [420, 80], [460, 120], [460, 280]]);
    drawTrace([[260, 260], [320, 320], [380, 320]]);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}

export default TextureGenerator;
