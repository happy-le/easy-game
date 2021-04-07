const {
  windowWidth,
  windowHeight
} = wx.getSystemInfoSync()

// 得分
var score = 0;
var highestScore = 0;

// canvas对象
const canvas = wx.createCanvas();
const context = canvas.getContext('2d');

// 方块位置
var rectX = canvas.width / 2 - 50
var rectY = 0

// 飞机长宽
var planeWidth = 60;
var planeHeight = 60;
// 飞机位置
var imgX = canvas.width / 2 - planeWidth / 2
var imgY = windowHeight - planeHeight;

/**
 * 手指拖动飞机事件
 */
var startX = 0;
var startY = 0;
var tempX = 0;
var tempY = 0
wx.onTouchStart((result) => {
  tempX = imgX;
  tempY = imgY;
  startX = result.changedTouches[0].pageX;
  startY = result.changedTouches[0].pageY;
})

wx.onTouchMove((result) => {
  let offsetX = startX - result.changedTouches[0].pageX;
  let offsetY = startY - result.changedTouches[0].pageY;

  // 限制飞机的移动范围在屏幕内
  imgX = Math.max(tempX - offsetX, 0);
  imgX = Math.min(windowWidth - planeWidth, imgX);
  imgY = Math.max(tempY - offsetY, windowHeight - 200);
  imgY = Math.min(windowHeight - planeHeight, imgY);

})

/**
 * 绘制方块信息
 */
function drawInfo() {
  // 清空画布
  context.fillStyle = '#DCDFF6'
  context.fillRect(0, 0, windowWidth, windowHeight)

  // 绘制NPC方块
  context.fillStyle = rectColor
  context.fillRect(rectX, rectY, 100, 100);

  // 绘制飞机
  context.fillStyle = planeColor
  context.fillRect(imgX, imgY, planeWidth, planeHeight);

  // 绘制分界线线
  context.beginPath();
  context.strokeStyle = "#0000ff";
  context.moveTo(0, windowHeight - 200);
  context.lineTo(windowWidth, windowHeight - 200);
  context.stroke();

  context.fillStyle = "#000000"
  context.font = "30px Verdana";
  context.fillText(`得分${score} `, 10, 50);
  context.fillText(`最高分${highestScore}`, 10, 100)
}

/**
 * 初始化游戏信息
 */
function initGame() {
  rectX = canvas.width / 2 - 50
  rectY = 0
  imgX = canvas.width / 2 - planeWidth / 2
  imgY = windowHeight - planeHeight
  score = 0;
  highestScore = parseInt(wx.getStorageSync('highestScore') || 0)
}

/**
 * 计算游戏中的随机数据
 */
var offsetRectX = 0;
var offsetRectY = 0;
var rectColor = "#606266";
var planeColor = "#409EFF";
setInterval(() => {
  // rectColor = getRandomColor();
  // planeColor = getRandomColor();  
  offsetRectX = (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 10);
  offsetRectY = (Math.random() < 0.2 ? -1 : 1) *  Math.floor(Math.random() * 10);


}, 300)

/**
 * 生成随机颜色
 */
function getRandomColor() {
  return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
}


/**
 * 开始游戏
 */
function startGame() {
  initGame()
  var IntervalId = setInterval(function () {
    rectX += offsetRectX;
    rectX = Math.max(rectX + offsetRectX, 0);
    rectX = Math.min(rectX + offsetRectX, windowWidth - 100)
    rectY += offsetRectY;

    // 判断游戏是否结束
    if (imgX >= rectX - planeWidth && imgX <= rectX + 100 && imgY >= rectY - planeHeight && imgY <= rectY + 100) {
      clearInterval(IntervalId)
      gameOver()

    }

    drawInfo();

    if (rectY > windowHeight) {
      rectY = 0;
      score++
    }
  }, 16)
}

/**
 * 游戏结束
 */
function gameOver() {
  wx.showModal({
    title: '提示',
    content: '发生碰撞',
    confirmText: "再试一次",
    success(res) {
      if (res.confirm) {
        wx.setStorageSync('highestScore', Math.max(score, highestScore))
        startGame();
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

/**
 * 程序入口函数
 */
function main() {
  wx.showModal({
    content: '这其实不是一个简单的小游戏, 请做好心里准备！',
    showCancel: false,
    confirmText: "开始游戏",
    success(res) {
      if (res.confirm) {
        startGame()
      }
    }
  })
}

drawInfo();
main()