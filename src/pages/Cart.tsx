import React from "react";
import { CommonProps, PersistedState } from "../App";
import Product from "../components/products/Product";
import { PRODUCT_BY_ID } from "../graphQL/Queries";

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
    console.log(this.products);
    console.log(this.props.mainStorage.cartProducts);

    return (
      <div>
        {(this.props.mainStorage?.cartProducts || []).map((product) => {
          return (
            //   <div>{product.id}</div>
            <Product {...this.products[product.id]} />
          );
        })}
      </div>
    );
  }
}
