import React from "react";
import styled from "styled-components";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { currencyToSign } from "../products/Product";
import { ReactComponent as BrandSvg } from "../../resources/brand.svg";
import { ReactComponent as CartSvg } from "../../resources/cart.svg";
import { CommonProps, setMainStorage } from "../../App";

import { LOAD_CATEGORIES } from "../../graphQL/Queries";
import { LayoutState } from "./Layout";
import ProductItem from "../products/ProductItem";

const Head = styled.div`
  height: 80px;
  background-color: #ffffff;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
  display: flex;
  margin: 0;
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

type State = {
  cartInfo: any;
  cartTotal: number;
  result?: any;
  prices?: Record<string, number>;
};

export default class Header extends React.Component<
  CommonProps & Pick<LayoutState, "show"> & { setShow: (show: LayoutState["show"]) => any },
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      cartInfo: {},
      cartTotal: 0,
      prices: {},
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
    this.props.mainStorage?.cartProducts?.forEach((product) => (total += product.prices));
    return total;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let total = 0;
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
                      this.props.setShow(null);
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
                          this.props.setShow(null);
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
                <button className={styles.currencyButton} onClick={() => this.props.setShow("currency")}>
                  <h3>{currencyToSign[this.props.mainStorage?.currency] || "$"}</h3>
                </button>
                {this.props.show === "currency" ? (
                  <div className={styles.currencyContent}>
                    {Object.keys(currencyToSign).map((currency, index) => {
                      return (
                        <button
                          key={index}
                          className={styles.currencyButton}
                          onClick={() => {
                            setMainStorage({ currency });
                            this.props.setShow(null);
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
                ) : (
                  ""
                )}
              </div>
              <div
                onClick={() => {
                  this.props.setShow(this.props.show === "cart" ? null : "cart");
                  setMainStorage({isCartMode: true})
                }}
                className={styles.shoppingCartButtonContainer}
              >
                <button className={styles.shoppingCartButton}>
                  <CartSvg />
                  <span className={styles.totalItems}>{this.props.mainStorage.cartProducts?.reduce((a, v) => a + v.amount, 0) || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </Head>
        {this.props.show === "cart" ? (
          this.props.mainStorage?.cartProducts?.length ? (
            <div className={styles.dropDownShoppingCart}>
              <div className={styles.dropDownShoppingCartTitle}>
                <h3>My Bag, {this.props.mainStorage.cartProducts?.reduce((a, v) => a + v.amount, 0)} items</h3>
              </div>
              <div className={styles.itemsContainer}>
                {this.props.mainStorage?.cartProducts
                  ?.sort((a, b) => a.id.localeCompare(b.id))
                  .map((product, index) => {
                    total += product.prices * product.amount;

                    return (
                      <div key={index}>
                        <ProductItem
                          key={index}
                          {...this.props}
                          id={product.id}
                          amount={product.amount}
                          activeAttributes={product.activeAttributes}
                          mode={"cart"}
                          onFetch={(product, price) => {
                            this.setState({
                              prices: {
                                ...this.state.prices,
                                [index]: price,
                              },
                            });
                          }}
                        ></ProductItem>
                      </div>
                    );
                  })}
              </div>
              <div className={styles.bottomContainer}>
                <div className={styles.totalPriceContainer}>
                  <h3 className={styles.totalPrice}>Total</h3>
                  <h3>
                    {Object.values(this.state.prices)
                      .reduce((a, v) => a + v, 0)
                      .toFixed(2)}
                  </h3>
                  <h3 className={styles.totalPrice}>$ {total}</h3>
                </div>
                <div className={styles.dropDownShoppingCartButtonContainer}>
                  <div>
                    <Link to={{ pathname: "/cart", state: {mode:"cart"} }}>
                      <button
                        onClick={() => {
                          this.props.setShow(null);
                          setMainStorage({ category: "" });    
                        }}
                        className={styles.viewBag}
                      >
                        VIEW BAG
                      </button>
                    </Link>
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
                <h3>0 items</h3>
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
