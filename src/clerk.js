/**
 * clerk.js - Barnaby P. Quibble: Certified Bureaucrat at Window 7.
 * Adorable, highly-polished chibi bureaucrat with smooth peach skin,
 * blushing rosy cheeks, glossy sparkling eyes, cute button nose,
 * sleek wireframe glasses, styled hair, and cute hands resting on the counter.
 */

import * as THREE from 'three';

export function createClerk() {
  const clerkGroup = new THREE.Group();

  // Materials with high quality, smooth shading
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdfd0, // Warm, soft peach skin
    roughness: 0.45,
    metalness: 0.0
  });

  const blushMaterial = new THREE.MeshBasicMaterial({
    color: 0xf29199, // Cute rosy blush cheeks
    transparent: true,
    opacity: 0.65
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e1e18, // Warm dark espresso brown hair
    roughness: 0.55,
    metalness: 0.05
  });

  const suitMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a3342, // Clean navy charcoal suit
    roughness: 0.7,
    metalness: 0.05
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0xfcfbfa, // Crisp white dress shirt
    roughness: 0.5,
    metalness: 0.0
  });

  const tieMaterial = new THREE.MeshStandardMaterial({
    color: 0xc42828, // Bright bureaucratic red tie
    roughness: 0.4,
    metalness: 0.1
  });

  const tieClipMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Gold tie clip
    roughness: 0.25,
    metalness: 0.9
  });

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x141010, // Glossy dark pupil
    roughness: 0.15,
    metalness: 0.1
  });

  const shineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff // Cute eye sparkle
  });

  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: 0x221f1d, // Sleek round glasses frames
    roughness: 0.3,
    metalness: 0.75
  });

  const eyebrowMaterial = new THREE.MeshStandardMaterial({
    color: 0x261914,
    roughness: 0.6
  });

  const mouthMaterial = new THREE.MeshBasicMaterial({
    color: 0x7a3a38 // Sweet dark rose mouth
  });

  // 1. Torso: Neatly fitted chibi suit (Smooth capsule/cylinder)
  const torsoGeo = new THREE.CylinderGeometry(0.48, 0.54, 1.15, 24);
  const torso = new THREE.Mesh(torsoGeo, suitMaterial);
  torso.position.y = 0.55;
  clerkGroup.add(torso);

  // 1b. Crisp White Shirt Inset & Collar
  const shirtFrontGeo = new THREE.BoxGeometry(0.24, 0.52, 0.08);
  const shirtFront = new THREE.Mesh(shirtFrontGeo, shirtMaterial);
  shirtFront.position.set(0, 0.88, 0.46);
  shirtFront.rotation.x = -0.10;
  clerkGroup.add(shirtFront);

  const collarLeftGeo = new THREE.BoxGeometry(0.12, 0.16, 0.05);
  const collarLeft = new THREE.Mesh(collarLeftGeo, shirtMaterial);
  collarLeft.position.set(-0.08, 1.08, 0.47);
  collarLeft.rotation.set(-0.15, 0, -0.35);
  clerkGroup.add(collarLeft);

  const collarRight = collarLeft.clone();
  collarRight.position.x = 0.08;
  collarRight.rotation.z = 0.35;
  clerkGroup.add(collarRight);

  // 1c. Cute Red Tie with Gold Tie Clip
  const tieGeo = new THREE.BoxGeometry(0.085, 0.52, 0.04);
  const tie = new THREE.Mesh(tieGeo, tieMaterial);
  tie.position.set(0, 0.78, 0.51);
  tie.rotation.x = -0.10;
  clerkGroup.add(tie);

  const tieClipGeo = new THREE.BoxGeometry(0.065, 0.022, 0.02);
  const tieClip = new THREE.Mesh(tieClipGeo, tieClipMaterial);
  tieClip.position.set(0.01, 0.78, 0.53);
  clerkGroup.add(tieClip);

  // 2. Head Group (Smooth, expressive chibi head)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.48, 0.04);
  clerkGroup.add(headGroup);

  // 2a. Smooth round peach sphere head
  const headGeo = new THREE.SphereGeometry(0.39, 32, 28);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  headGroup.add(head);

  // 2b. Cute Rosy Cheeks (Blushing discs)
  const cheekGeo = new THREE.SphereGeometry(0.07, 16, 16);
  cheekGeo.scale(1.2, 0.75, 0.25);

  const leftCheek = new THREE.Mesh(cheekGeo, blushMaterial);
  leftCheek.position.set(-0.21, -0.06, 0.33);
  leftCheek.rotation.y = -0.35;
  headGroup.add(leftCheek);

  const rightCheek = new THREE.Mesh(cheekGeo, blushMaterial);
  rightCheek.position.set(0.21, -0.06, 0.33);
  rightCheek.rotation.y = 0.35;
  headGroup.add(rightCheek);

  // 2c. Cute Button Nose
  const noseGeo = new THREE.SphereGeometry(0.042, 16, 12);
  const nose = new THREE.Mesh(noseGeo, skinMaterial);
  nose.scale.set(1.0, 0.85, 1.0);
  nose.position.set(0, -0.02, 0.385);
  headGroup.add(nose);

  // 2d. Cute Smooth Styled Hair Cap & Side-Part Bangs
  const hairCapGeo = new THREE.SphereGeometry(0.405, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMaterial);
  hairCap.position.set(0, 0.02, -0.02);
  hairCap.rotation.x = -0.22;
  headGroup.add(hairCap);

  // Soft curved front bangs hugging the forehead
  const bangsGeo = new THREE.SphereGeometry(0.395, 24, 16, 0, Math.PI * 0.9, 0, Math.PI * 0.28);
  const bangs = new THREE.Mesh(bangsGeo, hairMaterial);
  bangs.rotation.set(0.65, -0.15, 0.1);
  bangs.position.set(0, 0.12, 0.08);
  headGroup.add(bangs);

  // Cute sideburns
  const sideburnGeo = new THREE.BoxGeometry(0.04, 0.16, 0.08);
  const leftSideburn = new THREE.Mesh(sideburnGeo, hairMaterial);
  leftSideburn.position.set(-0.38, 0.08, 0.06);
  headGroup.add(leftSideburn);

  const rightSideburn = leftSideburn.clone();
  rightSideburn.position.x = 0.38;
  headGroup.add(rightSideburn);

  // 2e. Cute Rounded Ears
  const earGeo = new THREE.SphereGeometry(0.08, 16, 12);
  const leftEar = new THREE.Mesh(earGeo, skinMaterial);
  leftEar.scale.set(0.45, 1.1, 0.85);
  leftEar.position.set(-0.39, 0.02, 0.0);
  headGroup.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.x = 0.39;
  headGroup.add(rightEar);

  // 2f. Adorable Eyes with Cute Sparkle Highlights
  const eyeGroup = new THREE.Group();
  headGroup.add(eyeGroup);

  const eyeGeo = new THREE.SphereGeometry(0.052, 18, 14);

  // Left Eye
  const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  leftEye.position.set(-0.13, 0.06, 0.355);
  eyeGroup.add(leftEye);

  const shineGeo = new THREE.SphereGeometry(0.016, 10, 10);
  const leftShine = new THREE.Mesh(shineGeo, shineMaterial);
  leftShine.position.set(-0.115, 0.085, 0.395);
  eyeGroup.add(leftShine);

  // Right Eye
  const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  rightEye.position.set(0.13, 0.06, 0.355);
  eyeGroup.add(rightEye);

  const rightShine = new THREE.Mesh(shineGeo, shineMaterial);
  rightShine.position.set(0.145, 0.085, 0.395);
  eyeGroup.add(rightShine);

  // 2g. Expressive Curved Eyebrows
  const eyebrowGeo = new THREE.BoxGeometry(0.11, 0.018, 0.025);

  const leftEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMaterial);
  leftEyebrow.position.set(-0.13, 0.175, 0.37);
  headGroup.add(leftEyebrow);

  const rightEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMaterial);
  rightEyebrow.position.set(0.13, 0.175, 0.37);
  headGroup.add(rightEyebrow);

  // 2h. Round Wireframe Glasses
  const glassesRingGeo = new THREE.TorusGeometry(0.088, 0.011, 14, 28);

  const leftGlass = new THREE.Mesh(glassesRingGeo, glassesMaterial);
  leftGlass.position.set(-0.13, 0.06, 0.385);
  headGroup.add(leftGlass);

  const rightGlass = new THREE.Mesh(glassesRingGeo, glassesMaterial);
  rightGlass.position.set(0.13, 0.06, 0.385);
  headGroup.add(rightGlass);

  const bridgeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.09, 8);
  const bridge = new THREE.Mesh(bridgeGeo, glassesMaterial);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.065, 0.395);
  headGroup.add(bridge);

  // 2i. Sweet Little Mouth
  const mouthGeo = new THREE.BoxGeometry(0.09, 0.016, 0.02);
  const mouth = new THREE.Mesh(mouthGeo, mouthMaterial);
  mouth.position.set(0, -0.13, 0.37);
  headGroup.add(mouth);

  // 3. Cute Chibi Arms & Hands Resting on Desk Counter
  // Shoulders attach smoothly at upper torso
  const shoulderGeo = new THREE.SphereGeometry(0.13, 16, 12);
  const leftShoulderMesh = new THREE.Mesh(shoulderGeo, suitMaterial);
  leftShoulderMesh.position.set(-0.46, 0.96, 0.08);
  clerkGroup.add(leftShoulderMesh);

  const rightShoulderMesh = new THREE.Mesh(shoulderGeo, suitMaterial);
  rightShoulderMesh.position.set(0.46, 0.96, 0.08);
  clerkGroup.add(rightShoulderMesh);

  // Left Arm (Rests calmly on counter near mug)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.46, 0.96, 0.08);

  const sleeveGeo = new THREE.CylinderGeometry(0.10, 0.09, 0.44, 16);
  const leftSleeve = new THREE.Mesh(sleeveGeo, suitMaterial);
  leftSleeve.position.set(0, -0.18, 0.12);
  leftSleeve.rotation.set(-0.65, 0, 0.25);
  leftArmGroup.add(leftSleeve);

  // White cuff
  const cuffGeo = new THREE.CylinderGeometry(0.092, 0.095, 0.06, 16);
  const leftCuff = new THREE.Mesh(cuffGeo, shirtMaterial);
  leftCuff.position.set(0.06, -0.36, 0.24);
  leftCuff.rotation.set(-0.65, 0, 0.25);
  leftArmGroup.add(leftCuff);

  // Cute Rounded Hand resting flat on the counter edge
  const handGeo = new THREE.SphereGeometry(0.075, 16, 12);
  handGeo.scale(1.1, 0.65, 1.2);
  const leftHand = new THREE.Mesh(handGeo, skinMaterial);
  leftHand.position.set(0.09, -0.39, 0.31);
  leftArmGroup.add(leftHand);

  clerkGroup.add(leftArmGroup);

  // Right Arm (Rests on counter, articulates during stamp slamming)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.46, 0.96, 0.08);

  const rightSleeve = new THREE.Mesh(sleeveGeo, suitMaterial);
  rightSleeve.position.set(0, -0.18, 0.12);
  rightSleeve.rotation.set(-0.65, 0, -0.25);
  rightArmGroup.add(rightSleeve);

  const rightCuff = new THREE.Mesh(cuffGeo, shirtMaterial);
  rightCuff.position.set(-0.06, -0.36, 0.24);
  rightCuff.rotation.set(-0.65, 0, -0.25);
  rightArmGroup.add(rightCuff);

  const rightHand = new THREE.Mesh(handGeo, skinMaterial);
  rightHand.position.set(-0.09, -0.39, 0.31);
  rightArmGroup.add(rightHand);

  clerkGroup.add(rightArmGroup);

  // Position Barnaby BEHIND the desk counter:
  // Desk counter top is at z = 0.35 with back edge at z = -0.35.
  // Barnaby stands behind at z = -0.48.
  clerkGroup.position.set(0, -0.42, -0.48);

  const baseTorsoY = torso.position.y;
  let blinkTimer = 2.5;

  return {
    mesh: clerkGroup,
    head: headGroup,
    torso,
    rightArmGroup,
    leftArmGroup,
    leftEyebrow,
    rightEyebrow,
    eyeGroup,
    mouth,

    /**
     * Gentle breathing, subtle head sway, natural eye blinking, and resting hands.
     */
    updateIdle(time) {
      const bob = Math.sin(time * 2.2) * 0.022;
      torso.position.y = baseTorsoY + bob;
      headGroup.position.y = 1.48 + bob;

      // Gentle head sway
      headGroup.rotation.y = Math.sin(time * 1.3) * 0.04;
      headGroup.rotation.x = Math.sin(time * 0.9) * 0.02 + 0.03;
      headGroup.rotation.z = Math.cos(time * 1.6) * 0.015;

      // Eyebrows neutral and friendly
      leftEyebrow.position.y = 0.175;
      rightEyebrow.position.y = 0.175;
      leftEyebrow.rotation.z = 0.04;
      rightEyebrow.rotation.z = -0.04;

      // Mouth neutral
      mouth.scale.set(1, 1, 1);

      // Arms resting cleanly on counter with breathing compensation
      rightArmGroup.position.set(0.46, 0.96 + bob * 0.5, 0.08);
      rightArmGroup.rotation.set(0, 0, 0);

      leftArmGroup.position.set(-0.46, 0.96 + bob * 0.5, 0.08);
      leftArmGroup.rotation.set(0, 0, 0);

      // Natural eye blinking
      blinkTimer -= 0.016;
      if (blinkTimer <= 0) {
        eyeGroup.scale.y = 0.1;
        if (blinkTimer < -0.14) {
          eyeGroup.scale.y = 1.0;
          blinkTimer = 3.2 + Math.random() * 2.5;
        }
      } else {
        eyeGroup.scale.y = 1.0;
      }
    },

    /**
     * Shakes head in disapproval while reading complaint; eyebrows furrowed.
     */
    setDisapproval(time, t) {
      headGroup.rotation.x = 0.32;
      headGroup.rotation.y = Math.sin(time * 8.5) * 0.22;
      headGroup.rotation.z = Math.sin(time * 4.2) * 0.03;

      // Skeptical furrowed eyebrows
      leftEyebrow.position.y = 0.15;
      rightEyebrow.position.y = 0.15;
      leftEyebrow.rotation.z = -0.22;
      rightEyebrow.rotation.z = 0.22;

      // Mouth mutters
      const talkMod = Math.abs(Math.sin(time * 14)) * 0.7;
      mouth.scale.set(1 - talkMod * 0.2, 1 + talkMod * 1.4, 1);

      // Right arm reaches up towards stamp
      rightArmGroup.position.set(0.38, 1.05, 0.24);
      rightArmGroup.rotation.set(0.3, -0.2, -0.2);
    },

    /**
     * Right arm tracks stamp handle and drives down during slam
     */
    setStampingArm(stampPos, isImpact) {
      // Right arm tracks stamp motion
      const lift = Math.max(0, (stampPos.y - 0.2) / 1.2);
      rightArmGroup.position.x = 0.32 + stampPos.x * 0.2;
      rightArmGroup.position.y = 0.85 + lift * 0.45;
      rightArmGroup.position.z = 0.20 + lift * 0.15;
      rightArmGroup.rotation.set(lift * 0.4, -0.2, -0.2 - lift * 0.2);

      if (isImpact) {
        torso.position.y = baseTorsoY - 0.04;
        headGroup.rotation.x = 0.38;
      }
    },

    /**
     * Deadpan nod when delivering outcome line
     */
    setNod(t) {
      const nod = Math.sin(t * Math.PI) * 0.22;
      headGroup.rotation.x = 0.03 + nod;
      headGroup.rotation.y = 0;
      headGroup.rotation.z = 0;

      // Eyebrows arch slightly in official approval
      leftEyebrow.position.y = 0.19;
      rightEyebrow.position.y = 0.19;
      leftEyebrow.rotation.z = 0.06;
      rightEyebrow.rotation.z = -0.06;

      mouth.scale.set(1, 1, 1);
    },

    /**
     * Quick annoyed head shake for empty input
     */
    setAnnoyedShake(t) {
      const decay = 1 - t;
      headGroup.rotation.y = Math.sin(t * Math.PI * 5) * 0.22 * decay;
      headGroup.rotation.x = 0.10 * Math.sin(t * Math.PI);

      leftEyebrow.position.y = 0.21;
      rightEyebrow.position.y = 0.14;
    },

    /**
     * Startled reaction when citizen rings the service bell
     */
    setStartled(t) {
      const jump = Math.sin(t * Math.PI) * 0.14;
      headGroup.position.y = 1.48 + jump;
      torso.position.y = baseTorsoY + jump * 0.5;

      // Wide open eyes & surprised eyebrows
      eyeGroup.scale.set(1.25, 1.25, 1.25);
      leftEyebrow.position.y = 0.23;
      rightEyebrow.position.y = 0.23;
      leftEyebrow.rotation.z = 0.20;
      rightEyebrow.rotation.z = -0.20;

      headGroup.rotation.y = THREE.MathUtils.lerp(0, 0.32, Math.sin(t * Math.PI));
      headGroup.rotation.x = -0.08;
    },

    /**
     * Coffee sip reaction
     */
    setSipCoffee(t) {
      headGroup.rotation.x = Math.sin(t * Math.PI) * 0.28;
      headGroup.rotation.y = Math.sin(t * Math.PI) * -0.20;

      leftArmGroup.position.y = 0.96 + Math.sin(t * Math.PI) * 0.12;

      if (t > 0.3 && t < 0.7) {
        eyeGroup.scale.y = 0.15;
        mouth.scale.set(0.6, 2.0, 1);
      } else {
        eyeGroup.scale.y = 1.0;
        mouth.scale.set(1, 1, 1);
      }
    },

    /**
     * Poke reaction when citizen taps Barnaby
     */
    setPokeReaction(t) {
      const wobble = Math.sin(t * Math.PI * 4) * 0.12 * (1 - t);
      headGroup.rotation.z = wobble;
      headGroup.rotation.x = -0.14 * Math.sin(t * Math.PI);
      torso.position.z = -0.48 - 0.08 * Math.sin(t * Math.PI);

      leftEyebrow.position.y = 0.21;
      rightEyebrow.position.y = 0.15;
    }
  };
}
