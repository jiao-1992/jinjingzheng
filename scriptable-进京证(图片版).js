// 定义 API 地址
const API = "https://此处替换为抓包域名地址" + "/pro/applyRecordController/stateList"

// 获取数据
let data = await getData(API)

// 创建小组件
let widget = await createWidget(data)

// 如果脚本不在小组件中运行，则显示小组件
if (!config.runsInWidget) {
    await widget.presentMedium()
}

// 设置脚本的小组件
Script.setWidget(widget)

// 完成脚本的执行
Script.complete()

// 创建小组件函数
async function createWidget(data) {
    // 创建 ListWidget 实例
    let w = new ListWidget()
    // 设置内边距和背景渐变色
    w.setPadding(10, 10, 5, 10)
    bg = new LinearGradient()
    bg.locations = [0,1]
    bg.colors = [
        new Color("#9ab8eb", 1),
        new Color("#ebe8f3",1)
    ]
    w.backgroundGradient = bg

    // 创建堆栈并水平排列
    const wrap = w.addStack()
    wrap.layoutHorizontally()
    wrap.spacing = 15

    // 左侧列
    const column0 = wrap.addStack()
    column0.layoutVertically()

    // 展示申请类型
    let TypeStack = column0.addStack()
    TypeStack.layoutVertically()
    const TypeStatusLabel = TypeStack.addText(data.data.bzclxx[0].bzxx[0].jjzzlmc)
    TypeStatusLabel.font = Font.semiboldSystemFont(20)
    TypeStatusLabel.textColor = Color.black()
    TypeStack.addSpacer(15)

    // 展示有效期
    let PeriodValidityStack = column0.addStack()
    PeriodValidityStack.layoutVertically()
    const PeriodValidityStatusLabel = PeriodValidityStack.addText(data.data.bzclxx[0].bzxx[0].yxqs + "~" +  data.data.bzclxx[0].bzxx[0].yxqz)
    PeriodValidityStatusLabel.font = Font.boldSystemFont(12)
    PeriodValidityStatusLabel.textColor = Color.white()
    PeriodValidityStack.addSpacer(5)

    // 展示状态
    let StateStack = column0.addStack()
    StateStack.layoutVertically()
    const StateLable = StateStack.addText(data.data.bzclxx[0].bzxx[0].blztmc)
    StateLable.font = Font.boldRoundedSystemFont(13)
    // 将审核通过（生效中）改为绿色
    StateLable.textColor = new Color("#00FF00") // 绿色
    StateStack.addSpacer(5)

    // 展示申请时间
    let ApplicationDateStack = column0.addStack()
    ApplicationDateStack.layoutVertically()
    const ApplicationDateLable = ApplicationDateStack.addText("申请时间: " + data.data.bzclxx[0].bzxx[0].sqsj.split(" ")[0])
    ApplicationDateLable.font = Font.regularSystemFont(13)
    ApplicationDateStack.addSpacer(5)

    // 展示车牌号
    let PlateNumStack = column0.addStack()
    PlateNumStack.layoutVertically()
    PlateNumStack.backgroundColor = Color.gray()
    const PlateNumStatusLabel = PlateNumStack.addText("车牌号: " + data.data.bzclxx[0].hphm)
    PlateNumStatusLabel.font = Font.regularSystemFont(13)

    // 右侧列
    const column1 = wrap.addStack()
    column1.layoutVertically()

    // 展示天气信息
    let WeatherStack = column1.addStack()
    WeatherStack.layoutVertically()
    let WeatherData = await getWeather()
    let weatherIcon = ""
    if (WeatherData.data.forecast[0].type == "霾") {
        weatherIcon = "🌫️"
    } else if (WeatherData.data.forecast[0].type == "雨") {
        weatherIcon = "🌧️"
    } else if (WeatherData.data.forecast[0].type == "晴") {
        weatherIcon = "☀️"
    } else if (WeatherData.data.forecast[0].type == "多云") {
        weatherIcon = "☁️"
    } else if (WeatherData.data.forecast[0].type == "阴") {
        weatherIcon = "⛅"
    } else {
        weatherIcon = WeatherData.data.forecast[0].type
    }
    const WeatherStatusLabel = WeatherStack.addText(WeatherData.cityInfo.city + " " + WeatherData.data.wendu + "° " + WeatherData.data.forecast[0].fx + WeatherData.data.forecast[0].fl + " " + weatherIcon)
    WeatherStatusLabel.font = Font.regularSystemFont(13)
    WeatherStatusLabel.textColor = Color.black()
    WeatherStack.addSpacer(20)

    // 展示车辆图标
    let CarStack = column1.addStack()
    CarStack.setPadding(10, 10, 0, 0)
    let imgUrl = "http://photo.dudunas.top/Sagitar.png"
    const icon = await getImage(imgUrl)
    const iconImg = CarStack.addImage(icon)
    CarStack.addSpacer(8)

    // 返回创建的小组件
    return w
}

// 获取图片函数
async function getImage(url) {
    let req = new Request(url)
    return await req.loadImage()
}

// 获取数据函数
async function getData(url) {
    let req = new Request(url)
    // Authorization 自行抓包
    let auth = "抓包后填入"
    req.method = "post"
    req.headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": auth
    }
    // 发起请求并返回 JSON 数据
    var data = await req.loadJSON()
    console.log(data)
    return data
}

// 获取天气函数
async function getWeather() {
    // 以北京为例，其他城市自行搜索
    let cityID = "101010100"
    let req = new Request("http://t.weather.itboy.net/api/weather/city/" + cityID)
    req.method = "get"
    // 发起请求并返回 JSON 数据
    var data = await req.loadJSON()
    console.log(data)
    return data
}
