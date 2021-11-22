import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { showErrorToast } from "../../../utils/util";
import { set as setGlobalData } from "../../../global_data";

import * as user from "../../../utils/user";

import "./index.less";

class Login extends Component {
  state = {};

  wxLogin = (e) => {
    console.log("e", e);
    if (e.detail.userInfo == undefined) {
      setGlobalData("hasLogin", false);
      showErrorToast("微信登录失败");
      return;
    }

    user
      .loginByWeixin(e.detail.userInfo)
      .then(() => {
        Taro.navigateBack({
          delta: 1,
        });
      })
      .catch(() => {
        setGlobalData("hasLogin", false);
        showErrorToast("微信登录失败");
      });
  };

  render() {
    return (
      <View className="container">
        <View className="login-box">
          <Button
            type="primary"
            openType="getUserInfo"
            className="wx-login-btn"
            onGetUserInfo={this.wxLogin}
          >
            微信直接登录
          </Button>
        </View>
      </View>
    );
  }
}
export default Login;
