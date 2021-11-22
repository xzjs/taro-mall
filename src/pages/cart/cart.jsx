import React, { Component } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Text,
  Button,
  Image,
  Input,
  Block,
  Checkbox,
  CheckboxGroup,
} from "@tarojs/components";
import { AtInputNumber } from "taro-ui";
import { get as getGlobalData } from "../../global_data";
import {
  cartUpdate,
  cartDelete,
  cartChecked,
  getCartListApi,
} from "../../services/cart";
import { TabBar } from "../../components";

import "./index.less";

class Cart extends Component {
  state = {
    cartGoods: [],
    total: 0,
    cartTotal: {
      goodsCount: 0,
      goodsAmount: 0.0,
      checkedGoodsCount: 0,
      checkedGoodsAmount: 0.0,
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: [],
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

  isCheckedAll = () => {
    //判断购物车商品已全选
    return this.state.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  };

  doCheckedAll = () => {
    // let checkedAll = this.isCheckedAll()
    this.setState({
      checkedAllStatus: this.isCheckedAll(),
    });
  };

  cutNumber = (event) => {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.state.cartGoods[itemIndex];
    let number = cartItem.number - 1 > 1 ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setState(
      {
        cartGoods: this.state.cartGoods,
      },
      () => {
        this.updateCart(
          cartItem.productId,
          cartItem.goodsId,
          number,
          cartItem.id
        );
      }
    );
  };

  addNumber = (event) => {
    console.log("this.state", this.state);
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.state.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setState(
      {
        cartGoods: this.state.cartGoods,
      },
      () => {
        this.updateCart(
          cartItem.productId,
          cartItem.goodsId,
          number,
          cartItem.id
        );
      }
    );
  };

  updateCart = (productId, goodsId, number, id) => {
    cartUpdate({
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id,
    }).then(() => {
      this.setState({
        checkedAllStatus: this.isCheckedAll(),
      });
    });
  };

  checkoutOrder = () => {
    //获取已选择的商品

    var checkedGoods = this.state.cartGoods.filter(function (
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

    if (checkedGoods.length <= 0) {
      return false;
    }

    // storage中设置了cartId，则是购物车购买
    try {
      Taro.setStorageSync("cartId", 0);
      Taro.navigateTo({
        url: "/pages/checkout/checkout",
      });
    } catch (e) {}
  };

  editCart = () => {
    if (this.state.isEditCart) {
      this.getCartList();
      this.setState({
        isEditCart: !this.state.isEditCart,
      });
    } else {
      //编辑状态
      let tmpCartList = this.state.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setState({
        editCartList: this.state.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.state.isEditCart,
        checkedAllStatus: this.isCheckedAll(),
        "cartTotal.checkedGoodsCount": this.getCheckedGoodsCount(),
      });
    }
  };

  checkedItem = (event) => {
    console.log(event);
    let itemIndex = event.target.dataset.itemIndex;

    let productIds = [];
    productIds.push(this.state.cartGoods[itemIndex].productId);
    if (!this.state.isEditCart) {
      cartChecked({
        productIds: productIds,
        isChecked: this.state.cartGoods[itemIndex].checked ? 0 : 1,
      }).then((res) => {
        this.setState({
          cartGoods: res.cartList,
          cartTotal: res.cartTotal,
        });

        this.setState({
          checkedAllStatus: this.isCheckedAll(),
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.state.cartGoods.map(function (
        element,
        index,
        array
      ) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      this.setState({
        cartGoods: tmpCartData,
        checkedAllStatus: this.isCheckedAll(),
        "cartTotal.checkedGoodsCount": this.getCheckedGoodsCount(),
      });
    }
  };

  getCheckedGoodsTotal = () => {};

  onCheckBoxChange = (e) => {
    let total = 0;
    this.state.cartGoods.forEach((item) => {
      if (e.detail.value.indexOf(item.ID.toString()) != -1) {
        total += item.good.price * item.num;
      }
    });
    this.setState({
      total: total,
    });
  };

  onNumChange = (id, value) => {
    cartUpdate(id, { num: value }).then(() => {
      const goods = [...this.state.cartGoods];
      this.setState({
        cartGoods: goods.map((item) =>
          item.ID == id ? { ...item, num: value } : item
        ),
      });
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
                                  src={item.good.img}
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
