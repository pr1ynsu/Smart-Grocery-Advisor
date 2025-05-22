import React from 'react';

function ItemCard({ item, onAdd }) {
  return (
    <div style={{ border: '1px solid gray', padding: 10, margin: 10, borderRadius: 8 }}>
      <img src={item.image} alt={item.name} width="100" />
      <h4>{item.name}</h4>
      <p>Protein: {item.protein}g</p>
      <p>Carbs: {item.carbs}g</p>
      <p>Fats: {item.fats}g</p>
      <p>Calories: {item.calories} kcal</p>
      <button onClick={() => onAdd(item)}>Add to Cart</button>
    </div>
  );
}

export default ItemCard;
