import Phaser from 'phaser'
import { PLAYER_SPEED, PLAYER_JUMP_VEL } from '../utils/Constants'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key }
  private isAlive = true

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.setSize(24, 32)
    this.setOffset(4, 0)

    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.wasd = {
      up:    scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left:  scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
  }

  update() {
    if (!this.isAlive) return
    const body = this.body as Phaser.Physics.Arcade.Body
    const onGround = body.blocked.down

    const goLeft  = this.cursors.left.isDown  || this.wasd.left.isDown
    const goRight = this.cursors.right.isDown || this.wasd.right.isDown
    const jump    = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                    Phaser.Input.Keyboard.JustDown(this.wasd.up)    ||
                    Phaser.Input.Keyboard.JustDown(this.cursors.space!)

    if (goLeft) {
      this.setVelocityX(-PLAYER_SPEED)
      this.setFlipX(true)
    } else if (goRight) {
      this.setVelocityX(PLAYER_SPEED)
      this.setFlipX(false)
    } else {
      this.setVelocityX(0)
    }

    if (jump && onGround) {
      this.setVelocityY(PLAYER_JUMP_VEL)
    }
  }

  die() {
    this.isAlive = false
    this.setVelocity(0, -300)
    this.setCollideWorldBounds(false)
    this.scene.time.delayedCall(1500, () => {
      this.scene.scene.start('GameOverScene', { win: false })
    })
  }
}