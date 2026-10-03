/**
 * stamp.js - Large official government stamp with authentic wood, brass collar,
 * rubber bottom, and dynamic physics squash & recoil.
 */

import * as THREE from 'three';

export function createStamp() {
  const stampGroup = new THREE.Group();

  // Materials with flat shading
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x54280e, // Rich dark mahogany wood
    roughness: 0.65,
    metalness: 0.1,
    flatShading: true
  });

  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0x7a3d18, // Polished cherry wood block
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true
  });

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Polished brass metal collar
    roughness: 0.35,
    metalness: 0.75,
    flatShading: true
  });

  const rubberBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1818, // Charcoal rubber ink pad
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true
  });

  // 1. Rubber ink pad base (Bottom)
  const baseGeo = new THREE.BoxGeometry(0.85, 0.05, 0.45);
  const baseMesh = new THREE.Mesh(baseGeo, rubberBaseMaterial);
  baseMesh.position.y = 0.025;
  stampGroup.add(baseMesh);

  // 2. Wooden mounting block
  const blockGeo = new THREE.BoxGeometry(0.8, 0.14, 0.4);
  const blockMesh = new THREE.Mesh(blockGeo, blockMaterial);
  blockMesh.position.y = 0.12;
  stampGroup.add(blockMesh);

  // 3. Brass collar
  const collarGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.06, 12);
  const collarMesh = new THREE.Mesh(collarGeo, brassMaterial);
  collarMesh.position.y = 0.22;
  stampGroup.add(collarMesh);

  // 4. Wooden handle (tapered cylinder)
  const handleGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.45, 12);
  const handleMesh = new THREE.Mesh(handleGeo, woodMaterial);
  handleMesh.position.y = 0.475;
  stampGroup.add(handleMesh);

  // 5. Wooden knob (Sphere on top)
  const knobGeo = new THREE.SphereGeometry(0.12, 12, 10);
  const knobMesh = new THREE.Mesh(knobGeo, woodMaterial);
  knobMesh.position.y = 0.74;
  knobMesh.scale.set(1, 0.9, 1);
  stampGroup.add(knobMesh);

  // Align rotation to match tilted paper on desk
  stampGroup.rotation.x = 0.22;

  // Key positions aligned with paper (z = 0.45) and ink pad (z = 0.55)
  const posParked = new THREE.Vector3(1.25, 0.22, 0.55); // Resting on ink pad
  const posHover = new THREE.Vector3(0, 1.45, 0.45);      // Raised high above paper
  const posImpact = new THREE.Vector3(0, 0.15, 0.45);     // Slammed down onto paper

  stampGroup.position.copy(posParked);

  return {
    mesh: stampGroup,
    posParked,
    posHover,
    posImpact,

    setHoverPosition() {
      stampGroup.position.copy(posHover);
      stampGroup.scale.set(1, 1, 1);
    },

    setDescent(t) {
      // Powerful cubic acceleration
      const ease = t * t * t;
      stampGroup.position.lerpVectors(posHover, posImpact, ease);

      // Anticipation & squash
      if (t > 0.90) {
        const squashProgress = (t - 0.90) / 0.10;
        const squash = Math.sin(squashProgress * Math.PI) * 0.18;
        stampGroup.scale.set(1 + squash * 0.6, 1 - squash, 1 + squash * 0.6);
      } else {
        stampGroup.scale.set(1, 1, 1);
      }
    },

    setRise(t) {
      // Ease out elastic bounce
      const ease = 1 - Math.pow(1 - t, 3);
      stampGroup.position.lerpVectors(posImpact, posHover, ease);

      // Rebound spring
      if (t < 0.25) {
        const spring = Math.sin((t / 0.25) * Math.PI) * 0.08;
        stampGroup.scale.set(1 - spring, 1 + spring, 1 - spring);
      } else {
        stampGroup.scale.set(1, 1, 1);
      }
    },

    setRetract(t) {
      // Move from hover back to parked position on desk
      const ease = 1 - Math.pow(1 - t, 2);
      stampGroup.position.lerpVectors(posHover, posParked, ease);
      stampGroup.scale.set(1, 1, 1);
    },

    resetToParked() {
      stampGroup.position.copy(posParked);
      stampGroup.scale.set(1, 1, 1);
    }
  };
}
