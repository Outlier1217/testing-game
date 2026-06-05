import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }) }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(width / 2, height / 2, width, height, 0x5c94fc)

    this.add.text(width / 2, height / 2 - 60, '🍄 MARIO PHASER', {
      fontSize: '40px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5)

    const startBtn = this.add.text(width / 2, height / 2 + 20, 'PRESS ENTER TO START', {
      fontSize: '20px', color: '#ffdd00',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5)

    // Blink effect
    this.tweens.add({
      targets: startBtn, alpha: 0, duration: 600,
      yoyo: true, repeat: -1
    })

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('GameScene')
      this.scene.start('UIScene')
    })
  }
}