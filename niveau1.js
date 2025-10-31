export default class niveau1 extends Phaser.Scene {
  constructor(scene) {
    super({ key: "niveau1" });
    this.player = null;
    this.clavier = null;
    this.porte = null;
    this.scene = scene;
    this.score = 0; 
    this.scoreText = null;
    this.scoreIcon = null;
    this.enemy = null;
    this.enemyHealth = 100;
    this.playerHealth = 100; 
    this.healthText = null;
    this.plateforme_mobile = null;
    this.tween_mouvement = null;
    this.levier = null;
    this.isNearLevier = false;  
    this.timerDuration = 60; 
    this.timerText = null;    
    this.timerEvent = null;  
    this.musique_de_fond = null;
    this.drink = null;
    this.jump = null;
    this.tir = null;
    this.lastHitTime = 0; 
    this.hitCooldown = 1000;
    this.shootCooldown = 500; 
    this.lastShotTime = 0; 
  }
  

    preload() {

    this.load.audio('musique', 'src/assets/musique.mp3');   
    this.load.audio('drink', 'src/assets/glug.mp3');   
    this.load.audio('jump', 'src/assets/jump.mp3');   
    this.load.audio('tir', 'src/assets/makarov.mp3');   
    this.load.image('background', 'src/background.png'); 
    this.load.image("img_ciel", "src/assets/sky.png");
    this.load.image("rhum", "src/assets/icon48.png"); 
    this.load.image("img_plateforme", "src/assets/platform.png");
    this.load.image('img_porte1', 'src/assets/door1.png');
    this.load.image('img_porte2', 'src/assets/door2.png');
    this.load.image('img_porte3', 'src/assets/door3.png'); 
    this.load.image('coeur', 'src/assets/heart_empty.png'); 
    this.load.image("img_plateforme", "src/assets/platform.png");
    this.load.image("tileset", "src/tileset.png");
    this.load.tilemapTiledJSON("map2", "src/map2.json"); 
    this.load.image("img_plateforme_mobile", "src/assets/tiny_blue_platform.png");
    this.load.image("img_levier", "src/assets/levier.png"); 


    this.load.spritesheet("img_perso", "src/assets/Sheet_Cat_Run.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy", "src/assets/enemy.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("img_porte", "src/assets/spritesheet_porte.png", {
      frameWidth: 96,
      frameHeight: 120
    });
    this.load.spritesheet("tir", "src/assets/weapon_00.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("portal", "src/assets/portal.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("clock", "src/assets/clock.png", {
      frameWidth: 1024,
      frameHeight: 1024,
    });
    this.load.spritesheet("GinShou", "src/assets/GinShou.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("crystal", "src/assets/crystal.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, 3200, 960, 'background')
      .setOrigin(0, 0)
      .setDepth(-1);
    
    this.map = this.add.tilemap("map2");
    const tileset = this.map.addTilesetImage("tileset", "tileset", 32, 32);
    const calque = this.map.createLayer("calque", tileset);
    calque.setCollisionByProperty({ estSolide: true });    
    this.player = this.physics.add.sprite(100, 750, "img_perso");
    this.physics.world.setBounds(0, 0, 3200, 960);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.player.setScale(2);
    this.player.setGravityY(300);
    this.physics.add.collider(this.player, calque);

    this.tir = this.sound.add('tir');
    this.jump = this.sound.add('jump');
    this.musique_de_fond = this.sound.add('musique');
    this.drink = this.sound.add('drink');
    this.musique_de_fond.play();  
    this.musique_de_fond.setVolume(0.2);  

    this.crystal = this.physics.add.sprite(3000, 750, "crystal");
    this.crystal.setScale(1.5);
    this.physics.add.collider(this.crystal, calque); 
    this.physics.add.overlap(this.player, this.crystal, this.collectCrystal, null, this);

    const deathLayer = this.map.getObjectLayer("deathLayer");
    this.deadlyZones = this.physics.add.staticGroup();
    deathLayer.objects.forEach((obj) => {
        const zone = this.deadlyZones.create(obj.x, obj.y, null)
            .setOrigin(0, 0)
            .setSize(obj.width, obj.height)
            .setVisible(false);  
    });
    this.physics.add.overlap(this.player, this.deadlyZones, this.playerDeath, null, this);
    
    this.timerText = this.add.text(1000, 180, `Temps : ${this.timerDuration}`, {
      fontSize: '24px',
      fill: '#FFFFFF',
      fontFamily: 'Arial',
    }).setScrollFactor(0);

    const clockImage = this.add.image(900, 150, 'clock').setOrigin(0).setScale(0.1).setScrollFactor(0);

    this.timerEvent = this.time.addEvent({
      delay: 1000, 
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    this.anims.create({
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "enemy_walk",
      frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, 3200, 960);

    this.clavier = this.input.keyboard.createCursorKeys();

    this.rhums = this.physics.add.group({
      key: "rhum",
      repeat: 10,
      setXY: { x: 200, y: 0, stepX: 200 }
    });
    this.physics.add.collider(this.rhums, calque);
    this.physics.add.overlap(this.player, this.rhums, this.collectRhum, null, this);

    this.scoreIcon = this.add.image(250, 150, 'rhum').setScale(1.5).setOrigin(0).setScrollFactor(0);
    this.scoreText = this.add.text(300, 160, '0', {
      fontSize: '32px',
      fill: '#FFFFFF',
      fontFamily: 'Arial',
      strokeThickness: 3
    }).setScrollFactor(0);

    this.healthIcon = this.add.image(380, 150, 'coeur').setScale(1.5).setOrigin(0).setScrollFactor(0);
    this.healthText = this.add.text(450, 160, '100', {
      fontSize: '32px',
      fill: '#FFFFFF',
      fontFamily: 'Arial',
    }).setScrollFactor(0);

    this.enemies = this.physics.add.group();

    const enemyPositions = [
      { x: 800, y: 750 },
      { x: 1200, y: 750 },
      { x: 1600, y: 750 },
      { x: 2000, y: 750 },
    ];
    
    enemyPositions.forEach(pos => {
      const enemy = this.enemies.create(pos.x, pos.y, "enemy");
      enemy.setCollideWorldBounds(true);
      enemy.setBounce(0.5);
      enemy.setGravityY(300);
      enemy.play("enemy_walk");
      this.physics.add.collider(enemy, calque); 
    });
    
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    
    this.enemyMoveEvent = this.time.addEvent({
      delay: 1000,
      callback: this.moveEnemies,
      callbackScope: this,
      loop: true
    });

    this.tirs = this.physics.add.group();
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.physics.add.overlap(this.tirs, this.enemies, this.hitEnemyWithBullet, null, this);
  }

  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      const currentTime = this.time.now;
      if (currentTime - this.lastShotTime >= this.shootCooldown) {
        this.tir.play();
        this.shootBullet();
        this.lastShotTime = currentTime;
      }
    }

    if (this.clavier.space.isDown && this.player.body.blocked.down) {
      this.jump.play();  
      this.player.setVelocityY(-300);
    }
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.tir.play();  
      this.shootBullet();
    }

    if (this.timerDuration <= 0) {
      this.timerEvent.paused = true; 
      this.musique_de_fond.stop();
      this.scene.start("gameover"); 
    }

}
updateTimer() {
  if (this.timerDuration > 0) {
    this.timerDuration -= 1; 
    this.timerText.setText(`Temps : ${this.timerDuration}`); 
  }
}

  collectRhum(player, rhum) {
    this.drink.play();  
    rhum.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(this.score);
  }

  moveEnemy() {
    if (this.enemy && this.enemy.active) {  
      const direction = Phaser.Math.Between(-160, 160);
      this.enemy.setVelocityX(direction);
    }
  }


  hitEnemy(player, enemy) {
    const currentTime = this.time.now;
    if (currentTime - this.lastHitTime >= this.hitCooldown) {
      this.lastHitTime = currentTime;  

      this.playerHealth -= 20;
      this.healthText.setText(this.playerHealth);

      player.setVelocityY(-200);  

      if (this.playerHealth <= 0) {
        this.musique_de_fond.stop();
        this.scene.start("gameover");
      }
    }
  }

  shootBullet() {
    const bullet = this.tirs.create(this.player.x, this.player.y, 'tir');
    bullet.setVelocityX(this.player.flipX ? -400 : 400);
    bullet.setGravityY(-300); 

    this.time.delayedCall(1000, () => {
        bullet.destroy();
    });
}


  hitEnemyWithBullet(bullet, enemy) {
    bullet.destroy();
    this.enemyHealth -= 10;

    if (this.enemyHealth <= 0) {
      enemy.destroy();
      this.enemyMoveEvent.remove(); 
    }
  }

  enterPortal(player, portal) {
    portal.body.enable = false;

    this.cameras.main.fade(500, 0, 0, 0);

    this.time.delayedCall(500, () => {
      this.musique_de_fond.stop();
      this.scene.start("niveau1"); 
    });
  }

  playerDeath(player, deadlyZone) {
    this.playerHealth = 0;  
    this.musique_de_fond.stop();
    this.scene.start("gameover");
}

moveEnemies() {
  this.enemies.children.iterate((enemy) => {
    if (enemy.active) {
      const direction = Phaser.Math.Between(-160, 160);
      enemy.setVelocityX(direction);
    }
  });
}
collectCrystal(player, crystal) {
  crystal.disableBody(true, true);  

  const victoryText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 
    "Félicitations ! Le jeu est terminé", {
      fontSize: "24px",
      fill: "#FFFFFF",
      fontFamily: "Arial",
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0);

  this.musique_de_fond.stop();
  this.physics.pause();  

  this.time.delayedCall(3000, () => {
    this.scene.start("accueil"); 
  });
}


}
