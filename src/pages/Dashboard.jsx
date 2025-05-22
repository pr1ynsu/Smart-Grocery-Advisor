import React, { useState } from "react";
import { packedItems, unpackedItems } from "../data/items";

function Dashboard({ userBMI }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const totalNutrition = cart.reduce(
    (acc, item) => ({
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
      calories: acc.calories + item.calories,
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );

  const getBMISuggestion = (item) => {
    if (userBMI < 18.5) return item.calories > 250 ? "✅ Good for gaining weight" : "⚠️ Too light";
    if (userBMI >= 18.5 && userBMI <= 24.9) return "✅ Balanced";
    if (userBMI > 25) return item.fats < 10 ? "✅ Low fat" : "⚠️ Avoid high fat";
    return "";
  };

  const renderItem = (item) => (
    <div key={item.id} style={styles.card}>
      <img src={item.image} alt={item.name} style={styles.image} />
      <h3>{item.name}</h3>
      <p>Calories: {item.calories}</p>
      <p>Protein: {item.protein}g | Carbs: {item.carbs}g | Fats: {item.fats}g</p>
      <p><strong>{getBMISuggestion(item)}</strong></p>
      <button onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Welcome to Smart Grocery Dashboard</h1>
      <h2>Your BMI: {userBMI}</h2>

      <div style={styles.section}>
        <h2>Packed Items</h2>
        <div style={styles.grid}>
          {packedItems.map(renderItem)}
        </div>
      </div>

      <div style={styles.section}>
        <h2>Unpacked Items</h2>
        <div style={styles.grid}>
          {unpackedItems.map(renderItem)}
        </div>
      </div>

      <div style={styles.cart}>
        <h2>Your Cart</h2>
        <p>Total Calories: {totalNutrition.calories}</p>
        <p>Total Protein: {totalNutrition.protein}g</p>
        <p>Total Carbs: {totalNutrition.carbs}g</p>
        <p>Total Fats: {totalNutrition.fats}g</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  section: { marginTop: "30px" },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    width: "200px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  cart: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #aaa",
    borderRadius: "8px",
    background: "#f9f9f9",
  },
};

export default Dashboard;
