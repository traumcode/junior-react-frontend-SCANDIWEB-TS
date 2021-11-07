import React from "react";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Layout from "./components/ui/Layout";
import { render } from "react-dom";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, NormalizedCacheObject } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Cart from "./pages/Cart";
import { currencyToSign } from "./components/products/Product";

export function setMainStorage(Obj) {
  const mainStorage = JSON.parse(localStorage.getItem("mainStorage") || "{}");
  const newState = { ...mainStorage, ...Obj };
  console.log(newState);
  localStorage.setItem("mainStorage", JSON.stringify(newState));
  window.dispatchEvent(new Event("storage"));
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, path }) => {
      return alert(`GraphQL error ${message}`);
    });
  }
});

const link = from([errorLink, new HttpLink({ uri: "http://localhost:4000/" })]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

export type PersistedState = Partial<{
  category: string,
  currency: keyof typeof currencyToSign;
  cartProducts: {
    id: string;
    amount: number;
    activeAttributes: Record<string, any>;
    price:number;
    name:string;
    brand:string;
    gallery:any;
  }[];
}>;

export type CommonProps = {
  mainStorage: PersistedState;
  client: ApolloClient<NormalizedCacheObject>;
};

type Props = {};

export type State = {
  mainStorage: PersistedState;
};

export default class App extends React.Component<Props, State> {
  state: State = {
    mainStorage: {
      currency: undefined,
      category:undefined,
    },
  };
  _isMounted = true;

  componentDidMount() {
    window.addEventListener("storage", () => {
      const mainStorage = JSON.parse(window.localStorage.getItem("mainStorage"));
      if (this._isMounted) {
        this.setState({
          mainStorage: mainStorage || {},
        });
      }
    });
    window.dispatchEvent(new Event("storage"));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { mainStorage = {} } = this.state;

    return (
      <ApolloProvider client={client}>
        <Router>
          <Layout mainStorage={mainStorage} client={client}>
            <Switch>
              <Route path="/" exact>
                <Home client={client} mainStorage={mainStorage}></Home>
              </Route>
              <Route
                path="/category/:category"
                render={(props) => <Home {...props} client={client} mainStorage={mainStorage}></Home>}
                exact
              ></Route>
              <Route
                path={`/product/:id`}
                render={(props) => <ProductPage {...props} mainStorage={mainStorage} client={client} />}
              />
              <Route path={`/cart`} render={(props) => <Cart {...props} mainStorage={mainStorage} client={client} />} />
            </Switch>
          </Layout>
        </Router>
      </ApolloProvider>
    );
  }
}
render(<App />, window.document.getElementById("root"));
