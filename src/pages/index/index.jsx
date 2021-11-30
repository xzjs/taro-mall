import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  View,
  Text,
  Navigator,
  Swiper,
  SwiperItem,
  Image,
  ScrollView,
  Block,
} from "@tarojs/components";
import { connect } from "react-redux";
import { AtIcon, AtTag, AtButton } from "taro-ui";
// import { TabBar } from '../../components';
import { get as getGlobalData } from "../../global_data";
import { couponReceive } from "../../services/coupon";
import {
  Home,
  HomeSelected,
  Category,
  CartSelected,
  Cart,
  CategorySelected,
  My,
  MySelected,
} from "../..//static/images";

import "./index.less";
import { addCart } from "../../services/cart";
import { baseURL } from "../../utils/img";

@connect(({ home, goods, config }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
  theme: config.theme,
}))
class Index extends PureComponent {
  $instance = getCurrentInstance();
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({ type: "home/getIndex" });
  };

  onPullDownRefresh() {
    Taro.showNavigationBarLoading(); //在标题栏中显示加载
    this.getData();
    Taro.hideNavigationBarLoading(); //完成停止加载
    Taro.stopPullDownRefresh(); //停止下拉刷新
  }

  componentDidShow = () => {
    this.getData();
  };

  componentWillMount() {
    // 页面初始化 options为页面跳转所带来的参数
    let { scene, grouponId, goodId, orderId } = this.$instance.router.params;
    if (scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      scene = decodeURIComponent(scene);
      console.log("scene:" + scene);

      let info_arr = [];
      info_arr = scene.split(",");
      let _type = info_arr[0];
      let id = info_arr[1];

      if (_type == "goods") {
        Taro.navigateTo({
          url: "../goods/goods?id=" + id,
        });
      } else if (_type == "groupon") {
        Taro.navigateTo({
          url: "../goods/goods?grouponId=" + id,
        });
      } else {
        Taro.navigateTo({
          url: "../index/index",
        });
      }
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (grouponId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: "../goods/goods?grouponId=" + grouponId,
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (goodId) {
      //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: "../goods/goods?id=" + goodId,
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (orderId) {
      //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: "../ucenter/orderDetail/orderDetail?id=" + orderId,
      });
    }

    this.getData();
  }

  onShareAppMessage() {
    return {
      title: "Taro mall小程序商场",
      desc: "Taro 开源微信小程序商城",
      path: "/pages/index/index",
    };
  }

  getCoupon = (e) => {
    if (!getGlobalData("hasLogin")) {
      Taro.navigateTo({
        url: "/pages/auth/login/login",
      });
    }

    let couponId = e.currentTarget.dataset.index;
    couponReceive({
      couponId: couponId,
    }).then(() => {
      Taro.showToast({
        title: "领取成功",
      });
    });
  };

  imageClick = (goodID) => {
    console.log(goodID);
    addCart({ good_id: goodID })
      .then(() => {
        Taro.showToast({ title: "添加成功" });
      })
      .catch((err) => {
        Taro.showToast({ title: err.data });
      });
  };

  render() {
    const { data } = this.props;
    return (
      <Block>
        <View className="bar-container container">
          {data && data.length > 0 && (
            <View className="a-section a-popular">
              <View className="b">
                {data.map((item) => {
                  return (
                    <View className="item" key={item.ID}>
                      <Image className="img" src={baseURL + item.img}></Image>
                      <View className="right">
                        <View className="text">
                          <Text className="name">{item.name}</Text>
                          <Text className="desc">{item.description}</Text>
                          <Text className="price">￥{item.price}</Text>
                          <Image
                            src={Cart}
                            className="cart"
                            onClick={() => {
                              this.imageClick(item.ID);
                            }}
                          ></Image>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </Block>
    );
  }
}

export default Index;
