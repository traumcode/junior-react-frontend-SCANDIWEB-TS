import React from "react";
import { CommonProps } from "../../App";
import Header from "./Header";
import styles from "./Layout.module.css";

export default class Layout extends React.Component<CommonProps> {
  state = {};

  render() {
    return (
      <div>
        <div>
          <Header {...(this.props as any) }/>
          <main>
            <div className={styles.container} >{this.props.children}</div>
          </main>
        </div>
      </div>
    );
  }
}
