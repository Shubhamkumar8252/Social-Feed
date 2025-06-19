import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import CelebrityDashboard from "./pages/CelebrityDashboard";
import PublicFeed from "./pages/PublicFeed";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/celebrity" element={<CelebrityDashboard />} />
          <Route path="/public" element={<PublicFeed />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
