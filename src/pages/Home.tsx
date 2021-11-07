import React from "react";
import styles from "./Home.module.css";
import { LOAD_PRODUCTS } from "../graphQL/Queries";
import Product from "../components/products/Product";
import { CommonProps } from "../App";

type State = {
  isLoading: boolean;
  currentCategory: string;
  result?: {
    loading: boolean;
    data: {
      categories: any[];
    };
  };
};

export default class Home extends React.Component<CommonProps, State> {
  state: State = {
    isLoading: true,
    currentCategory: "All products",
    result: undefined,
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }

  fetchData() {
    this.props.client
      .query({
        query: LOAD_PRODUCTS,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ result });

          /*
          because there is too little information, the fetch is very fast and it is impossible for the loading bar to appear,
          so I put a 2 second timer just to show this beautiful bar 
          
          ^_^
          
          */
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 500);
        }
      })
      .catch((err) => console.error(err));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  displayProducts() {
    if (this.state.result?.loading) {
      return <div>LOADING</div>;
    } else if (this.props?.mainStorage?.category !== "home") {
      return this.state.result?.data.categories.map((category) => {
        return category?.products.map((product, index) => {
          if (product.category === this.props?.mainStorage?.category) {
            return (
              <Product
                key={index}
                id={product.id}
                inStock={product.inStock}
                prices={product.prices}
                currency={this.props.mainStorage.currency}
                image={product.gallery[0]}
                name={product.name}
                attributes={product.attributes}
              ></Product>
            );
          }
          return null;
        });
      });
    }
    return this.state.result?.data.categories.map((category) => {
      return category?.products.map((product, index) => {
        return (
          <Product
            key={index}
            id={product.id}
            inStock={product.inStock}
            prices={product.prices}
            currency={this.props.mainStorage.currency}
            image={product.gallery[0]}
            name={product.name}
            attributes={product.attributes}
          ></Product>
        );
      });
    });
  }

  render() {
    if (!this.props.mainStorage) {
      return <div>LOADING</div>;
    }
    if (this.state.isLoading) return <div className={styles.loadingBar}></div>;
    return (
      <div className={styles.mainContainer}>
        <div className={styles.categoryNameContainer}>
          <h2 className={styles.categoryName}>{this.props?.mainStorage?.category?.toLocaleUpperCase()}</h2>
        </div>
        <div className={styles.productContainer}>{this.displayProducts()}</div>
      </div>
    );
  }
}
