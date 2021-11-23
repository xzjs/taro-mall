import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, Input } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
import { cartCheckout, orderSubmit, orderPrepay } from "../../services/cart";
import { showErrorToast } from "../../utils/util";

import "./index.less";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      phone: "",
      remark: "",
    };
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps, nextConText) {}
  componentWillUnmount() {}
  componentDidShow() {}

  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}

  onChangeName = (value) => {
    this.setState({
      name: value,
    });
  };

  onChangeAddress = (value) => {
    this.setState({
      address: value,
    });
  };

  onChangePhone = (value) => {
    this.setState({
      phone: value,
    });
  };

  onChangeRemark = (value) => {
    this.setState({
      remark: value,
    });
  };

  onSubmit = () => {
    let order = {
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone,
      remark: this.state.remark,
      carts: [],
    };
    let carts = JSON.parse(Taro.getStorageSync("carts"));
    carts.forEach((cart) => {
      order.carts.push({ ID: parseInt(cart) });
    });
    orderSubmit(order)
      .then(() => {
        Taro.switchTab({url:'/pages/ucenter/order/order'})
      })
      .catch((err) => {
        Taro.showToast({ title: err });
      });
  };

  render() {
    return (
      <View className="container">
        <AtForm>
          <AtInput
            name="name"
            title="收件人"
            type="text"
            placeholder="收件人姓名"
            value={this.state.name}
            onChange={this.onChangeName}
          />
          <AtInput
            name="address"
            title="地址"
            type="text"
            placeholder="请输入地址"
            value={this.state.address}
            onChange={this.onChangeAddress}
          />
          <AtInput
            name="phone"
            title="手机号"
            type="phone"
            placeholder="请输入手机号"
            value={this.state.phone}
            onChange={this.onChangePhone}
          />
          <AtInput
            name="remark"
            title="备注"
            type="text"
            placeholder="请输入备注"
            value={this.state.remark}
            onChange={this.onChangeRemark}
          />
          <AtButton type="primary" onClick={this.onSubmit}>
            提交
          </AtButton>
        </AtForm>
      </View>
    );
  }
}
export default Index;
