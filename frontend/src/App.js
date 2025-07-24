import React, { useRef, useState } from "react";
import "./styles/App.css";
import products from "./data/products";
import ProductGrid from "./components/ProductGrid";
import useVisibleProducts from "./hooks/useVisibleProducts";





function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const refs = useRef({});
  const visibleProducts = useVisibleProducts(products, refs);

  const handleSubmit = async () => {
    if (!question) return;
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        visible_products: visibleProducts,
      }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div className="app">
      <h1>🛍️ Explore Our Products</h1>
      <div className="input-section">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Any questions about the products in the showcase ..."
        />
        <button onClick={handleSubmit}>Ask</button>
      </div>
      {answer && <div className="answer">{answer}</div>}
      <ProductGrid products={products} refs={refs} />
    </div>
  );
}

export default App;
