/**
 * scene.js - Three.js WebGL scene, camera, lighting, desk, and interactive props.
 * Counter is strictly in front of Barnaby; props are arranged cleanly on the desk top.
 */

import * as THREE from 'three';

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function initScene(canvasElement, { onObjectClick } = {}) {
  if (!isWebGLAvailable()) {
    return null;
  }

  // 1. Scene
  const scene = new THREE.Scene();

  // 2. Camera: Angled down at the desk and clerk
  const baseFov = 40;
  const camera = new THREE.PerspectiveCamera(
    baseFov,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  const lookTarget = new THREE.Vector3(0, 0.45, 0.05);

  // 3. Renderer with pixel ratio capped at 2
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // 4. Lighting: Soft, warm, high-quality lighting
  const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0x6e655c, 1.05);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.35);
  keyLight.position.set(3.0, 5.0, 4.0);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xa5c4e4, 0.5);
  rimLight.position.set(-3.5, 3.5, -3.5);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xffebd2, 0.4);
  fillLight.position.set(-2.0, 2.0, 3.0);
  scene.add(fillLight);

  // 5. Desk (Counter in front of Barnaby)
  // Desk is centered around z = 0.35, with depth 1.4 (front z = 1.05, back z = -0.35)
  // Barnaby stands behind at z = -0.48, so the counter is in front of his waist.
  const deskGroup = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d2314, // Dark walnut
    roughness: 0.75,
    metalness: 0.05
  });
  const bodyGeo = new THREE.BoxGeometry(4.0, 1.4, 1.3);
  const deskBody = new THREE.Mesh(bodyGeo, bodyMaterial);
  deskBody.position.set(0, -0.7, 0.35);
  deskGroup.add(deskBody);

  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0x7c4927, // Warm polished teak top
    roughness: 0.6,
    metalness: 0.05
  });
  const topGeo = new THREE.BoxGeometry(4.4, 0.12, 1.4);
  const deskTop = new THREE.Mesh(topGeo, topMaterial);
  deskTop.position.set(0, 0.05, 0.35);
  deskGroup.add(deskTop);

  // Gold Nameplate: "BARNABY • WINDOW 7" on front face
  const nameplateGroup = new THREE.Group();
  nameplateGroup.position.set(0, -0.16, 1.02);

  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Brass gold
    roughness: 0.3,
    metalness: 0.85
  });
  const plateGeo = new THREE.BoxGeometry(1.3, 0.26, 0.03);
  const plateMesh = new THREE.Mesh(plateGeo, plateMaterial);
  nameplateGroup.add(plateMesh);

  const nameCanvas = document.createElement('canvas');
  nameCanvas.width = 384;
  nameCanvas.height = 80;
  const nctx = nameCanvas.getContext('2d');
  nctx.fillStyle = '#b89428';
  nctx.fillRect(0, 0, 384, 80);

  nctx.strokeStyle = '#6e5412';
  nctx.lineWidth = 3;
  nctx.strokeRect(4, 4, 376, 72);

  nctx.fillStyle = '#22190f';
  nctx.font = 'bold 22px -apple-system, sans-serif';
  nctx.textAlign = 'center';
  nctx.letterSpacing = '1.5px';
  nctx.fillText('BARNABY • WINDOW 7', 192, 38);

  nctx.font = 'italic 12px "Georgia", serif';
  nctx.fillText('Certified Bureaucrat', 192, 60);

  const nameTexture = new THREE.CanvasTexture(nameCanvas);
  const labelMaterial = new THREE.MeshBasicMaterial({ map: nameTexture });
  const labelGeo = new THREE.PlaneGeometry(1.22, 0.22);
  const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
  labelMesh.position.z = 0.02;
  nameplateGroup.add(labelMesh);

  deskGroup.add(nameplateGroup);

  // 6. Interactive 3D Props on Desk
  const clickableObjects = [];

  // 6a. Brass Service Bell (Front-left of counter)
  const bellGroup = new THREE.Group();
  bellGroup.position.set(-1.25, 0.11, 0.65);
  bellGroup.userData = { type: 'bell' };

  const bellBaseGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.04, 20);
  const bellBaseMat = new THREE.MeshStandardMaterial({ color: 0x1f1d1d, roughness: 0.8 });
  const bellBase = new THREE.Mesh(bellBaseGeo, bellBaseMat);
  bellBase.position.y = 0.02;
  bellGroup.add(bellBase);

  const bellDomeGeo = new THREE.SphereGeometry(0.16, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const bellBrassMat = new THREE.MeshStandardMaterial({
    color: 0xebb71a,
    roughness: 0.2,
    metalness: 0.95
  });
  const bellDome = new THREE.Mesh(bellDomeGeo, bellBrassMat);
  bellDome.position.y = 0.04;
  bellGroup.add(bellDome);

  const plungerGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.08, 12);
  const plunger = new THREE.Mesh(plungerGeo, bellBrassMat);
  plunger.position.y = 0.20;
  bellGroup.add(plunger);

  const plungerCapGeo = new THREE.SphereGeometry(0.038, 12, 12);
  const plungerCap = new THREE.Mesh(plungerCapGeo, bellBrassMat);
  plungerCap.position.y = 0.24;
  bellGroup.add(plungerCap);

  deskGroup.add(bellGroup);
  clickableObjects.push(bellGroup);

  // 6b. Ceramic Coffee Mug (Near Barnaby's left hand)
  const mugGroup = new THREE.Group();
  mugGroup.position.set(-0.68, 0.11, 0.05);
  mugGroup.userData = { type: 'coffee' };

  const mugMat = new THREE.MeshStandardMaterial({
    color: 0xf5f3ee, // Smooth ceramic
    roughness: 0.35,
    metalness: 0.05
  });

  const mugGeo = new THREE.CylinderGeometry(0.13, 0.12, 0.24, 20);
  const mugBody = new THREE.Mesh(mugGeo, mugMat);
  mugBody.position.y = 0.12;
  mugGroup.add(mugBody);

  // Coffee liquid
  const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x241407, roughness: 0.2 });
  const coffeeGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.02, 18);
  const coffeeMesh = new THREE.Mesh(coffeeGeo, coffeeMat);
  coffeeMesh.position.y = 0.21;
  mugGroup.add(coffeeMesh);

  // Mug Handle
  const handleGeo = new THREE.TorusGeometry(0.075, 0.022, 10, 16, Math.PI * 1.15);
  const handleMesh = new THREE.Mesh(handleGeo, mugMat);
  handleMesh.rotation.y = Math.PI / 2;
  handleMesh.rotation.z = -Math.PI / 2;
  handleMesh.position.set(-0.13, 0.12, 0);
  mugGroup.add(handleMesh);

  // Steam particles
  const steamGroup = new THREE.Group();
  const steamParticles = [];
  const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  for (let i = 0; i < 4; i++) {
    const sGeo = new THREE.SphereGeometry(0.022 + i * 0.007, 8, 8);
    const sMesh = new THREE.Mesh(sGeo, steamMat.clone());
    sMesh.position.set((Math.random() - 0.5) * 0.06, 0.26 + i * 0.07, (Math.random() - 0.5) * 0.06);
    steamParticles.push({ mesh: sMesh, baseOffsetY: 0.26 + i * 0.07, speed: 0.7 + i * 0.25 });
    steamGroup.add(sMesh);
  }
  mugGroup.add(steamGroup);

  deskGroup.add(mugGroup);
  clickableObjects.push(mugGroup);

  // 6c. Wooden In-Tray with Paper Stack (Right side of desk)
  const trayGroup = new THREE.Group();
  trayGroup.position.set(1.45, 0.11, 0.25);

  const trayMat = new THREE.MeshStandardMaterial({ color: 0x54301a, roughness: 0.7 });
  const trayBottom = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.04, 0.88), trayMat);
  trayBottom.position.y = 0.02;
  trayGroup.add(trayBottom);

  const stackMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e4, roughness: 0.9 });
  const paperStack = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.10, 0.80), stackMat);
  paperStack.position.y = 0.08;
  trayGroup.add(paperStack);

  deskGroup.add(trayGroup);

  // 6d. Stamp Ink Pad (Right-front)
  const inkPadGroup = new THREE.Group();
  inkPadGroup.position.set(1.25, 0.11, 0.55);
  const inkPadBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.5), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  inkPadBase.position.y = 0.015;
  inkPadGroup.add(inkPadBase);

  const inkFelt = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.42), new THREE.MeshStandardMaterial({ color: 0x881111 }));
  inkFelt.position.y = 0.03;
  inkPadGroup.add(inkFelt);

  deskGroup.add(inkPadGroup);
  scene.add(deskGroup);

  // 7. Raycaster for Interactive Clicks
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
      canvasElement.style.cursor = 'pointer';
    } else {
      canvasElement.style.cursor = 'default';
    }
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
      let topObj = intersects[0].object;
      while (topObj.parent && !topObj.userData.type && topObj !== scene) {
        topObj = topObj.parent;
      }
      if (topObj.userData && topObj.userData.type && onObjectClick) {
        onObjectClick(topObj.userData.type);
      }
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerdown', onPointerDown);

  // Bell press animation timer
  let bellAnimTimer = 0;
  function triggerBellPress() {
    bellAnimTimer = 0.35;
  }

  // 8. Camera Shake State
  let shakeTime = 0;
  let shakeDuration = 0;
  let shakeIntensity = 0;

  function triggerCameraShake(intensity = 0.14, duration = 0.35) {
    shakeIntensity = intensity;
    shakeDuration = duration;
    shakeTime = duration;
  }

  // 9. Responsive Camera Layout
  let baseCamZ = 3.6;
  let baseCamY = 2.2;

  function updateCameraLayout() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    camera.aspect = aspect;

    if (aspect < 1.0) {
      const factor = Math.max(aspect, 0.42);
      camera.position.z = baseCamZ / factor;
      camera.position.y = baseCamY + (1.0 - factor) * 1.35;
      camera.fov = baseFov + (1.0 - factor) * 6;
    } else {
      camera.position.set(0, baseCamY, baseCamZ);
      camera.fov = baseFov;
    }

    camera.updateProjectionMatrix();
    camera.lookAt(lookTarget);
  }

  // 10. Background Color Sync with CSS Variable
  function syncThemeBackground() {
    const computed = getComputedStyle(document.documentElement);
    const colorStr = computed.getPropertyValue('--color-canvas').trim();
    if (colorStr) {
      scene.background = new THREE.Color(colorStr);
    }
  }

  updateCameraLayout();
  syncThemeBackground();

  window.addEventListener('resize', () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCameraLayout();
  });

  return {
    scene,
    camera,
    renderer,
    deskGroup,
    bellGroup,
    mugGroup,
    clickableObjects,
    registerClickable(object3D, type) {
      object3D.userData = { type };
      clickableObjects.push(object3D);
    },
    triggerCameraShake,
    triggerBellPress,
    syncThemeBackground,
    updateCameraLayout,

    update(delta, time) {
      // Bell Plunger animation
      if (bellAnimTimer > 0) {
        bellAnimTimer -= delta;
        const pProgress = Math.sin((1 - bellAnimTimer / 0.35) * Math.PI);
        plunger.position.y = 0.20 - pProgress * 0.05;
        plungerCap.position.y = 0.24 - pProgress * 0.05;
      } else {
        plunger.position.y = 0.20;
        plungerCap.position.y = 0.24;
      }

      // Steam Wisps animation
      steamParticles.forEach((sp, idx) => {
        const cycle = ((time * sp.speed + idx * 0.4) % 1.0);
        sp.mesh.position.y = 0.25 + cycle * 0.16;
        sp.mesh.position.x = Math.sin(time * 2 + idx) * 0.025;
        sp.mesh.material.opacity = (1 - cycle) * 0.35;
      });

      // Camera Shake
      if (shakeTime > 0) {
        shakeTime -= delta;
        const progress = Math.max(0, shakeTime / shakeDuration);
        const currentIntensity = shakeIntensity * Math.pow(progress, 2);

        const offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
        const offsetY = (Math.random() - 0.5) * 2 * currentIntensity;

        camera.position.x = offsetX;
        camera.position.y += offsetY;
      } else {
        camera.position.x = 0;
      }
      camera.lookAt(lookTarget);
    },

    render() {
      renderer.render(scene, camera);
    }
  };
}
