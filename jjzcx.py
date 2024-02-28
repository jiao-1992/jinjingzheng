import requests

# 企业微信相关配置信息
CORP_ID = "企业id"
APP_SECRET = "SECRET"
AGENT_ID = "应用号码"
TO_USER = "@all"  # 发送给所有成员
API_URL = f"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="

def get_access_token():
    url = f"https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={CORP_ID}&corpsecret={APP_SECRET}"
    response = requests.get(url)
    access_token = response.json().get("access_token")
    return access_token

def send_notification(notification_data):
    access_token = get_access_token()
    url = f"{API_URL}{access_token}"
    data = {
        "touser": TO_USER,
        "msgtype": "news",
        "agentid": AGENT_ID,
        "news": {
            "articles": [
                {
                    "title": notification_data["title"],
                    "description": notification_data["description"],
                    "url": notification_data["url"],
                    "picurl": notification_data["picurl"]
                }
            ]
        }
    }
    response = requests.post(url, json=data)
    result = response.json()
    if result["errcode"] == 0:
        print("Notification sent successfully!")
    else:
        print(f"Failed to send notification: {result}")

def get_data(url):
    auth = "抓包后填入"
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": auth
    }
    response = requests.post(url, headers=headers)
    data = response.json()
    return data

def create_notification_data(data):
    permit_type = data['data']['bzclxx'][0]['bzxx'][0]['jjzzlmc']
    validity_period = f"{data['data']['bzclxx'][0]['bzxx'][0]['yxqs']} ~ {data['data']['bzclxx'][0]['bzxx'][0]['yxqz']}"
    status = data['data']['bzclxx'][0]['bzxx'][0]['blztmc']
    application_date = data['data']['bzclxx'][0]['bzxx'][0]['sqsj'].split(' ')[0]
    plate_number = data['data']['bzclxx'][0]['hphm']
    
    notification_data = {
        "title": "交通许可状态更新",
        "description": (
            f"交通许可类型：{permit_type}\n"
            f"有效期：{validity_period}\n"
            f"状态：{status}\n"
            f"申请时间：{application_date}\n"
            f"车牌号：{plate_number}"
        ),
        "url": "https://github.com/jiao-1992/jinjingzheng", //卡片跳转链接可自行替换
        "picurl": "http://photo.dudunas.top/进京证logo.jpg" //卡片显示照片可自行替换
    }
    return notification_data

def main():
    api_url = "https://jjz.jtgl.beijing.gov.cn/pro/applyRecordController/stateList"
    data = get_data(api_url)
    notification_data = create_notification_data(data)
    send_notification(notification_data)

if __name__ == "__main__":
    main()
