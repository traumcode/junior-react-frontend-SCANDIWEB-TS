import React from "react";
import { CommonProps } from "../App";
import Product from "../components/products/Product";
import { PRODUCT_BY_ID } from "../graphQL/Queries";
import styles from "./Cart.module.css";

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
      <div>
        <div className={styles.mainContainer}>
          <div className={styles.categoryNameContainer}>
            <h2 className={styles.categoryName}>CART</h2>
          </div>

          {(this.props?.mainStorage?.cartProducts || []).map((product, index) => {
            console.log(product);

            return (
              <div className={styles.productContainer}>
                <div className={styles.titlePriceAttributeContainer}>
                  <div className={styles.name}>
                    <h3>{product.name}</h3>
                  </div>
                  <div className={styles.brand}>{product.brand}</div>
                  <div className={styles.price}>$ {product.prices}</div>
                </div>
                <div className={styles.quantityPhotoContainer}>
                  <div className={styles.quantityContainer}>
                    <div className={styles.plus}>+</div>
                    <div className={styles.quantity}>1</div>
                    <div className={styles.minus}>-</div>
                  </div>
                  <div className={styles.photoContainer}>
                    <img className={styles.photo} src={product.gallery[0]} alt={product.name}></img>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
