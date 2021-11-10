import React from "react";
import { Link } from "react-router-dom";
import styles from "./Product.module.css";
import { ReactComponent as CircleCart } from "../../resources/circleCart.svg";
import { setMainStorage } from "../../App";
import { getCartProuctIndex } from "./ProductItem";

export const currencyToSign = {
  GBP: "£",
  AUD: "AU$",
  JPY: "¥",
  RUB: "₽",
  USD: "$",
} as const;

export const getPrice = (prices = [], currency = "USD") => {
  let price = prices.find((item) => item.currency === currency);
  const currencySign = currencyToSign[price?.currency];
  return currencySign + " " + (price.amount || "?");
};

export default class Product extends React.Component<{
  id: string;
  brand: string;
  inStock: boolean;
  name: string;
  image: string;
  prices: any;
  currency: string;
}> {
  // buttonHandler(productId) {
  //   const { activeAttributes } = this.state;

  //   if (Object.keys(activeAttributes).length === this.state.attributes.length) {
  //     const cartProducts = this.props.mainStorage?.cartProducts || []
  //     const productIndex = getCartProuctIndex(activeAttributes,this.props.mainStorage?.cartProducts, productId);
  //     const product: any = cartProducts?.[productIndex] || {id:productId, activeAttributes, amount:0, prices: [] };
  //     product.amount++;

  //     if(productIndex > -1) {
  //       cartProducts[productIndex] = product
  //     } else {
  //       cartProducts.push(product);

  //     }
  //     setMainStorage({cartProducts});
  //   } else {
  //     this.setState({ modalState: true });
  //   }
  // }
  addToCard(productId) {
    let mainStorage = JSON.parse(window.localStorage.getItem("mainStorage"));
    const cartProducts = mainStorage.cartProducts || [];
    let product = {
      activeAttributes: {},
      amount: 1,
      id: productId,
      prices: [],
    };
    cartProducts.push(product);
    console.log(cartProducts);
    setMainStorage({ cartProducts });
  }

  render() {
    return (
      <div className={`${!this.props.inStock ? styles.productIsOutOfStock : ""} ${styles.productCard}`}>
        <Link
          className={styles.link}
          to={{
            pathname: `/product/${this.props.id}`,
            state: {
              id: this.props.id,
            },
          }}
        >
          <div className={styles.imageContainer}>
            <img className={styles.productImage} src={this.props.image} alt="item" />
            <h3 className={`${!this.props.inStock ? styles.textOutOfStock : styles.productHide}`}>OUT OF STOCK</h3>
          </div>
        </Link>
        <div onClick={() => this.addToCard(this.props.id)} className={styles.cardContent}>
          <CircleCart className={styles.cartCircle}></CircleCart>
          <Link
            className={styles.link}
            to={{
              pathname: `/product/${this.props.id}`,
              state: {
                id: this.props.id,
              },
            }}
          >
            <h3 className={styles.productTitle}>{this.props.name}</h3>
            <h3 className={styles.productTitle}>{this.props.brand}</h3>
            <h3 className={styles.productPrice}>{getPrice(this.props?.prices, this.props.currency)}</h3>
          </Link>
        </div>
      </div>
    );
  }
}
