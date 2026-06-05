import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }) }

  preload() {}

  create() {
    // Player texture
    const pg = this.make.graphics({})
    pg.fillStyle(0x3366ff)
    pg.fillRect(0, 0, 32, 40)
    pg.fillStyle(0xffcc00)
    pg.fillRect(6, 2, 20, 14)
    pg.generateTexture('player', 32, 40)
    pg.destroy()

    // Enemy texture
    const eg = this.make.graphics({})
    eg.fillStyle(0xcc3300)
    eg.fillRect(0, 0, 28, 28)
    eg.fillStyle(0x000000)
    eg.fillRect(4, 8, 6, 6)
    eg.fillRect(18, 8, 6, 6)
    eg.generateTexture('enemy', 28, 28)
    eg.destroy()

    this.scene.start('MenuScene')
  }
}