import React from "react";
import "./ProductCard.css"; // you can create scoped styles here

const ProductCard = React.forwardRef(({ product }, ref) => (
  <div className="product-card" ref={ref}>
    <img src={product.image} alt={product.title} />
    <h3>{product.title}</h3>
    <p>{product.brand}</p>
    <p>{product.price}</p>
  </div>
));

export default ProductCard;
