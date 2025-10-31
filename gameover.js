export default class gameover extends Phaser.Scene {
    constructor() {
      super({ key: "gameover" });
      this.musique_histoire = null;
    }

    preload() {
      this.load.image("menu_gameover", 'src/gameover.png'); 
      this.load.image("imageBoutonyes", 'src/assets/boutonyes.png');
    }

    create() {
        this.add.image(0, 0, "menu_gameover").setOrigin(0).setDisplaySize(window.innerWidth, window.innerHeight).setDepth(0);

        var bouton_suivant = this.add.image(700, 700, "imageBoutonyes").setDepth(1) // Centré
        .setScale(2); // Réduire la taille du bouton

        bouton_suivant.setInteractive();

        bouton_suivant.on("pointerup", () => {
            this.scene.start("selection");  
            this.scene.stop();
        });
    }
}
