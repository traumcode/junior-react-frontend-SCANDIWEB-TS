import React from "react";
import { CommonProps, setMainStorage, ActiveAttributes } from "../../App";
import { PRODUCT_BY_ID } from "../../graphQL/Queries";
import Product from "./Product";
import styles from "../ui/Header.module.css";
import { Link } from "react-router-dom";
import ProductCategory from "./ProductCategory";

export type State = {
  isLoading: boolean;
  product?: any;
};

type Props = {
  id: string;
  amount?: number;
  activeAttributes?: ActiveAttributes;
  mode: "view" | "cart";
  setAmount?: (amount: number) => any;
  setActiveAttributes?: (attributes: Props["activeAttributes"]) => any;
  onFetch?: (product, price) => void;
};

export function getCartProuctIndex(activeAttributes: any, _cartProducts:any[], id:string) {
    let cartProducts = _cartProducts?.map(v => ({ ...v })) || [];
    return cartProducts.findIndex((p) => {
      return (
        p.id === id &&
        !Object.keys(p.activeAttributes).find(
          (attributeKey) => p.activeAttributes[attributeKey] !== (activeAttributes)[attributeKey]
        )
      );
    });
  }

export default class ProductItem extends React.Component<CommonProps & Props, State> {
  state: State = {
    isLoading: true,
  };
  _isMounted = false;

  async componentDidUpdate(prevProps) {
    await this.fetchData();

    if (this.state.isLoading) {
      this.setState({ isLoading: false });
    }

    if(prevProps.amount !== this.props.amount){
      this.props.onFetch?.(this.state.product, this.getPrice(this.state.product.prices))
    }
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }

  downloading = false;
  fetchData() {
    if (this.downloading || this.state?.product?.id === this.props.id) {
      return;
    }
    this.downloading = true;
    return this.props.client
      .query({
        query: PRODUCT_BY_ID(this.props.id),
      })
      .then((result) => {
        if (this._isMounted) {
          const product = result.data.product;
          this.setState({ product });
          this.props.onFetch?.(product, this.getPrice(product.prices))
        }
        return result;
      })
      .catch((err) => console.error(err));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * cartProducts = [
   *  { id: "iphone", amount: 1, activeAttributes: { color: "red", size: "64gb" }  }
   * ]
   */

  getCartProuctIndex(_activeAttributes?: any) {
    const {
      id,
      activeAttributes,
      mainStorage: { cartProducts = [] },
    } = this.props;
    return getCartProuctIndex(_activeAttributes || activeAttributes, cartProducts, id);
  }

  increment = (value: 1 | -1) => {
    const {
      mainStorage: { cartProducts = [] },
    } = this.props;
    const productIndex = this.getCartProuctIndex();
    const product = cartProducts[productIndex];
    product.amount = product.amount + value;
    if (product.amount <= 0) {
      cartProducts.splice(productIndex, 1);
    }
    setMainStorage({ cartProducts });
  };

  setActiveAttributes(activeAttributes: ActiveAttributes) {
    const {
      id,
      mainStorage: { cartProducts: _cartProducts = [] },
    } = this.props;
    let cartProducts = _cartProducts?.map(v => ({ ...v })) || [];
    const productIndex = this.getCartProuctIndex();
    const duplicateCategoryIndex = this.getCartProuctIndex(activeAttributes);
    const product = cartProducts[productIndex];

    if (duplicateCategoryIndex > -1 && duplicateCategoryIndex !== productIndex) {
      const duplicateProduct = cartProducts[duplicateCategoryIndex];
      product.amount += duplicateProduct.amount;
      cartProducts.splice(duplicateCategoryIndex, 1);
    } else {
      // cartProducts.push({ id, activeAttributes, prices: [] as any, amount: 1 })
    }

    product.activeAttributes = activeAttributes;
    setMainStorage({ cartProducts });
  }

  getPrice(prices){
    return prices.find((price) => price.currency === this.props.mainStorage.currency)?.amount * this.props?.amount;
  }

  getProductPrice(prices){
      return prices.find((price) => price.currency === this.props.mainStorage.currency)?.amount
  }

  render() {
    let count = 0;

    const { product } = this.state;
    if (!this.state.product) {
      return null;
    }
    if (this.props.mode === "view") {
      return (
        <div>
          <Product {...this.state.product}></Product>
        </div>
      );
    } else {
      return (
        <div key={product.id}>
          <div className={styles.dropDownShoppingCartItemContainer}>
            <div className={styles.itemNamePrice}>
              <Link className={styles.link} to={{ pathname: `/product/${product.id}` }}>
                <div className={styles.name}>
                  {product.name}
                  {product.brand}
                </div>
              </Link>
              <div className={styles.price}>
                {this.getProductPrice(product.prices).toFixed(2)}
              </div>
            </div>

            <div className={styles.itemQuantity}>
              <div>
                <button onClick={() => this.increment(1)} className={styles.buttonQuantity}>
                  +
                </button>
              </div>
              <div>{this.props.amount}</div>
              <div>
                <button onClick={() => this.increment(-1)} className={styles.buttonQuantity}>
                  -
                </button>
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
          <ProductCategory
              isCartMode={false}
              setActiveAttributes={(attributes) => this.setActiveAttributes(attributes)}
              attributes={product.attributes}
              activeAttributes={this.props.activeAttributes}
              client={this.props.client}
              mainStorage={this.props.mainStorage}
            />
        </div>
      );
    }
  }
}
