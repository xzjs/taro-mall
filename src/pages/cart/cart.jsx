import React, { Component } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input,
  Block,
  Checkbox,
  CheckboxGroup,
} from "@tarojs/components";
import { AtInputNumber } from "taro-ui";
import {
  cartUpdate,
  cartDelete,
  getCartListApi,
} from "../../services/cart";
import { baseURL } from "../../utils/img";

import "./index.less";

class Cart extends Component {
  state = {
    cartGoods: [],
    total: 0,
    checkedList: [],
  };

  onPullDownRefresh() {
    Taro.showNavigationBarLoading(); //在标题栏中显示加载
    this.getCartList();
    Taro.hideNavigationBarLoading(); //完成停止加载
    Taro.stopPullDownRefresh(); //停止下拉刷新
  }

  componentDidUpdate() {}
  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidShow() {
    this.getCartList();
  }

  getCartList = () => {
    getCartListApi().then((res) => {
      this.setState({
        cartGoods: res.data,
        total: 0,
      });
    });
  };

  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}

  deleteCart = () => {
    let productIds = this.state.cartGoods.filter(function (
      element,
      index,
      array
    ) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.productId;
      }
    });

    cartDelete({
      productIds: productIds,
    }).then((res) => {
      console.log(res.data);
      let cartList = res.cartList.map((v) => {
        v.checked = false;
        return v;
      });

      this.setState({
        cartGoods: cartList,
        cartTotal: res.cartTotal,
      });

      this.setState({
        checkedAllStatus: this.isCheckedAll(),
      });
    });
  };

  checkoutOrder = () => {
    // storage中设置了cartId，则是购物车购买
    try {
      Taro.setStorageSync("carts", JSON.stringify(this.state.checkedList));
      Taro.navigateTo({
        url: "/pages/checkout/checkout",
      });
    } catch (e) {}
  };

  onCheckBoxChange = (e) => {
    this.setState(
      {
        checkedList: e.detail.value,
      },
      this.getTotal
    );
  };

  onNumChange = (id, value) => {
    cartUpdate(id, { num: value }).then(() => {
      const goods = [...this.state.cartGoods];
      this.setState(
        {
          cartGoods: goods.map((item) =>
            item.ID == id ? { ...item, num: value } : item
          ),
        },
        this.getTotal
      );
    });
  };

  getTotal = () => {
    let total = 0;
    this.state.cartGoods.forEach((item) => {
      if (this.state.checkedList.indexOf(item.ID.toString()) != -1) {
        total += item.good.price * item.num;
      }
    });
    this.setState({
      total: total,
    });
  };

  render() {
    const { isEditCart, cartGoods, total, checkedAllStatus } = this.state;
    return (
      <Block>
        <View className="bar-container container">
          <View class="login">
            {cartGoods.length <= 0 ? (
              <View className="no-cart">
                <View className="c">
                  <Text>空空如也~</Text>
                  <Text>去添加点什么吧</Text>
                </View>
              </View>
            ) : (
              <View className="cart-view">
                <View className="list">
                  <View className="group-item">
                    <View className="goods">
                      <CheckboxGroup
                        className="checkboxgroup"
                        onChange={this.onCheckBoxChange}
                      >
                        {cartGoods.map((item, index) => {
                          return (
                            <View
                              className={`item ${isEditCart ? "edit" : ""}`}
                              key="id"
                            >
                              <Checkbox
                                className="checkbox"
                                value={item.ID}
                              ></Checkbox>

                              <View className="cart-goods">
                                <Image
                                  className="img"
                                  src={baseURL + item.good.img}
                                ></Image>
                                <View className="info">
                                  <View className="t">
                                    <Text className="name">
                                      {item.good.name}
                                    </Text>
                                    <AtInputNumber
                                      min={1}
                                      max={1000}
                                      step={1}
                                      value={item.num}
                                      onChange={(value) => {
                                        this.onNumChange(item.ID, value);
                                      }}
                                    />
                                  </View>
                                  <View className="attr">
                                    {isEditCart ? "已选择:" : ""}
                                    {item.specifications || ""}
                                  </View>
                                  <View className="b">
                                    <Text className="price">
                                      ￥{item.good.price}
                                    </Text>
                                    <View className="selnum">
                                      <View
                                        className="cut"
                                        onClick={this.cutNumber}
                                        data-item-index={index}
                                      >
                                        -
                                      </View>
                                      <Input
                                        value={item.num}
                                        className="number"
                                        disabled="true"
                                        type="number"
                                      />
                                      <View
                                        className="add"
                                        onClick={this.addNumber}
                                        data-item-index={index}
                                      >
                                        +
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </CheckboxGroup>
                    </View>
                  </View>
                </View>
                <View className="cart-bottom">
                  {/* <van-checkbox value='{ checkedAllStatus }' bind:change='checkedAll'>全选（{cartTotal.checkedGoodsCount}）</van-checkbox> */}
                  <View className="total">
                    {!isEditCart ? "￥" + total : ""}
                  </View>
                  <View class="action_btn_area">
                    <View className="checkout" onClick={this.checkoutOrder}>
                      下单
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Block>
    );
  }
}
export default Cart;
