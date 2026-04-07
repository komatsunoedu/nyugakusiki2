/* 入学式用：UI改善、画像の大きさ調整機能、花びらのサイズ調整機能追加バージョン */
let sakura = [];
let Num = 400; 

let mode = 'INPUT'; 

// UI要素
let inputArea;
let startButton;
let returnButton;
let sizeSlider; 
let textYPosSlider; 
let alignSelect; 
let sakuraSizeSlider; // ★花びらのサイズ用スライダー

// 画像アップロード・調整UI
let imgUploadBtn; 
let imageSizeSlider; 
let imageYPosSlider; 
let imageXPosSlider; 

let charImg; 

// UIの配置基準
let areaWidth, areaHeight, baseY;

// 画像読み込みが完了したかを判定するフラグ
let isImageReady = false;

// UI間のスペース
let space = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // スライダーの見た目をカスタマイズするCSSを定義
  defineSliderStyle();
  
  colorMode(HSB);
  
  // --- UIの作成 ---
  inputArea = createElement('textarea');
  inputArea.attribute('placeholder', 'ここにメッセージを入力してください');
  inputArea.style('font-size', '20px'); 
  inputArea.style('padding', '10px');
  inputArea.style('border', '1px solid #ccc');
  inputArea.style('border-radius', '10px');
  
  sizeSlider = createSlider(30, 200, 80); 
  sizeSlider.addClass('mySlider');
  
  textYPosSlider = createSlider(10, 90, 35); 
  textYPosSlider.addClass('mySlider');

  alignSelect = createSelect();
  alignSelect.option('中央揃え');
  alignSelect.option('左揃え');
  alignSelect.option('右揃え');
  alignSelect.selected('中央揃え');
  alignSelect.style('font-size', '16px');
  alignSelect.style('padding', '5px');
  alignSelect.style('border-radius', '5px');

  // ★花びらのサイズ用スライダー（0.1倍〜3.0倍の範囲、初期値1.0倍、ステップ0.1）
  sakuraSizeSlider = createSlider(0.1, 3.0, 1.0, 0.1);
  sakuraSizeSlider.addClass('mySlider');
  
  imgUploadBtn = createFileInput(handleFile);
  imgUploadBtn.style('font-size', '16px');
  imgUploadBtn.style('margin', '10px 0');

  imageSizeSlider = createSlider(0.1, 1.0, 0.6, 0.01);
  imageSizeSlider.addClass('mySlider');
  
  imageYPosSlider = createSlider(10, 90, 80);
  imageYPosSlider.addClass('mySlider');
  
  imageXPosSlider = createSlider(10, 90, 50);
  imageXPosSlider.addClass('mySlider');

  startButton = createButton('桜を降らせる');
  startButton.style('font-size', '24px');
  startButton.style('background-color', '#ff96b4'); 
  startButton.style('color', 'white');
  startButton.style('border', 'none');
  startButton.style('border-radius', '10px');
  startButton.style('padding', '10px 20px');
  startButton.style('cursor', 'pointer');
  startButton.style('transition', 'background-color 0.2s');
  startButton.mouseOver(() => startButton.style('background-color', '#ffb6c1'));
  startButton.mouseOut(() => startButton.style('background-color', '#ff96b4'));
  
  startButton.mousePressed(startProjection);

  returnButton = createButton('入力画面に戻る');
  returnButton.style('font-size', '14px');
  returnButton.style('background', 'transparent'); 
  returnButton.style('color', 'rgba(0, 0, 50, 0.5)'); 
  returnButton.style('border', 'none'); 
  returnButton.style('cursor', 'pointer');
  returnButton.mousePressed(returnToInput);
  returnButton.hide(); 

  // UIの初期配置
  positionUI();
  initSakura();
}

function defineSliderStyle() {
  let style = createElement('style');
  style.html(`
    input[type=range].mySlider {
      -webkit-appearance: none;
      background: transparent;
      width: 100%;
    }
    input[type=range].mySlider:focus {
      outline: none;
    }
    input[type=range].mySlider::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      background: #ddd; 
      border-radius: 4px;
    }
    input[type=range].mySlider::-webkit-slider-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #ff96b4; 
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -6px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: background 0.2s;
    }
    input[type=range].mySlider::-webkit-slider-thumb:hover {
      background: #ffb6c1; 
    }
  `);
}

function handleFile(file) {
  if (file.type === 'image') {
    isImageReady = false;
    loadImage(file.data, processUploadedImage);
  } else {
    charImg = null;
    isImageReady = false;
    alert("画像ファイル（PNG、JPG、GIFなど）を選択してください。");
  }
}

function processUploadedImage(img) {
  charImg = img;
  processImage(charImg);
  isImageReady = true;
  positionUI();
}

function processImage(img) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    if (r > 245 && g > 245 && b > 245) {
      img.pixels[i + 3] = 0;
    }
  }
  img.updatePixels();
}

function draw() {
  colorMode(RGB);
  background(200, 230, 255); 
  
  if (mode === 'INPUT') {
    drawInputScreenBackground();
  } else if (mode === 'PLAY') {
    colorMode(HSB);
    for (let i = 0; i < Num; i++) {
      sakura[i].update();
      sakura[i].render();
    }
    
    if (charImg && isImageReady) {
      colorMode(RGB);
      let imgRatio = charImg.height / charImg.width;
      
      let dispHeight = height * imageSizeSlider.value();
      let dispWidth = dispHeight / imgRatio;
      
      let imgX = width * (imageXPosSlider.value() / 100) - dispWidth / 2;
      let imgY = height * (imageYPosSlider.value() / 100) - dispHeight / 2;
      
      image(charImg, imgX, imgY, dispWidth, dispHeight);
    }

    colorMode(RGB); 
    drawMessage(msgText, sizeSlider.value(), alignSelect.value(), textYPosSlider.value());
  }
}

function startProjection() {
  msgText = inputArea.value(); 
  if (msgText.trim() === "") msgText = "ご入学おめでとう！";
  
  inputArea.hide();
  sizeSlider.hide(); 
  textYPosSlider.hide(); 
  alignSelect.hide();
  sakuraSizeSlider.hide(); // ★花びらスライダーを隠す
  imgUploadBtn.hide(); 
  imageSizeSlider.hide(); 
  imageYPosSlider.hide(); 
  imageXPosSlider.hide(); 
  startButton.hide();
  returnButton.show(); 
  mode = 'PLAY';

  // ★「桜を降らせる」を押した時に、スライダーの値を読み込んで桜を再生成する
  initSakura();
}

function returnToInput() {
  inputArea.show();
  sizeSlider.show(); 
  textYPosSlider.show(); 
  alignSelect.show();
  sakuraSizeSlider.show(); // ★花びらスライダーを表示
  imgUploadBtn.show(); 
  imageSizeSlider.show(); 
  imageYPosSlider.show(); 
  imageXPosSlider.show(); 
  startButton.show();
  returnButton.hide(); 
  mode = 'INPUT';
}

function drawMessage(txt, tSize, alignStr, yPosPerc) {
  let alignMode = CENTER;
  let posX = width / 2;
  if (alignStr === '左揃え') { alignMode = LEFT; posX = width * 0.1; }
  else if (alignStr === '右揃え') { alignMode = RIGHT; posX = width * 0.9; }

  let posY = height * (yPosPerc / 100);

  textAlign(alignMode, CENTER);
  textFont('sans-serif');
  textStyle(BOLD);

  colorMode(RGB); 
  stroke(255, 150, 180); 
  
  strokeWeight(max(4, tSize / 8)); 
  fill(255); 
  textSize(tSize);
  textLeading(tSize * 1.3);
  text(txt, posX, posY); 
}

function drawInputScreenBackground() {
  textAlign(CENTER, CENTER);
  fill(0, 0, 40); 
  noStroke();
  textSize(32);
  textStyle(BOLD);
  text("歓迎メッセージの設定", width / 2, baseY - 50);
  
  textStyle(NORMAL);
  textSize(16);
  // 文字の設定ラベル
  text("文字サイズ: " + sizeSlider.value(), width / 2, sizeSlider.y - space / 2);
  text("縦の位置 (上からの割合): " + textYPosSlider.value() + " %", width / 2, textYPosSlider.y - space / 2);
  text("配置:", width / 2, alignSelect.y - space / 2);

  // ★花びらの設定ラベル
  text("花びらのサイズ (倍率): " + sakuraSizeSlider.value().toFixed(1), width / 2, sakuraSizeSlider.y - space / 2);
  
  // 画像の設定ラベル
  text("投影する画像を選択:", width / 2, imgUploadBtn.y - space / 2);
  
  if (charImg && isImageReady) {
    text("画像の大きさ (倍率): " + imageSizeSlider.value().toFixed(2), width / 2, imageSizeSlider.y - space / 2);
    text("画像の縦位置 (上からの割合): " + imageYPosSlider.value() + " %", width / 2, imageYPosSlider.y - space / 2);
    text("画像の横位置 (左からの割合): " + imageXPosSlider.value() + " %", width / 2, imageXPosSlider.y - space / 2);
  } else {
    fill(0, 0, 30); 
    text("画像を使用する場合は、選択してください（白い背景は透明になります）。\n画像なしでも「桜を降らせる」ことは可能です。", width / 2, startButton.y - space * 1.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionUI();
}

function positionUI() {
  areaWidth = min(600, width * 0.8);
  areaHeight = 150;
  
  // ★要素が増えた分、全体を少し上へずらしてはみ出しを防ぐ
  baseY = height / 2 - 350; 
  
  inputArea.size(areaWidth, areaHeight);
  inputArea.position((width - areaWidth) / 2, baseY);
  
  let sliderWidth = 300;
  
  // 文字の設定UI
  let currentY = baseY + areaHeight + 20 + space * 1.5;
  sizeSlider.size(sliderWidth);
  sizeSlider.position((width - sliderWidth) / 2, currentY);
  
  currentY += space * 2.5;
  textYPosSlider.size(sliderWidth);
  textYPosSlider.position((width - sliderWidth) / 2, currentY);
  
  currentY += space * 2.5;
  alignSelect.size(150);
  alignSelect.position((width - 150) / 2, currentY);

  // ★花びらの設定UI
  currentY += space * 2.5;
  sakuraSizeSlider.size(sliderWidth);
  sakuraSizeSlider.position((width - sliderWidth) / 2, currentY);
  
  // 画像の設定UI
  currentY += space * 3.5;
  imgUploadBtn.size(sliderWidth, 20);
  imgUploadBtn.position((width - sliderWidth) / 2, currentY);
  
  if (charImg && isImageReady) {
    imageSizeSlider.show();
    imageYPosSlider.show();
    imageXPosSlider.show();

    currentY += space * 3.5;
    imageSizeSlider.size(sliderWidth);
    imageSizeSlider.position((width - sliderWidth) / 2, currentY);
    
    currentY += space * 2.5;
    imageYPosSlider.size(sliderWidth);
    imageYPosSlider.position((width - sliderWidth) / 2, currentY);
    
    currentY += space * 2.5;
    imageXPosSlider.size(sliderWidth);
    imageXPosSlider.position((width - sliderWidth) / 2, currentY);
    
    // 開始ボタンの位置
    currentY += space * 4;
    startButton.size(200, 60);
    startButton.position((width - 200) / 2, currentY);
  } else {
    imageSizeSlider.hide();
    imageYPosSlider.hide();
    imageXPosSlider.hide();
    
    // 開始ボタンの位置
    currentY += space * 5; 
    startButton.size(200, 60);
    startButton.position((width - 200) / 2, currentY);
  }
  
  returnButton.position(width - 120, height - 30);
}

function initSakura() {
  sakura = [];
  for (let i = 0; i < Num; i++) {
    sakura.push(new Sakura());
  }
}

class Sakura {
  constructor() {
    this.n = 4;
    
    // ★スライダーの値を読み込んで大きさに掛け算する
    // (まだスライダーが作られていない初期化のタイミングは 1.0 にする)
    let scaleMultiplier = sakuraSizeSlider ? sakuraSizeSlider.value() : 1.0;
    this.size = random(20, 50) * scaleMultiplier;
    
    this.xBase = random(width);
    this.xRadius = random(50, 100);
    this.xTheta = random(360);
    this.xaVelocity = random(1, 2);
    this.vecLocation = createVector(this.xBase, random(-height, 0));
    this.yVelocity = this.size / 20; // 落下速度もサイズに比例します
    this.hue = random(347, 353);
    this.saturation = random(25, 40);
    this.brightness = 100;
    this.alpha = random(0.6, 1);
    this.ySizeTheta = random(360);
    this.ySizeAVelocity = this.size / 20;
    this.yScale = 1;
  }
  update() {
    this.vecLocation.x = this.xBase + this.xRadius * sin(radians(this.xTheta));
    this.xTheta += this.xaVelocity;
    this.vecLocation.y += this.yVelocity;
    this.yScale = abs(sin(radians(this.ySizeTheta)));
    this.ySizeTheta += this.ySizeAVelocity;
    if (this.vecLocation.y > height) {
      this.vecLocation.y = -this.size;
      this.xBase = random(width);
    }
  }
  render() {
    fill(this.hue, this.saturation, this.brightness, this.alpha);
    noStroke();
    push();
    translate(this.vecLocation.x, this.vecLocation.y);
    rotate(radians(this.xTheta));
    beginShape();
    for (let theta = 0; theta < 90; theta++) {
      let A = this.n / PI * radians(theta);
      let mod = floor(A) % 2;
      let r0 = pow(-1, mod) * (A - floor(A)) + mod;
      let r = r0 + 2 * this.calculateH(r0);
      let x = this.size * r * cos(radians(theta));
      let y = this.size * this.yScale * r * sin(radians(theta));
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
  calculateH(x) {
    if (x < 0.8) return 0;
    else return 0.8 - x;
  }
}
