import Taro from "@tarojs/taro";
import { showErrorToast } from "../utils/util";

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    Taro.request({
      url: url,
      data: data,
      method: method,
      header: {
        "Content-Type": "application/json",
        'Cookie': Taro.getStorageSync('ytmy'),
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res);
        } else if(res.statusCode==401){
          Taro.navigateTo({
            url: "/pages/auth/login/login",
          });
        }
        else {
          reject(res.data);
        }
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}

request.get = (url, data) => {
  return request(url, data, "GET");
};

request.post = (url, data) => {
  return request(url, data, "POST");
};

request.put = (url,data)=>{
  return request(url,data,"PUT");
};

export default request;
