import React from "react";
import styles from "./Card.module.css";

const Card = ({ children }) => {
  return <div className={styles.mainCard}>{children}</div>;
};

export default Card;
