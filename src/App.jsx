
// import Contact from "./Contact"
// import Header from "./Header"
// export default function App() {
//    return (<>
//    <Header/>
//         <div className="contacts">
//             <Contact
//                 img="src/images/bread_img.jpg"
//                 name="Mr. Whiskerson"
//                 phone="(212) 555-1234"
//                 email="mr.whiskaz@catnap.meow"
//             />
//             <Contact
//                 img="src/images/coffeecup.jfif"
//                 name="Fluffykins"
//                 phone="(212) 555-2345"
//                 email="fluff@me.com"
//             />
//             <Contact
//                 img="src/images/coffee_mountain.jfif"
//                 name="Felix"
//                 phone="(212) 555-4567"
//                 email="thecat@hotmail.com"
//             />
//             <Contact 
//                 img="src/images/bread_img.jpg"
//                 name="Pumpkin"
//                 phone="(0800) CAT KING"
//                 email="pumpkin@scrimba.com"
//             />
//             <Contact 
//                 img="src/images/coffee_mountain.jfif"
//                 name="Pumpkin"
//                 phone="(0800) CAT KING"
//                 email="pumpkin@scrimba.com"
//             />
//             <Contact
//                 img="src/images/coffe_cooker.jpg"
//                 name="Mr. Whiskerson"
//                 phone="(212) 555-1234"
//                 email="mr.whiskaz@catnap.meow"
//             />
//             <Contact
//                 img="src/images/coffeecup.jfif"
//                 name="Fluffykins"
//                 phone="(212) 555-2345"
//                 email="fluff@me.com"
//             />
//              <Contact 
//                 img="src/images/bread_img.jpg"
//                 name="Pumpkin"
//                 phone="(0800) CAT KING"
//                 email="pumpkin@scrimba.com"
//             />
            
//         </div>
//         </>
//     )
// }
import React, { useState, useMemo, useCallback } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// ==========================================
// 1. REDUX SETUP (Global State Management)
// ==========================================
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [
      { id: 1, name: 'React Course', price: 50 },
      { id: 2, name: 'JavaScript Handbook', price: 30 },
      { id: 3, name: 'UI/UX Design Book', price: 40 },
    ],
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

const { addItem, removeItem } = cartSlice.actions;
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// ==========================================
// 2. CHILD COMPONENT WITH React.memo
// ==========================================
// This component is wrapped in React.memo. 
// It will ONLY re-render if its props ('onDelete') change.
const CartItem = React.memo(({ item, onDelete }) => {
  console.log(`[Render] CartItem rendered: ${item.name}`);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #ddd' }}>
      <span>{item.name} - ${item.price}</span>
      <button onClick={() => onDelete(item.id)} style={{ background: 'crimson', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>
        Delete
      </button>
    </div>
  );
});

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
function Dashboard() {
  const [theme, setTheme] = useState('light');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  
  // Read items from Redux Global State
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // --- useMemo DEMO ---
  // Caches the total price calculation. 
  // If you toggle the theme, this expensive loop is SKIPPED.
  const totalPrice = useMemo(() => {
    console.log('🔄 Running expensive calculation: Computing total price...');
    let total = 0;
    // Simulating a heavy calculation loop
    for (let i = 0; i < 1000000; i++) {} 
    cartItems.forEach(item => total += item.price);
    return total;
  }, [cartItems]); // Only recalculate if cartItems array changes

  // --- useCallback DEMO ---
  // Caches this function definition. 
  // Because of useCallback, Child components wrapped in React.memo 
  // will NOT re-render when the theme changes.
  const handleDelete = useCallback((id) => {
    dispatch(removeItem(id));
  }, [dispatch]);

  // Handle adding a new item to Redux store
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    dispatch(addItem({
      id: Date.now(),
      name: newItemName,
      price: Number(newItemPrice),
    }));
    setNewItemName('');
    setNewItemPrice('');
  };

  const isDark = theme === 'dark';

  return (
    <div style={{ 
      background: isDark ? '#222' : '#f4f4f4', 
      color: isDark ? '#fff' : '#000', 
      padding: '20px', 
      fontFamily: 'sans-serif',
      minHeight: '100vh' 
    }}>
      <h1>🛒 Performance & State Demo</h1>
      <p><i>Check your browser's console to see when calculations run and components re-render!</i></p>

      {/* Theme Toggle (Triggers local re-render) */}
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ padding: '8px 16px', marginBottom: '20px' }}>
        Switch to {isDark ? 'Light' : 'Dark'} Theme
      </button>

      {/* Redux State & useMemo Section */}
      <div style={{ background: isDark ? '#333' : '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Global Cart Items (Managed by Redux)</h3>
        <p><strong>Total Price (Cached via useMemo):</strong> ${totalPrice}</p>

        {cartItems.map(item => (
          <CartItem key={item.id} item={item} onDelete={handleDelete} />
        ))}

        {/* Form to add item */}
        <form onSubmit={handleAdd} style={{ marginTop: '15px' }}>
          <input 
            type="text" 
            placeholder="Item name" 
            value={newItemName} 
            onChange={(e) => setNewItemName(e.target.value)} 
            style={{ marginRight: '8px', padding: '4px' }}
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={newItemPrice} 
            onChange={(e) => setNewItemPrice(e.target.value)} 
            style={{ marginRight: '8px', padding: '4px', width: '80px' }}
          />
          <button type="submit">Add Item to Redux</button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. APP WRAPPER (Redux Provider)
// ==========================================
export default function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}