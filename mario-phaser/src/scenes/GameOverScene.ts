import Phaser from 'phaser'

export class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }) }

  create(data: { win: boolean }) {
    const { width, height } = this.scale
    const bg = data.win ? 0x1a6600 : 0x660000
    this.add.rectangle(width / 2, height / 2, width, height, bg)

    this.add.text(width / 2, height / 2 - 50,
      data.win ? '🏆 YOU WIN!' : '💀 GAME OVER',
      { fontSize: '40px', color: '#ffffff', stroke: '#000', strokeThickness: 6 }
    ).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 20, 'Press ENTER to play again', {
      fontSize: '20px', color: '#ffdd00', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5)

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.stop('UIScene')
      this.scene.start('MenuScene')
    })
  }
}