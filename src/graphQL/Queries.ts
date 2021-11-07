import { gql } from "@apollo/client";

export const LOAD_PRODUCTS = gql`
  query {
    categories {
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency
          amount
        }
        brand
      }
    }
  }
`;
export const LOAD_CLOTHES = gql`
  query {
    category(input: { title: "clothes" }) {
      name
      products {
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency
          amount
        }
        brand
      }
    }
  }
`;
export const LOAD_TECH = gql`
  query {
    category(input: { title: "tech" }) {
      name
      products {
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency
          amount
        }
        brand
      }
    }
  }
`;

export const PRODUCT_BY_ID = (productId) => gql`
query {
  product(id:"${productId}"){
    id
    name
    inStock
    gallery
    description
    category
    attributes{
      id
      name
      type
      items{
        displayValue
        value
        id
      }
    }
    prices{
      currency
      amount
    }
    brand
    
  }
}
`;

export const LOAD_CATEGORIES = gql`
  query {
    categories {
      name
    }
  }
`;
