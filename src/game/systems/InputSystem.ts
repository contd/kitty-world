import Phaser from 'phaser';

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jumpPressed: boolean;   // Triggered on keydown
  jumpHeld: boolean;      // Continuous hold for variable jump height
  jumpReleased: boolean;  // Triggered on keyup
  actionPressed: boolean; // Emote / Meow
  pausePressed: boolean;
}

export class InputSystem {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private escapeKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;

  // External mobile / touch input flags (set by UI buttons)
  private touchLeft = false;
  private touchRight = false;
  private touchJumpHeld = false;
  private touchJumpPressedTrigger = false;
  private touchJumpReleasedTrigger = false;
  private touchActionTrigger = false;
  private touchPauseTrigger = false;

  // Gamepad cache
  private hasGamepad = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeyboard();
    this.setupGamepad();
  }

  private setupKeyboard(): void {
    if (!this.scene.input.keyboard) return;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasdKeys = this.scene.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as any;

    this.escapeKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  private setupGamepad(): void {
    if (typeof window !== 'undefined' && 'getGamepads' in navigator) {
      window.addEventListener('gamepadconnected', () => {
        this.hasGamepad = true;
      });
      window.addEventListener('gamepaddisconnected', () => {
        this.hasGamepad = false;
      });
    }
  }

  // Mobile / Touch bridge methods
  setTouchLeft(active: boolean): void {
    this.touchLeft = active;
  }

  setTouchRight(active: boolean): void {
    this.touchRight = active;
  }

  setTouchJump(pressed: boolean): void {
    if (pressed && !this.touchJumpHeld) {
      this.touchJumpPressedTrigger = true;
    }
    if (!pressed && this.touchJumpHeld) {
      this.touchJumpReleasedTrigger = true;
    }
    this.touchJumpHeld = pressed;
  }

  triggerTouchAction(): void {
    this.touchActionTrigger = true;
  }

  triggerTouchPause(): void {
    this.touchPauseTrigger = true;
  }

  poll(): InputState {
    // 1. Keyboard polling
    const kLeft = Boolean(this.cursors?.left?.isDown || this.wasdKeys?.a?.isDown);
    const kRight = Boolean(this.cursors?.right?.isDown || this.wasdKeys?.d?.isDown);
    const kUp = Boolean(this.cursors?.up?.isDown || this.wasdKeys?.w?.isDown);
    const kDown = Boolean(this.cursors?.down?.isDown || this.wasdKeys?.s?.isDown);

    const kJumpPressed = Boolean(
      Phaser.Input.Keyboard.JustDown(this.cursors?.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasdKeys?.w) ||
      Phaser.Input.Keyboard.JustDown(this.wasdKeys?.space)
    );

    const kJumpHeld = Boolean(
      this.cursors?.up?.isDown ||
      this.wasdKeys?.w?.isDown ||
      this.wasdKeys?.space?.isDown
    );

    const kJumpReleased = Boolean(
      Phaser.Input.Keyboard.JustUp(this.cursors?.up) ||
      Phaser.Input.Keyboard.JustUp(this.wasdKeys?.w) ||
      Phaser.Input.Keyboard.JustUp(this.wasdKeys?.space)
    );

    const kActionPressed = Boolean(Phaser.Input.Keyboard.JustDown(this.eKey));
    const kPausePressed = Boolean(Phaser.Input.Keyboard.JustDown(this.escapeKey));

    // 2. Gamepad polling
    let gpLeft = false;
    let gpRight = false;
    let gpJumpPressed = false;
    let gpJumpHeld = false;
    let gpPausePressed = false;

    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const pad = gamepads[0];
      if (pad) {
        // D-Pad or Left Stick
        gpLeft = pad.axes[0] < -0.3 || Boolean(pad.buttons[14]?.pressed);
        gpRight = pad.axes[0] > 0.3 || Boolean(pad.buttons[15]?.pressed);
        // A Button (button 0)
        gpJumpHeld = Boolean(pad.buttons[0]?.pressed);
        // Start button (button 9)
        gpPausePressed = Boolean(pad.buttons[9]?.pressed);
      }
    }

    // 3. Merge all sources
    const left = kLeft || this.touchLeft || gpLeft;
    const right = kRight || this.touchRight || gpRight;
    const up = kUp;
    const down = kDown;

    const jumpPressed = kJumpPressed || this.touchJumpPressedTrigger || gpJumpPressed;
    const jumpHeld = kJumpHeld || this.touchJumpHeld || gpJumpHeld;
    const jumpReleased = kJumpReleased || this.touchJumpReleasedTrigger;
    const actionPressed = kActionPressed || this.touchActionTrigger;
    const pausePressed = kPausePressed || this.touchPauseTrigger || gpPausePressed;

    // Reset single-frame triggers
    this.touchJumpPressedTrigger = false;
    this.touchJumpReleasedTrigger = false;
    this.touchActionTrigger = false;
    this.touchPauseTrigger = false;

    return {
      left,
      right,
      up,
      down,
      jumpPressed,
      jumpHeld,
      jumpReleased,
      actionPressed,
      pausePressed,
    };
  }
}
