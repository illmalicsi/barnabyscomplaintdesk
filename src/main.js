/**
 * main.js - Application entry point.
 * Coordinates Barnaby, 3D scene, paper, stamp, audio effects, interactive props,
 * desk actions (Bell, Coffee, Random Complaint, Shred, Download), and filing timeline.
 */

import { initScene } from './scene.js';
import { createClerk } from './clerk.js';
import { createPaper } from './paper.js';
import { createStamp } from './stamp.js';
import { initUI } from './ui.js';
import {
  getRandomOutcome,
  getRandomMutterLine,
  getRandomEmptyResponse,
  getRandomBellResponse,
  getRandomCoffeeResponse,
  getRandomPokeResponse,
  getRandomShredResponse,
  getRandomComplaint
} from './outcomes.js';
import {
  playBellDing,
  playStampSlam,
  playPaperSlide,
  playCoffeeSip,
  playPaperShred
} from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');

  // Animation States
  let filingState = null;
  let actionState = null; // { type: 'bell' | 'coffee' | 'poke' | 'shred', elapsed: 0, duration: 1.0 }
  let annoyedShakeTimer = 0;
  let currentGrievanceText = '';

  // 1. Initialize UI Controller
  let sceneController = null;
  let clerk = null;
  let paper = null;
  let stamp = null;

  const ui = initUI({
    onSubmit: handleComplaintSubmit,
    onThemeChange: () => {
      if (sceneController) {
        sceneController.syncThemeBackground();
      }
    },
    onBellRing: handleBellAction,
    onCoffeeSip: handleCoffeeAction,
    onRandomComplaint: () => getRandomComplaint(),
    onShred: handleShredAction,
    onDownloadSlip: handleDownloadSlip
  });

  // 2. Initialize 3D Scene with Raycasting Click Handler
  sceneController = initScene(canvas, {
    onObjectClick: (type) => {
      if (filingState) return; // Don't interrupt active filing timeline

      if (type === 'bell') {
        handleBellAction();
      } else if (type === 'coffee') {
        handleCoffeeAction();
      } else if (type === 'clerk') {
        handleClerkPoke();
      }
    }
  });

  if (!sceneController) {
    ui.showFallback();
    return;
  }

  const { scene, triggerCameraShake, triggerBellPress, registerClickable } = sceneController;

  // 3. Create 3D Scene Objects
  clerk = createClerk();
  scene.add(clerk.mesh);
  registerClickable(clerk.mesh, 'clerk');

  paper = createPaper();
  scene.add(paper.mesh);

  stamp = createStamp();
  scene.add(stamp.mesh);

  // Initial welcome line from Barnaby
  setTimeout(() => {
    ui.showSpeechBubble("Window 7 is open. I am Barnaby. Please state your grievance in 140 characters or fewer.", 4600);
  }, 600);

  // 4. Action Handlers

  function handleBellAction() {
    if (filingState) return;

    playBellDing();
    triggerBellPress();

    actionState = {
      type: 'bell',
      elapsed: 0,
      duration: 1.1
    };

    const quote = getRandomBellResponse();
    ui.showSpeechBubble(quote, 3200);
  }

  function handleCoffeeAction() {
    if (filingState) return;

    playCoffeeSip();

    actionState = {
      type: 'coffee',
      elapsed: 0,
      duration: 1.6
    };

    const quote = getRandomCoffeeResponse();
    ui.showSpeechBubble(quote, 3600);
  }

  function handleClerkPoke() {
    if (filingState) return;

    actionState = {
      type: 'poke',
      elapsed: 0,
      duration: 0.9
    };

    const quote = getRandomPokeResponse();
    ui.showSpeechBubble(quote, 3200);
  }

  function handleShredAction() {
    if (filingState) return;

    const currentText = ui.getComplaintText();
    paper.updateContent(currentText || 'Voluntary shredding protocol', null);
    paper.mesh.position.copy(paper.centerPos);

    playPaperShred();

    actionState = {
      type: 'shred',
      elapsed: 0,
      duration: 1.2
    };

    const quote = getRandomShredResponse();
    ui.showSpeechBubble(quote, 3400);

    setTimeout(() => {
      ui.clearInput();
      paper.resetToRight();
    }, 1100);
  }

  function handleDownloadSlip() {
    try {
      const dataUrl = paper.exportDataURL();
      const link = document.createElement('a');
      link.download = `Barnaby-Window7-Grievance-Slip-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Slip export error:', e);
    }
  }

  /**
   * Handle user submitting a complaint
   */
  function handleComplaintSubmit(text) {
    // Check for empty complaint
    if (!text) {
      const emptyMsg = getRandomEmptyResponse();
      ui.triggerInputError(emptyMsg);
      annoyedShakeTimer = 0.65;
      return;
    }

    currentGrievanceText = text;

    // Lock UI during filing timeline
    ui.setSubmitting(true);

    const outcome = getRandomOutcome();
    const mutterLine = getRandomMutterLine();

    // Prepare paper canvas with user's complaint text
    paper.updateContent(text, null);
    paper.resetToRight();

    playPaperSlide();

    // Reset any temporary actions
    actionState = null;

    // Filing Timeline
    filingState = {
      elapsed: 0,
      text,
      outcome,
      mutterLine,
      impactTriggered: false,
      nodTriggered: false
    };
  }

  // 5. Main Animation Loop
  let lastTime = performance.now();

  function animate(currentTime) {
    requestAnimationFrame(animate);

    const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;
    const timeSec = currentTime / 1000;

    // 5a. Active Filing Timeline
    if (filingState) {
      filingState.elapsed += delta;
      const t = filingState.elapsed;

      // Segment 1: Paper slides in from right (0.0s -> 0.75s)
      if (t <= 0.75) {
        const segT = t / 0.75;
        paper.setSlideIn(segT);
        clerk.updateIdle(timeSec);
      }
      // Segment 2: Barnaby inspects paper, shakes head, mutters, right arm reaches for stamp (0.75s -> 2.15s)
      else if (t <= 2.15) {
        paper.setSlideIn(1.0);
        clerk.setDisapproval(timeSec, (t - 0.75) / 1.4);

        if (t > 0.85 && t < 1.0) {
          ui.showSpeechBubble(filingState.mutterLine, 2200);
        }

        // Stamp hovers into position above paper
        if (t >= 1.4) {
          const hoverT = Math.min(1.0, (t - 1.4) / 0.6);
          const ease = 1 - Math.pow(1 - hoverT, 2);
          stamp.mesh.position.lerpVectors(stamp.posParked, stamp.posHover, ease);
          clerk.setStampingArm(stamp.mesh.position, false);
        }
      }
      // Segment 3: Stamp accelerates and slams down (2.15s -> 2.55s)
      else if (t <= 2.55) {
        clerk.setDisapproval(timeSec, 1.0);
        const stampT = (t - 2.15) / 0.40;
        stamp.setDescent(stampT);
        clerk.setStampingArm(stamp.mesh.position, stampT > 0.9);
      }

      // Exact Impact Moment (at t = 2.55s)
      if (t >= 2.55 && !filingState.impactTriggered) {
        filingState.impactTriggered = true;

        // Heavy stamp impact audio
        playStampSlam();

        // Camera shake with solid thud
        triggerCameraShake(0.14, 0.35);

        // Redraw paper with official tilted stamp
        paper.updateContent(filingState.text, filingState.outcome);

        // Generate 5-digit ticket number
        const ticketNum = Math.floor(10000 + Math.random() * 90000);
        ui.updateTicketCard(ticketNum, filingState.outcome, filingState.text);
        ui.incrementCounter();

        // Barnaby delivers official line
        ui.showSpeechBubble(filingState.outcome.clerkLine, 4500);
      }

      // Segment 4: Barnaby nods, stamp rises up with elastic spring (2.55s -> 3.55s)
      if (t > 2.55 && t <= 3.55) {
        const nodT = (t - 2.55) / 1.0;
        clerk.setNod(nodT);

        const riseT = (t - 2.55) / 0.85;
        if (riseT <= 1.0) {
          stamp.setRise(riseT);
          clerk.setStampingArm(stamp.mesh.position, false);
        }
      }
      // Segment 5: Paper slides off to left, stamp returns to desk, paper slide audio (3.55s -> 4.35s)
      else if (t > 3.55 && t <= 4.35) {
        if (t < 3.65) playPaperSlide();

        const slideT = (t - 3.55) / 0.80;
        paper.setSlideOut(slideT);
        stamp.setRetract(slideT);
        clerk.updateIdle(timeSec);
      }
      // Segment 6: Timeline complete (> 4.35s)
      else if (t > 4.35) {
        paper.resetToRight();
        stamp.resetToParked();
        ui.clearInput();
        ui.setSubmitting(false);
        filingState = null;
      }
    }
    // 5b. Temporary Character Actions (Bell, Coffee, Poke, Shred)
    else if (actionState) {
      actionState.elapsed += delta;
      const progress = Math.min(1.0, actionState.elapsed / actionState.duration);

      if (actionState.type === 'bell') {
        clerk.setStartled(progress);
      } else if (actionState.type === 'coffee') {
        clerk.setSipCoffee(progress);
      } else if (actionState.type === 'poke') {
        clerk.setPokeReaction(progress);
      } else if (actionState.type === 'shred') {
        paper.setShred(progress);
        clerk.updateIdle(timeSec);
      }

      if (progress >= 1.0) {
        actionState = null;
      }
    }
    // 5c. Annoyed Head Shake (Empty Input)
    else if (annoyedShakeTimer > 0) {
      annoyedShakeTimer -= delta;
      clerk.setAnnoyedShake(1 - (annoyedShakeTimer / 0.65));
    }
    // 5d. Normal Idle State
    else {
      clerk.updateIdle(timeSec);
    }

    // Update scene props, camera, & render
    sceneController.update(delta, timeSec);
    sceneController.render();
  }

  requestAnimationFrame(animate);
});
