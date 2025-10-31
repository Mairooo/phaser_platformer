export default class accueil extends Phaser.Scene {
  constructor() {
      super({ key: "accueil" });
  }

  preload() {
      this.load.image("menu_accueil", 'src/accueil.png'); 
      this.load.image("imageBoutonstart", 'src/assets/start.png');
  }

  create() {
      this.add.image(0, 0, "menu_accueil").setOrigin(0).setDisplaySize(window.innerWidth, window.innerHeight).setDepth(0);

      var bouton_suivant = this.add.image(700, 600, "imageBoutonstart").setDepth(1) 
      .setScale(2); 

      bouton_suivant.setInteractive();

      bouton_suivant.on("pointerup", () => {
          this.scene.start("selection");  
          this.scene.stop();
      });
  }
}
