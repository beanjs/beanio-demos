// 模块引入
const beanio = require('beanio') // beanio 模块

// 常数定义
const PIN_R = B0
const PIN_G = B1
const PIN_B = B2
const SUBJECT_COLOR = 'w800.color.rgb' // 数据通道名称，长度需小于32

// 设置 beanio 参数
beanio.setup({
  token: ENV_TOKEN, // 令牌
  subjects: [SUBJECT_COLOR], // 订阅数据通道
  wifi: {
    ssid: ENV_SSID, // WIFI 名称，仅支持英文
    password: ENV_PSWD // WIFI 密码
  }
})

// 设置 beanio 连接成功 事件函数
beanio.on('connect', () => console.log('beanio connected'))

// 设置 beanio 连接断开 事件函数
beanio.on('disconnect', () => console.log('beanio disconnected'))

// 设置 beanio 数据通道 事件函数
beanio.on(SUBJECT_COLOR, val => {
  console.log({ color: val })
})

// 程序入口
function onInit () {
  PIN_R.mode('output_pulldown')
  PIN_G.mode('output_pulldown')
  PIN_B.mode('output_pulldown')
}
