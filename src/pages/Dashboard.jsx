import React, { useState, useMemo } from "react";
import { packedItems, unpackedItems } from "../data/items";

function Dashboard({ userBMI }) {
  // State
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPacked, setFilterPacked] = useState("both"); // packed | unpacked | both
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Combine all items
  const allItems = [...packedItems.map(i => ({ ...i, packed: true })), 
                    ...unpackedItems.map(i => ({ ...i, packed: false }))];

  // Filter and search items
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterPacked === "both" ? true :
                            filterPacked === "packed" ? item.packed :
                            !item.packed;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterPacked, allItems]);

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

  const getNutritionWarning = () => {
    if (userBMI < 18.5) {
      if (totalNutrition.calories < 1800) return "⚠️ You may need more calories to gain weight.";
      if (totalNutrition.protein < 60) return "⚠️ Consider more protein for muscle mass.";
    } else if (userBMI >= 18.5 && userBMI <= 24.9) {
      if (totalNutrition.calories > 2500) return "⚠️ Watch out for excessive calorie intake.";
    } else if (userBMI > 25) {
      if (totalNutrition.fats > 70) return "⚠️ You're consuming too much fat.";
      if (totalNutrition.calories > 2200) return "⚠️ Consider lowering calorie intake.";
    }
    return "✅ Your nutrient intake looks good.";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>Smart Grocery</div>

        <div style={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search items or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterPacked}
            onChange={e => setFilterPacked(e.target.value)}
            style={styles.filterSelect}
            aria-label="Filter items"
          >
            <option value="both">All</option>
            <option value="packed">Packed</option>
            <option value="unpacked">Unpacked</option>
          </select>
        </div>

        <div style={styles.cartIconContainer} onClick={() => setDrawerOpen(true)} role="button" aria-label="Open Cart">
          🛒
          {cart.length > 0 && <span style={styles.cartBadge}>{cart.length}</span>}
        </div>
      </nav>

      {/* Items Grid */}
      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={styles.card}>
              <img src={item.image} alt={item.name} style={styles.image} />
              <h3>{item.name}</h3>
              <p>Calories: {item.calories}</p>
              <p>Protein: {item.protein}g | Carbs: {item.carbs}g | Fats: {item.fats}g</p>
              <p><strong>{getBMISuggestion(item)}</strong></p>
              <button style={styles.addButton} onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>

      {/* Cart Drawer */}
      {drawerOpen && (
        <>
          <div style={styles.drawerOverlay} onClick={() => setDrawerOpen(false)}></div>
          <aside style={styles.drawer}>
            <button style={styles.closeButton} onClick={() => setDrawerOpen(false)}>✖</button>
            <h2>Your Cart ({cart.length})</h2>
            {cart.length === 0 && <p>Your cart is empty.</p>}
            <div style={styles.cartItems}>
              {cart.map((item, i) => (
                <div key={i} style={styles.cartItem}>
                  <img src={item.image} alt={item.name} style={styles.cartItemImage} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.calories} cal | {item.protein}g P | {item.carbs}g C | {item.fats}g F</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.cartTotals}>
              <p><strong>Total Calories:</strong> {totalNutrition.calories}</p>
              <p><strong>Total Protein:</strong> {totalNutrition.protein}g</p>
              <p><strong>Total Carbs:</strong> {totalNutrition.carbs}g</p>
              <p><strong>Total Fats:</strong> {totalNutrition.fats}g</p>
              <p style={{ marginTop: '10px', color: 'orange' }}>{getNutritionWarning()}</p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    backgroundColor: "#00271A",
    minHeight: "100vh",
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#003121",
    color: "#fff8dc",
    padding: "10px 20px",
    borderRadius: "10px",
  },

  logo: {
    fontWeight: "bold",
    fontSize: "1.4rem",
  },

  searchFilter: {
    display: "flex",
    gap: "10px",
    flex: 1,
    maxWidth: "600px",
    marginLeft: "20px",
  },

  searchInput: {
    flex: 1,
    padding: "8px 12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  filterSelect: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
  },

  cartIconContainer: {
    position: "relative",
    cursor: "pointer",
    fontSize: "1.6rem",
    userSelect: "none",
  },

  cartBadge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    backgroundColor: "#ff6347",
    borderRadius: "50%",
    padding: "2px 7px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "#fff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: "20px",
    marginTop: "90px",
  },

  card: {
    backgroundColor: "#003121",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "15px",
    textAlign: "center",
    transition: "transform 0.2s ease",
  },

  image: {
  width: "100%",
  height: "auto", // let height adjust based on image ratio
  objectFit: "contain", // prevent cropping
  maxHeight: "160px", // set a max height to limit card expansion
  borderRadius: "8px",
  marginBottom: "10px",
  backgroundColor: "#ffffff", // optional: adds contrast for images with transparency
},

  addButton: {
    marginTop: "10px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2e8b57",
    color: "#fff8dc",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  drawerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 999,
  },

  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "320px",
    height: "100vh",
    backgroundColor: "#003121",
    padding: "20px",
    boxShadow: "-3px 0 10px rgba(0,0,0,0.15)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  },

  closeButton: {
    alignSelf: "flex-end",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    marginBottom: "10px",
  },

  cartItems: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
  },

  cartItem: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },

  cartItemImage: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  cartTotals: {
    borderTop: "1px solid #ddd",
    paddingTop: "15px",
    fontWeight: "bold",
  },
};

export default Dashboard;