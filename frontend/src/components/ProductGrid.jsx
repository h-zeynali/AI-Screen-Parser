import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, refs }) => (
  <div className="product-grid">
    {products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        ref={el => (refs.current[product.id] = el)}
      />
    ))}
  </div>
);

export default ProductGrid;
