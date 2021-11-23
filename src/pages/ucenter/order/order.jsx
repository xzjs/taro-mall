import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, Navigator } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtListItem, AtList } from "taro-ui";
import { getOrderListApi } from "../../../services/order";

import "./index.less";

class Index extends Component {
  state = {
    orderList: [],
    showType: 0,
  };

  componentDidMount() {
    // 页面初始化 options为页面跳转所带来的参数
    try {
      var tab = Taro.getStorageSync("tab");

      this.setState({
        showType: tab,
      });
    } catch (e) {}
  }

  componentDidShow() {
    this.getOrderList();
  }

  getOrderList = () => {
    getOrderListApi({
      status: this.state.showType,
    }).then((res) => {
      this.setState({
        orderList: res.data,
      });
    });
  };

  onReachBottom = () => {};

  switchTab = (tab) => {
    // let showType = event.currentTarget.dataset.index;
    this.setState(
      {
        orderList: [],
        showType: tab,
      },
      () => {
        this.getOrderList();
      }
    );
  };

  render() {
    const tabList = [{ title: "进行中" }, { title: "已完成" }];
    const { orderList, showType } = this.state;
    return (
      <View className="container">
        <AtTabs current={showType} tabList={tabList} onClick={this.switchTab}>
          {tabList.map((tab, index) => {
            return (
              <AtTabsPane key={tab.title} current={showType} index={index}>
                {orderList.length <= 0 && (
                  <View className="no-order">
                    <View className="c">
                      <Text>还没有任何订单呢</Text>
                    </View>
                  </View>
                )}
                <View className="orders">
                  {Array.isArray(orderList) &&
                    orderList.map((item) => {
                      return (
                        <View key={item.ID}>
                          <View className="h">
                            <View className="l">订单编号：{item.ID}</View>
                          </View>
                          <AtList>
                            {item.carts.map((cart) => {
                              return (
                                <AtListItem
                                  key={cart.ID}
                                  title={cart.good.name}
                                  thumb={cart.good.img}
                                  extraText={"共" + cart.num + "件商品"}
                                />
                              );
                            })}
                          </AtList>
                          <View className="b">
                            <View className="l">共计：￥{item.total}</View>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </AtTabsPane>
            );
          })}
        </AtTabs>
      </View>
    );
  }
}
export default Index;
