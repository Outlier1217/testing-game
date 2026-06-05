import Phaser from 'phaser'
import { BootScene }     from './scenes/BootScene'
import { MenuScene }     from './scenes/MenuScene'
import { GameScene }     from './scenes/GameScene'
import { UIScene }       from './scenes/UIScene'
import { GameOverScene } from './scenes/GameOverScene'
import { GAME_WIDTH, GAME_HEIGHT } from './utils/Constants'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#5c94fc',   // Mario sky blue
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 600 }, debug: false }
  },
  scene: [BootScene, MenuScene, GameScene, UIScene, GameOverScene]
}

new Phaser.Game(config)