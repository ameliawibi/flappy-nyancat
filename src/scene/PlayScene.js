import BaseScene from "./BaseScene";
import axios from "axios";
import socket from "../../socket/client";

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);
    this.pipes = null;
    this.pauseButton = null;
    this.isPaused = false;
    this.flapVelocity = 200;
    this.moveVelocity = -150;
    this.pipeVerticalDistanceRange = [100, 250];
    this.pipeHorizontalDistanceRange = [300, 500];

    this.score = 0;
    this.scoreText = "";
    this.bestScoreText = "";
    this.dude = {};
  }

  promise(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async create() {
    this.dude.isReady = false;
    super.create();
    this.startMusic();
    //this.createPipes();
    //this.createBird();
    await this.createBirdNew();
    await this.createPipesNew();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();
    setTimeout(() => {
      //this.createColliders();
    }, 1000);
    this.dude.isReady = true;
  }

  update() {
    if (!this.dude.isReady) {
      return;
    }
    this.recyclePipes();
    //this.checkGameStatus();
  }

  checkGameStatus() {
    //console.log(this.bird);
    if (
      this.bird.y <= 0 ||
      this.bird.getBounds().bottom >= this.config.height
    ) {
      this.gameOver();
    }
  }

  otherPlayerMoves() {
    this.socket.emit("playerMovement", {
      xBird: this.bird.body.position.x,
      yBird: this.bird.body.position.y,
    });
  }

  startMusic() {
    this.music = this.sound.add("nyancat");
    //this.music.play();
  }

  createBird() {
    var anim_config = {
      key: "flap",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 2,
        first: 0,
      }),
      frameRate: 10,
      repeat: -1,
    };
    this.flapSound = this.sound.add("flap");

    this.anims.create(anim_config);
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(false)
      .setOrigin(0)
      .setBodySize(50, 38)
      .setOffset(31, 0)
      .play("flap");

    this.bird.body.gravity.y = 400; //400 pixels per second with acceleration
    this.bird.setCollideWorldBounds(true);
  }

  createBirdNew() {
    return new Promise((resolve) => {
      this.otherPlayers = this.physics.add.group();
      this.socket.emit("subscribe", socket.id);
      this.socket.once("currentPlayers", (players) => {
        var anim_config = {
          key: "flapAnim",
          frames: this.anims.generateFrameNumbers("bird", {
            start: 0,
            end: 2,
            first: 0,
          }),
          frameRate: 10,
          repeat: -1,
        };
        this.anims.create(anim_config);
        Object.keys(players).forEach((id) => {
          if (players[id].playerId === socket.id) {
            this.flapSound = this.sound.add("flap");
            this.bird = this.physics.add
              .sprite(
                this.config.startPosition.x,
                this.config.startPosition.y,
                "bird"
              )
              .setFlipX(false)
              .setOrigin(0)
              .setBodySize(50, 38)
              .setOffset(31, 0)
              .play("flapAnim");
            this.bird.body.gravity.y = 400; //400 pixels per second with acceleration
            this.bird.setCollideWorldBounds(true);
          } else {
            this.createOtherBirds(players[id]);
          }
        });
      });
      this.socket.on("newPlayer", (playerInfo) => {
        if (playerInfo) {
          console.log(playerInfo);
          this.createOtherBirds(playerInfo);
        } else {
          return;
        }
      });

      resolve();
      //setTimeout(() => console.log(this.bird), 1000);
    });
  }

  createOtherBirds(playerInfo) {
    ("this happens");
    this.otherPlayer = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(false)
      .setOrigin(0)
      .setBodySize(50, 38)
      .setOffset(31, 0)
      .setTint(0x0000ff)
      .play("flapAnim");

    this.otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(this.otherPlayer);
    console.log(this.otherPlayers.getChildren());
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setFlipY(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(this.moveVelocity);
  }

  createPipesNew() {
    return new Promise((resolve) => {
      this.pipes = this.physics.add.group();
      for (let i = 0; i < PIPES_TO_RENDER; i++) {
        const upperPipe = this.pipes
          .create(0, 0, "pipe")
          .setImmovable(true)
          .setFlipY(true)
          .setOrigin(0, 1);
        const lowerPipe = this.pipes
          .create(0, 0, "pipe")
          .setImmovable(true)
          .setOrigin(0, 0);
        this.placePipe(upperPipe, lowerPipe);
      }
      this.pipes.setVelocityX(this.moveVelocity);
      resolve();
    });
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    axios
      .get("/displayscore")
      .then((response) => {
        this.scoreText = this.add.text(
          16,
          16,
          `Score: ${response.data.currentScore || 0}`,
          {
            fontSize: "32px",
            fill: "#fff",
          }
        );
        this.bestScoreText = this.add.text(
          16,
          52,
          `Best score by ${response.data.bestPlayer}: ${
            response.data.bestScore || 0
          }`,
          {
            fontSize: "18px",
            fill: "#fff",
          }
        );
      })
      .catch((error) => {
        //handle error
        console.log(error);
      });
  }

  createPause() {
    this.isPaused = false;
    this.pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setOrigin(1)
      .setScale(0.1)
      .setInteractive();

    this.pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown_P", this.flap, this);
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.pauseButton.destroy();
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          `Fly in: ${this.initialTime}`,
          this.fontOptions
        )
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.countDown();
        },
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText(`Fly in: ${this.initialTime}`);
    if (this.initialTime <= 0) {
      this.countDownText.setText("");
      this.timedEvent.remove();
      this.physics.resume();
      this.isPaused = false;
      this.createPause();
    }
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostPipePosition();
    let pipeVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistanceRange
    );
    let pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
        }
      }
    });
  }

  getRightMostPipePosition() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  gameOver() {
    this.checkBestScore();
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.music.pause();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.otherPlayerExit();
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
    this.flapSound.play();
  }

  increaseScore() {
    this.score += 1;
    const data = {
      currentScore: this.score,
    };
    axios
      .put("/increase", data)
      .then((response) => {
        this.scoreText.setText(`Score: ${response.data.currentScore}`);
        this.checkBestScore();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  checkBestScore() {
    axios
      .get("/displayscore")
      .then((response) => {
        this.bestScoreText.setText(
          `Best score by ${response.data.bestPlayer}: ${
            response.data.bestScore || 0
          }`
        );
      })
      .catch((error) => {
        //handle error
        console.log(error);
      });
  }
}

export default PlayScene;
