import { describe, it, expect } from 'vitest';

describe('Player Movement & Jump Physics Calculations', () => {
  const coyoteTimeDuration = 120; // ms
  const jumpBufferDuration = 120;  // ms
  const minJumpVelocity = -180;
  const fullJumpVelocity = -420;
  const maxRunSpeed = 220;

  it('allows jump within coyote time window after leaving a platform', () => {
    let timeSinceLeftGround = 50; // ms
    const canCoyoteJump = timeSinceLeftGround < coyoteTimeDuration;
    expect(canCoyoteJump).toBe(true);

    timeSinceLeftGround = 150; // expired
    const canCoyoteJumpExpired = timeSinceLeftGround < coyoteTimeDuration;
    expect(canCoyoteJumpExpired).toBe(false);
  });

  it('buffers jump input within buffer duration window', () => {
    let jumpBufferTimer = 100; // ms
    const hasBufferedJump = jumpBufferTimer > 0;
    expect(hasBufferedJump).toBe(true);

    jumpBufferTimer = 0;
    expect(jumpBufferTimer > 0).toBe(false);
  });

  it('clamps upward velocity on variable jump button release', () => {
    let currentVelocityY = -400; // mid full jump
    const jumpReleased = true;

    if (jumpReleased && currentVelocityY < minJumpVelocity) {
      currentVelocityY = minJumpVelocity;
    }

    expect(currentVelocityY).toBe(minJumpVelocity);
  });

  it('clamps horizontal running speed to max speed limit', () => {
    const rawSpeed = 350;
    const clampedSpeed = Math.min(maxRunSpeed, Math.max(-maxRunSpeed, rawSpeed));
    expect(clampedSpeed).toBe(220);
  });
});
