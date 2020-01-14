var api = {
  "formal": {
    "interface": "https://api.meetji.com", //接口
    "domain": "http://www.meetji.com",
    "appName": "EF英孚教育",
    "aliplay": {
      "AppID": "2019103168833246"
    }
  },
  "dev": {
    "interface": "https://api.meetji.com", //接口
    "domain": "http://train.wsshanghai.com",
    "appName": "EF英孚教育",
    "aliplay": {
      "AppID": "2021000199601962"
    }
  }
}
var lks = "dev";
export default {
  Interface: {
    "site": lks,
    "apiurl": api[lks]["interface"],
    "domain": api[lks]["domain"],
    "appName": api[lks]["appName"],
    "aliplay": api[lks]["aliplay"],
    "addr": {
      "login": "/login-login.htm",
      "saveSingle": "/v2/ApiHome-saveSingle.htm",
      "getPhone": "/v4/ApiAlipay-oriPhone.htm"
    }
  }
}
