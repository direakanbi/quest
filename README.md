# Quest Society - Site Revamp (React/Vite)

This is a standalone React application rebuilding the Quest Society Clothing website with a modern, high-performance tech stack.

## Tech Stack
*   **Framework**: [React](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: Vanilla CSS (Variables, Flexbox/Grid)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure
```
src/
├── components/
│   ├── HomePage.jsx       # Splash screen with clock & starfield
│   ├── CollectionPage.jsx # Product grid
│   ├── ProductPage.jsx    # Detailed product view
│   ├── Navbar.jsx         # Global navigation
│   ├── SizeGuideModal.jsx # Size chart pop-up
│   └── StickyCart.jsx     # Mobile conversion bar
├── data/
│   └── products.js        # Mock data for product catalog
└── index.css              # Global styles & Galaxy theme
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) to view it in the browser.

### 3. Build for Production
To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` folder, ready to deploy to Vercel, Netlify, or any static host.
