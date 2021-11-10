import React from "react";
import { CommonProps, State } from "../../App";
import Header from "./Header";
import styles from "./Layout.module.css";

export type LayoutState = {
  show: "cart" | "currency" | null;
};

export default class Layout extends React.Component<CommonProps, LayoutState> {
  state: LayoutState = {
    show: null,
  };

  render() {
    return (
      <div>
        <div>
          <Header {...this.props} show={this.state.show} setShow={(show) => this.setState({ show })} />
          <main style={{ position: "relative", zIndex: 0 }}>
            <div
              onClick={() => this.setState({ show: null })}
              style={this.state.show ? { position: "absolute", inset: "0", zIndex: 1, backgroundColor: this.state.show === "currency" ? "transparent" : "rgba(57, 55, 72, 0.22)" } : {}}
            ></div>
            <div>{this.props.children}</div>
          </main>
        </div>
      </div>
    );
  }
}
