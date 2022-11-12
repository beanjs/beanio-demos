// 模块引入
const beanio = require('beanio') // beanio 模块

// 常数定义
const PIN_R = B0
const PIN_G = B1
const PIN_B = B2
const SUBJECT_RGB = 'color-picker.rgb' // 数据通道名称，长度需小于32
const SUBJECT_LIGHT = 'color-picker.light'

let G_RGB = 0x000000
let G_LIGHT = 100

// 程序入口
function onInit () {
  PIN_R.mode('output_pulldown')
  PIN_G.mode('output_pulldown')
  PIN_B.mode('output_pulldown')

  // 设置 beanio 参数
  beanio.setup({
    token: ENV_TOKEN, // 令牌
    subjects: [SUBJECT_RGB, SUBJECT_LIGHT], // 订阅数据通道
    wifi: {
      ssid: ENV_SSID, // WIFI 名称，仅支持英文
      password: ENV_PSWD // WIFI 密码
    }
  })
}

function update () {
  const r = (G_RGB >> 16) & 0xff
  const g = (G_RGB >> 8) & 0xff
  const b = (G_RGB >> 0) & 0xff

  analogWrite(PIN_R, r / 255, { freq: G_LIGHT })
  analogWrite(PIN_G, g / 255, { freq: G_LIGHT })
  analogWrite(PIN_B, b / 255, { freq: G_LIGHT })
}

// 设置 beanio 连接成功 事件函数
beanio.on('connect', () => console.log('beanio connected'))

// 设置 beanio 连接断开 事件函数
beanio.on('disconnect', () => console.log('beanio disconnected'))

// 设置 beanio 数据通道 事件函数
beanio.on(SUBJECT_RGB, rgb => {
  G_RGB = rgb
  update()
})

// 设置 beanio 数据通道 事件函数
beanio.on(SUBJECT_LIGHT, light => {
  G_LIGHT = light
  update()
})
