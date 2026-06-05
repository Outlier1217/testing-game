import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private coins!: Phaser.Physics.Arcade.StaticGroup
  private enemies!: Phaser.Physics.Arcade.Group
  private score = 0
  private lives = 3

  constructor() { super({ key: 'GameScene' }) }

  create() {
    // Sky background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 4, GAME_HEIGHT, 0x5c94fc)

    // World bounds wider than screen for scrolling
    this.physics.world.setBounds(0, 0, GAME_WIDTH * 3, GAME_HEIGHT)
    this.cameras.main.setBounds(0, 0, GAME_WIDTH * 3, GAME_HEIGHT)

    this.buildLevel()

    this.player = new Player(this, 100, 300)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Collisions
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.enemies, this.platforms)

    this.physics.add.overlap(this.player, this.coins, (_, coin) => {
      (coin as Phaser.Physics.Arcade.Sprite).destroy()
      this.score += 100
      this.events.emit('scoreUpdate', this.score)
    })

    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      const playerBody = (player as Player).body as Phaser.Physics.Arcade.Body
      if (playerBody.velocity.y > 0 &&
          (player as Player).y < (enemy as Phaser.Physics.Arcade.Sprite).y) {
        // Stomp enemy
        (enemy as Phaser.Physics.Arcade.Sprite).destroy()
        this.score += 200
        this.events.emit('scoreUpdate', this.score)
        ;(player as Player).setVelocityY(-250)
      } else {
        this.lives--
        this.events.emit('livesUpdate', this.lives)
        if (this.lives <= 0) {
          (player as Player).die()
        } else {
          this.player.setPosition(100, 300)
        }
      }
    })
  }

  private buildLevel() {
    this.platforms = this.physics.add.staticGroup()
    this.coins     = this.physics.add.staticGroup()
    this.enemies   = this.physics.add.group()

    const TILE = 32
    const W = GAME_WIDTH * 3

    // Ground — full width
    for (let x = 0; x < W; x += TILE) {
      const g = this.add.rectangle(x + TILE / 2, GAME_HEIGHT - TILE / 2, TILE, TILE, 0x8b4513)
      this.platforms.add(g)
      // Grass top
      const grass = this.add.rectangle(x + TILE / 2, GAME_HEIGHT - TILE - 4, TILE, 8, 0x3cb043)
      this.platforms.add(grass)
    }

    // Platforms
    const platDefs = [
      { x: 300, y: 280, count: 3 },
      { x: 550, y: 220, count: 2 },
      { x: 800, y: 300, count: 4 },
      { x: 1100, y: 200, count: 3 },
      { x: 1400, y: 280, count: 2 },
      { x: 1700, y: 220, count: 5 },
      { x: 2000, y: 260, count: 3 },
      { x: 2300, y: 180, count: 4 },
    ]

    for (const p of platDefs) {
      for (let i = 0; i < p.count; i++) {
        const plat = this.add.rectangle(p.x + i * TILE + TILE / 2, p.y, TILE, TILE, 0xe8b14c)
        this.platforms.add(plat)
        // Coin on top of platform
        if (i === Math.floor(p.count / 2)) {
          const coin = this.add.circle(p.x + i * TILE + TILE / 2, p.y - TILE, 10, 0xffd700)
          this.coins.add(coin as unknown as Phaser.GameObjects.GameObject)
        }
      }
    }

    // Ground coins
    for (let cx = 200; cx < W - 200; cx += 150) {
      const coin = this.add.circle(cx, GAME_HEIGHT - TILE - 30, 10, 0xffd700)
      this.coins.add(coin as unknown as Phaser.GameObjects.GameObject)
    }

    // Enemies (simple goomba-style squares)
    const enemyPositions = [400, 700, 1000, 1300, 1600, 1900, 2200]
    for (const ex of enemyPositions) {
      const e = this.physics.add.sprite(ex, GAME_HEIGHT - TILE - 20, 'enemy')
      e.setTint(0xcc3300)
      e.setVelocityX(-60)
      this.enemies.add(e)
    }
  }

  update() {
    this.player.update()

    // Enemy bounce off edges
    this.enemies.getChildren().forEach(obj => {
      const e = obj as Phaser.Physics.Arcade.Sprite
      const body = e.body as Phaser.Physics.Arcade.Body
      if (body.blocked.left)  e.setVelocityX(60)
      if (body.blocked.right) e.setVelocityX(-60)
    })

    // Fall death
    if (this.player.y > GAME_HEIGHT + 50) {
      this.lives--
      this.events.emit('livesUpdate', this.lives)
      if (this.lives <= 0) {
        this.player.die()
      } else {
        this.player.setPosition(100, 300)
      }
    }

    // Level end — reach right side
    if (this.player.x > GAME_WIDTH * 3 - 100) {
      this.scene.start('GameOverScene', { win: true })
    }
  }
}