import React from "react";
import { CommonProps } from "../../App";
import styless from "../../pages/ProductPage.module.css";
import classes from "./ProductCategory.module.css";

export default class ProductCategory extends React.Component<
  CommonProps & {
    attributes: any;
    activeAttributes: any;
    setActiveAttributes?: (attributes) => any;
    isCartMode: boolean;
  }
> {
  render() {
    const { activeAttributes, isCartMode } = this.props;
    const styles = isCartMode ? classes : styless
    

    return (
      <div className={styles.mainAttributeContainer}>
        {this.props?.attributes.length > 0
          ? this.props?.attributes.map((attribute, aindex) => {
              return (
                <div key={aindex}>
                  <div className={styles.productAttributeTitle}>
                    <h4>{attribute.name.toUpperCase()}:</h4>
                  </div>
                  <div className={styles.attributeButtonContainer}>
                    {attribute.type === "swatch"
                      ? attribute?.items.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={item.value === activeAttributes?.[attribute.type] ? styles.selectedContainer: ""}
                              onClick={() => {
                                this.props.setActiveAttributes({ ...activeAttributes, [attribute.name]: item.value })
                              }}
                            >
                              <label>
                                <div
                                  className={styles.attributeValueColorContainer}
                                  style={{
                                    backgroundColor: `${item.value}`
                                  }}
                                ></div>
                                <span className={styles.attributeSizeButtonText}></span>
                              </label>
                            </div>
                          );
                        })
                      : attribute?.items.map((item, index) => {
                          return (
                            <div key={index}>
                              <div
                                onClick={() => {
                                    this.props.setActiveAttributes({ ...activeAttributes, [attribute.name]: item.value })
                                }}
                                className={styles.attributeValueContainer}
                                style={
                                  item.value === activeAttributes?.[attribute.name] ? { backgroundColor: "black", color: "white" } : {}
                                }
                              >
                                <label key={index}>
                                  <h4 className={styles.attributeSizeButtonText}>{item.displayValue}</h4>
                                </label>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}
