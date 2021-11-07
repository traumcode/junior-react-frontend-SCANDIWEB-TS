import React from "react";
import styled from "styled-components";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { currencyToSign } from "../products/Product";
import { ReactComponent as BrandSvg } from "../../resources/brand.svg";
import { ReactComponent as CartSvg } from "../../resources/cart.svg";
import { CommonProps, setMainStorage } from "../../App";
import { RouteComponentProps, StaticContext } from "react-router";

import { LOAD_CATEGORIES } from "../../graphQL/Queries";

const Head = styled.div`
  height: 80px;
  background-color: #ffffff;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
  display: flex;
`;

const CategoryButton = styled.button`
  all: unset;
  position: static;
  height: 20px;
  left: 0;
  right: 0;

  font-style: normal;
  font-size: 16px;
  line-height: 19.2px;

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 30px 0px;
  cursor: pointer;
`;

export default class Header extends React.Component<
  CommonProps & RouteComponentProps<{ [x: string]: string }, StaticContext, unknown>,
  any
> {
  constructor(props) {
    super(props);
    this.state = {
      isCurrencyMenuDown: false,
      isCartMenuDown: false,
      cartInfo: {},
      cartTotal: 0,
    };
  }
  _isMounted = true;

  componentDidMount() {
    this._isMounted = true;
    this.categories();
  }

  categories() {
    this.props.client
      .query({ query: LOAD_CATEGORIES })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ result });
        }
      })
      .catch((error) => console.error(error));
  }
  calculateTotal() {
    let total = 0;
    this.props.mainStorage?.cartProducts?.forEach((product) => (total += product.price));
    return total;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        <Head>
          <nav className={styles.navigation}>
            <div className={styles.category}>
              <div
                style={
                  this.props?.mainStorage?.category === "home"
                    ? { borderBottom: "2px solid #5ece7b", color: " #5ece7b", fontWeight: 600 }
                    : { border: "none" }
                }
              >
                <Link className={styles.link} to={{ pathname: "/" }}>
                  <CategoryButton
                    onClick={() => {
                      setMainStorage({ category: "home" });
                    }}
                  >
                    HOME
                  </CategoryButton>
                </Link>
              </div>
              {this.state.result?.data.categories.map((category, index) => {
                return (
                  <div
                    key={index}
                    style={
                      this.props?.mainStorage?.category === category.name
                        ? { borderBottom: "2px solid #5ece7b", color: " #5ece7b", fontWeight: 600 }
                        : { border: "none" }
                    }
                  >
                    <Link className={styles.link} to={{ pathname: `/category/${category.name}` }}>
                      <CategoryButton
                        onClick={() => {
                          setMainStorage({ category: category.name });
                        }}
                      >
                        {category.name.toUpperCase()}
                      </CategoryButton>
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>
          <div className={styles.logoContainer}>
            <BrandSvg />
          </div>
          <div className={styles.shoppingCartAndCurrencyContainer}>
            <div className={styles.smallContainer}>
              <div className={styles.currencyButtonContainer}>
                <button
                  className={styles.currencyButton}
                  onClick={() => this.setState({ isCurrencyMenuDown: !this.state.isCurrencyMenuDown })}
                >
                  <h3>{currencyToSign[this.props.mainStorage?.currency] || "$"}</h3>
                </button>
                <div className={styles.currencyContent}>
                  {Object.keys(currencyToSign).map((currency, index) => {
                    return (
                      <button
                        key={index}
                        className={styles.currencyButton}
                        onClick={() => {
                          setMainStorage({ currency });
                        }}
                      >
                        <h3 className={styles.currencyButtonText}>
                          {currencyToSign[currency]}
                          {currency}
                        </h3>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                onClick={() => {
                  this.setState({ isCartMenuDown: !this.state.isCartMenuDown });
                }}
                className={styles.shoppingCartButtonContainer}
              >
                <button className={styles.shoppingCartButton}>
                  <CartSvg />
                  <span className={styles.totalItems}>{this.props.mainStorage?.cartProducts?.length || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </Head>
        {this.state.isCartMenuDown ? (
          this.props.mainStorage?.cartProducts?.length ? (
            <div className={styles.dropDownShoppingCart}>
              <div className={styles.dropDownShoppingCartTitle}>
                <h3>My Bag, {this.props.mainStorage.cartProducts?.length} items</h3>
              </div>
              <div className={styles.itemsContainer}>
                {this.props.mainStorage?.cartProducts?.map((product, index) => {
                  let count = 0;

                  return (
                    <div key={index}>
                      <div className={styles.dropDownShoppingCartItemContainer}>
                        <div className={styles.itemNamePrice}>
                          <div className={styles.name}>
                            {product.name}
                            {product.brand}
                          </div>
                          <div className={styles.price}>$ {product.price}</div>
                        </div>
                        <div className={styles.itemQuantity}>
                          <div>
                            <button className={styles.buttonQuantity}>+</button>
                          </div>
                          <div>1</div>
                          <div>
                            <button className={styles.buttonQuantity}>-</button>
                          </div>
                        </div>
                        <div className={styles.itemImage}>
                          {product?.gallery?.map((photo) => {
                            if (count === 0) {
                              count += 1;
                              return <img className={styles.image} src={photo} alt={product.name}></img>;
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.bottomContainer}>
                <div className={styles.totalPriceContainer}>
                  <h3 className={styles.totalPrice}>Total</h3>
                  <h3 className={styles.totalPrice}>$ {this.calculateTotal()}</h3>
                </div>
                <div className={styles.dropDownShoppingCartButtonContainer}>
                  <div>
                    <button className={styles.viewBag}>VIEW BAG</button>
                  </div>
                  <div>
                    <button className={styles.checkout}>CHECK OUT</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.dropDownShoppingCart}>
              <div className={styles.dropDownShoppingCartTitle}>
                <h3>0 {this.props.mainStorage.cartProducts?.length} items</h3>
              </div>
              <div className={styles.itemsContainer}>
                {this.props.mainStorage?.cartProducts?.map((product, index) => {
                  return (  
                    <div key={index}>
                      <div className={styles.dropDownShoppingCartItemContainer}>
                        <div className={styles.itemNamePrice}>
                          <div className={styles.name}>
                            {product.name}
                            {product.brand}
                          </div>
                          <div className={styles.price}>$ {product.price}</div>
                        </div>
                        <div className={styles.itemQuantity}>
                          <div>
                            <button className={styles.buttonQuantity}>+</button>
                          </div>
                          <div>1</div>
                          <div>
                            <button className={styles.buttonQuantity}>-</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    );
  }
}
