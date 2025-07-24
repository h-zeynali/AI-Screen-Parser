import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const products = [
  { id: 1, title: "Blue Adidas Shoes", price: "$99", brand: "Adidas", image: "/shoes1.jpg" },
  { id: 2, title: "Nike Running Shoes", price: "$120", brand: "Nike", image: "/shoes2.jpg" },
  { id: 3, title: "Puma Sneakers", price: "$85", brand: "Puma", image: "/shoes3.jpg" },
  { id: 4, title: "Reebok Trainers", price: "$110", brand: "Reebok", image: "/shoes4.jpg" },
  { id: 5, title: "Converse Classic", price: "$75", brand: "Converse", image: "/shoes5.jpg" },
  { id: 6, title: "Asics Gel", price: "$130", brand: "Asics", image: "/shoes6.jpg" },
];

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [visibleProducts, setVisibleProducts] = useState([]);
  const refs = useRef({});

  useEffect(() => {
    const handleScrollOrResize = () => {
      const vpHeight = window.innerHeight;
      const vpWidth = window.innerWidth;

      const visibles = products.map(product => {
        const rect = refs.current[product.id]?.getBoundingClientRect();
        if (!rect) return null;

        const isVisible = rect.top >= 0 && rect.bottom <= vpHeight &&
                          rect.left >= 0 && rect.right <= vpWidth;

        return isVisible ? product : null;
      }).filter(p => p !== null);

      setVisibleProducts(visibles);
    };

    handleScrollOrResize();
    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, visible_products: visibleProducts }),
    });
    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <div className="app">
      <h1>Store Products</h1>
      <input
        type="text"
        value={question}
        placeholder="Ask a question about visible products"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleSubmit}>Ask</button>
      {answer && <div className="answer">{answer}</div>}
      <div className="grid">
        {products.map(product => (
          <div
            className="card"
            key={product.id}
            ref={el => refs.current[product.id] = el}
          >
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.brand}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
