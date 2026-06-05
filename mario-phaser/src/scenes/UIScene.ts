import Phaser from 'phaser'

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text

  constructor() { super({ key: 'UIScene' }) }

  create() {
    this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
      fontSize: '18px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4
    }).setScrollFactor(0)

    this.livesText = this.add.text(16, 44, '❤️ x 3', {
      fontSize: '18px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4
    }).setScrollFactor(0)

    this.add.text(400, 16, '← → / WASD   SPACE / W to jump', {
      fontSize: '13px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setOrigin(0.5, 0)

    const gameScene = this.scene.get('GameScene')
    gameScene.events.on('scoreUpdate', (s: number) => {
      this.scoreText.setText(`SCORE: ${s}`)
    })
    gameScene.events.on('livesUpdate', (l: number) => {
      this.livesText.setText(`❤️ x ${l}`)
    })
  }
}