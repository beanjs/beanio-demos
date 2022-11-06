// 模块引入
const storage = require('Storage') // 数据存储模块
const beanio = require('beanio') // beanio 模块

// 常数定义
const PIN_BUTTON = D0 // 按键引脚
const PIN_RELAY = D12 // 继电器引脚
const SUBJECT_RELAY = 'sonoff.relay.ch1' // 数据通道名称，长度需小于32

// 设置 beanio 参数
beanio.setup({
  token: ENV_TOKEN, // 令牌
  subjects: [SUBJECT_RELAY], // 订阅数据通道
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
beanio.on(SUBJECT_RELAY, val => {
  // 检查 可用存储区域 大小,如果小于4096则进行存储区域压缩
  if (storage.getFree() < 4096) {
    storage.compact()
  }
  // 保存 继电器 状态
  storage.write('status', '' + val)
  // 设置 继电器 输出
  PIN_RELAY.write(val)
})

// 程序入口
function onInit () {
  // 设置引脚工作模式
  PIN_BUTTON.mode('input')
  PIN_RELAY.mode('output')
  // 初始化 继电器输出
  PIN_RELAY.write(parseInt(storage.read('status')))
  // 设置 按键 中断处理
  setWatch(
    // 中断发生时,发送信号到服务器
    () => beanio.emit(SUBJECT_RELAY, PIN_RELAY.read() ? 0 : 1),
    // 中断引脚
    PIN_BUTTON,
    // 重复捕捉中断信号,下降沿触发,软件消抖1000毫秒
    { repeat: 1, edge: 'falling', debounce: 1000 }
  )
}
