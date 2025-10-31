import selection from "./selection.js"; 
import niveau1 from "./niveau1.js"; 
import gameover from "./gameover.js";
import accueil from "./accueil.js"; 

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,  
  height: window.innerHeight, 
  physics: {
    default: "arcade", 
    arcade: {
      gravity: { y: 300 }, 
      debug: false,
    }
  },
  scene: [accueil, selection, niveau1, gameover ],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH 
  }
};

var game = new Phaser.Game(config);
game.scene.start('accueil');  
