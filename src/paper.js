/**
 * paper.js - The official Form 27-B/6 dynamic canvas and 3D plane mesh.
 * Unlit material, serif complaint text with word-wrapping, official seal,
 * tilted stamp mark, and export to PNG capability.
 */

import * as THREE from 'three';

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 680;

/**
 * Wrap text onto canvas, breaking overly long words if necessary.
 */
function wrapAndBreakText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) continue;

    // Check if single word exceeds maxWidth on its own
    if (ctx.measureText(word).width > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      // Break the long word into pieces
      let chunk = '';
      for (let c = 0; c < word.length; c++) {
        const testChunk = chunk + word[c];
        if (ctx.measureText(testChunk + '-').width > maxWidth && chunk.length > 0) {
          lines.push(chunk + '-');
          chunk = word[c];
        } else {
          chunk = testChunk;
        }
      }
      currentLine = chunk;
      continue;
    }

    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Draws the official Form 27-B/6 onto the canvas.
 */
export function drawPaperCanvas(canvas, complaintText = '', outcome = null) {
  const ctx = canvas.getContext('2d');
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;

  // 1. Parchment Background
  ctx.fillStyle = '#faf4e6';
  ctx.fillRect(0, 0, w, h);

  // Subtle paper grain & warm vignette
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(240, 230, 208, 0.45)');
  grad.addColorStop(1, 'rgba(224, 210, 185, 0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Double border
  ctx.strokeStyle = 'rgba(155, 135, 105, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = 'rgba(175, 155, 125, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // 3. Official Department Seal (Top-Right watermark)
  ctx.save();
  ctx.translate(w - 74, 58);
  ctx.strokeStyle = 'rgba(150, 130, 105, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(150, 130, 105, 0.45)';
  ctx.font = 'bold 8px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WINDOW 7', 0, -4);
  ctx.fillText('BARNABY', 0, 6);
  ctx.fillText('★ OFFICIAL ★', 0, 16);
  ctx.restore();

  // 4. Official Form Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#261e16';
  ctx.font = 'bold 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('OFFICIAL COMPLAINT FORM', (w - 70) / 2 + 10, 52);

  ctx.fillStyle = '#6e5e4d';
  ctx.font = 'italic 11.5px "Georgia", serif';
  ctx.fillText('Form 27-B/6 (obsolete). Do not fold, spindle, or hope.', (w - 70) / 2 + 10, 72);

  // Decorative Rule
  ctx.strokeStyle = '#b8a68e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(32, 88);
  ctx.lineTo(w - 32, 88);
  ctx.stroke();

  // Bureaucratic Classification Checkboxes
  ctx.textAlign = 'left';
  ctx.fillStyle = '#7a6a58';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('[☑] Minor Grievance     [☑] Mild Agitation     [☐] Reasonableness (Disqualified)', 36, 108);

  // Section Label
  ctx.fillStyle = '#82715e';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('STATEMENT OF GRIEVANCE:', 36, 134);

  // 5. Complaint Text (Serif font, wrapped with hyphenation for long words)
  ctx.fillStyle = '#1c1611';
  ctx.font = 'italic 16.5px "Georgia", "Times New Roman", serif';
  const textX = 36;
  const startY = 166;
  const lineHeight = 26;
  const maxTextWidth = w - 72;

  const lines = wrapAndBreakText(ctx, complaintText || '(No grievance recorded)', maxTextWidth);
  const maxDisplayLines = 7;
  for (let i = 0; i < Math.min(lines.length, maxDisplayLines); i++) {
    ctx.fillText(lines[i], textX, startY + i * lineHeight);
  }
  if (lines.length > maxDisplayLines) {
    ctx.fillText('... [truncated per Department file limits]', textX, startY + maxDisplayLines * lineHeight);
  }

  // Faint lined paper guides
  ctx.strokeStyle = 'rgba(190, 175, 150, 0.22)';
  ctx.lineWidth = 1;
  for (let y = 174; y <= 350; y += 26) {
    ctx.beginPath();
    ctx.moveTo(36, y);
    ctx.lineTo(w - 36, y);
    ctx.stroke();
  }

  // 6. Official Disclaimers & Signatures
  ctx.fillStyle = '#8a7966';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('CITIZEN SIGNATURE: _______________________', 36, 395);
  ctx.fillText('DATE FILED: ' + new Date().toISOString().split('T')[0], w - 210, 395);

  ctx.textAlign = 'center';
  ctx.font = 'italic 9.5px "Georgia", serif';
  ctx.fillStyle = '#9c8d7b';
  ctx.fillText('All filings become sole property of the Void. No tracking numbers provided.', w / 2, 428);

  // 7. Tilted Stamp Mark (if outcome exists)
  if (outcome) {
    ctx.save();
    // Tilted stamp angle (-9.5 degrees)
    ctx.translate(w / 2, 530);
    ctx.rotate(-0.16);

    const stampColor = outcome.color || '#dc2626';
    ctx.globalAlpha = 0.90;

    // Distressed stamp ink shadow
    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(-182, -48, 364, 96);

    // Inner thin border
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-176, -42, 352, 84);

    // Stamp text
    ctx.textAlign = 'center';
    ctx.fillStyle = stampColor;
    ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(outcome.stampText, 0, -4);

    // Italic subtitle
    if (outcome.stampSubtitle) {
      ctx.font = 'italic bold 13px "Georgia", serif';
      ctx.letterSpacing = '0.5px';
      ctx.fillText(outcome.stampSubtitle, 0, 24);
    }

    ctx.restore();
  }
}

/**
 * Creates the 3D Paper mesh and texture.
 */
export function createPaper() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  drawPaperCanvas(canvas, '');

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  // Unlit material so text remains completely crisp and legible
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Aspect ratio matched to canvas: width 1.35, height 1.8
  const geometry = new THREE.PlaneGeometry(1.35, 1.8);
  const mesh = new THREE.Mesh(geometry, material);

  // Desk top surface is at y = 0.11
  mesh.rotation.x = -Math.PI / 2 + 0.22; // tilted toward camera
  mesh.position.set(4.0, 0.12, 0.45);   // Start offscreen to the right

  return {
    mesh,
    canvas,
    texture,
    centerPos: new THREE.Vector3(0, 0.12, 0.45),
    offscreenRight: new THREE.Vector3(3.8, 0.12, 0.45),
    offscreenLeft: new THREE.Vector3(-3.8, 0.12, 0.45),

    updateContent(text, outcome = null) {
      drawPaperCanvas(canvas, text, outcome);
      texture.needsUpdate = true;
    },

    exportDataURL() {
      return canvas.toDataURL('image/png');
    },

    setSlideIn(t) {
      // Ease out cubic with gentle flutter
      const ease = 1 - Math.pow(1 - t, 3);
      mesh.position.x = THREE.MathUtils.lerp(this.offscreenRight.x, this.centerPos.x, ease);
      mesh.position.y = this.centerPos.y;
      mesh.position.z = this.centerPos.z;

      // Subtle paper landing flutter
      const flutter = Math.sin(t * Math.PI) * 0.05;
      mesh.rotation.z = flutter;
    },

    setSlideOut(t) {
      // Ease in cubic
      const ease = t * t * t;
      mesh.position.x = THREE.MathUtils.lerp(this.centerPos.x, this.offscreenLeft.x, ease);
      mesh.position.y = this.centerPos.y;
      mesh.position.z = this.centerPos.z;
      mesh.rotation.z = -ease * 0.08;
    },

    setShred(t) {
      // Shrink vertically down into the desk/shredder
      const ease = t * t;
      mesh.scale.set(1 - ease * 0.3, Math.max(0.01, 1 - ease), 1);
      mesh.position.y = this.centerPos.y - ease * 0.4;
    },

    resetToRight() {
      mesh.position.copy(this.offscreenRight);
      mesh.rotation.z = 0;
      mesh.scale.set(1, 1, 1);
    }
  };
}
