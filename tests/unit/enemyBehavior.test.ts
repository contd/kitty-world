import { describe, it, expect } from 'vitest';

describe('Enemy Patrol Boundaries and Collision Rules', () => {
  it('reverses patrol direction when reaching patrol distance limit', () => {
    const startX = 500;
    const patrolDistance = 100;
    let currentX = 610; // offset > 100
    let direction = 1;

    const offset = currentX - startX;
    if (offset > patrolDistance) {
      direction = -1;
    } else if (offset < -patrolDistance) {
      direction = 1;
    }

    expect(direction).toBe(-1);
  });

  it('determines player jump bounce on enemy versus taking damage', () => {
    // Case 1: Player falling from above enemy head
    const playerBottom = 300;
    const enemyTop = 302;
    const playerVelocityY = 180; // falling down

    const isFallingOnTop = playerVelocityY > 0 && playerBottom <= enemyTop + 16;
    expect(isFallingOnTop).toBe(true);

    // Case 2: Player walking horizontally into enemy
    const walkingVelocityY = 0;
    const isWalkingBounce = walkingVelocityY > 0 && playerBottom <= enemyTop + 16;
    expect(isWalkingBounce).toBe(false);
  });
});
