const {
  windowWidth,
  windowHeight
} = wx.getSystemInfoSync()

const canvas = wx.createCanvas();
const context = canvas.getContext('2d') // 创建一个 2d context
const rectX = canvas.width / 2 - 50
let rectY = 0

var IntervalId = setInterval(function () {
  drawRect(rectX, rectY++);
  if (imgLoad) {
    context.drawImage(image, imgX, imgY)
  }
  if (imgX >= rectX - 100 && imgX <= rectX + 100 && imgY >= rectY - 100 && imgY <= rectY + 100) { // 飞机与矩形发生碰撞
    clearInterval(IntervalId)
    wx.showModal({
      title: '提示',
      content: '发生碰撞，游戏结束！'
    })
  }
}, 16)

var image = wx.createImage()
var imgLoad = false
var imgX = canvas.width / 2 - 50
var imgY = 500
image.onload = function () {
  imgLoad = true
}
image.src = 'img/plane.png'


wx.onTouchMove(function (res) {
  console.log(res.changedTouches[0].pageX, res.changedTouches[0].pageX - 50)
  console.log(res.changedTouches[0].pageY, res.changedTouches[0].pageY - 50)
  imgX = res.changedTouches[0].pageX - 50 // 将飞机x坐标置为当前触摸点x坐标
  imgY = res.changedTouches[0].pageY - 50 // 将飞机y坐标置为当前触摸点y坐标
})


function drawRect(x, y) {
  console.log("_____绘制图画")
  context.fillStyle = '#ffbc00'
  context.fillRect(0, 0, windowWidth, windowHeight)

  context.fillStyle = '#1aad19' // 矩形颜色
  context.fillRect(x, y, 100, 100)
}