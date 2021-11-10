import React from "react";
import { CommonProps } from "../App";
import Product from "../components/products/Product";
import { PRODUCT_BY_ID } from "../graphQL/Queries";
import styles from "./Cart.module.css";
import { setMainStorage } from "../App";
import { getPrice } from "../components/products/Product";
import ProductItem from "../components/products/ProductItem";

export function incrementAmount(productId, cartProducts, activeAttributes, prices, name, brand, gallery, attributes, inStock, price) {
  const product = cartProducts.find(({ id }) => id === productId);
  if (cartProducts.find((id) => id.id === productId)) {
    let newState: any = [];
    newState = cartProducts.filter((id) => id.id !== productId) || {};
    let amount = cartProducts.filter((id) => id.id === productId)[0].amount;
    amount += 1;

    setMainStorage({
      cartProducts: [
        {
          id: productId,
          amount: amount,
          activeAttributes: activeAttributes,
          prices: parseInt(getPrice(price, "USD").split("$ ")[1]),
          price: prices,
          name: name,
          brand: brand,
          gallery: gallery,
          attributes: attributes,
          inStock: true,
        },
        ...(newState || []),
      ],
    });
  }
}
export function decrementAmount(productId, cartProducts, activeAttributes, prices, name, brand, gallery, attributes, inStock, price) {
  if (cartProducts.find((id) => id.id === productId)) {
    let newState: any = [];
    newState = cartProducts.filter((id) => id.id !== productId) || {};
    let amount = cartProducts.filter((id) => id.id === productId)[0].amount;
    amount -= 1;

    if (amount <= 0) {
      setMainStorage({
        cartProducts: [...(newState || [])],
      });
    } else {
      setMainStorage({
        cartProducts: [
          ...(newState || []),

          {
            id: productId,
            amount: amount,
            activeAttributes: activeAttributes,
            prices: parseInt(getPrice(price, "USD").split("$ ")[1]),
            price: prices,
            name: name,
            brand: brand,
            gallery: gallery,
            attributes: attributes,
            inStock: true,
          },
        ],
      });
    }
  }
}

export default class Cart extends React.Component<CommonProps> {
  state = {
    isLoading: true,
  };
  products = {};
  _isMounted = false;

  async componentDidUpdate() {
    const { cartProducts = [] } = this.props.mainStorage;
    for await (const product of cartProducts) {
      if (!this.products[product.id]) {
        await this.fetchData(product.id);
      }
    }
    if (this.state.isLoading) {
      this.setState({ isLoading: false });
    }
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchData(1);
  }

  fetchData(id) {
    return this.props.client
      .query({
        query: PRODUCT_BY_ID(id),
      })
      .then((result) => {
        if (this._isMounted) {
          this.products[id] = result.data.product;
          /*
          because there is too little information, the fetch is very fast and it is impossible for the loading bar to appear,
          so I put a 2 second timer just to show this beautiful bar 
          
          ^_^
          
          */
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 500);
        }
        return result;
      })
      .catch((err) => console.error(err));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {

    return (
      <div className={styles.mainContainer}>
        <div className={styles.categoryNameContainer}>
          <h2 className={styles.categoryName}>CART</h2>
        </div>

        {(this.props?.mainStorage?.cartProducts || [])
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((product, index) => {
            return (
              <ProductItem
                key={index}
                id={product.id}
                mode={"cart" as any}
                client={this.props.client}
                mainStorage={this.props.mainStorage}
                activeAttributes={product.activeAttributes}
                amount={product.amount}
              />
            );
          })}
      </div>
    );
  }
}