import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TripFormPage from './pages/TripFormPage';
import TripDetailPage from './pages/TripDetailPage';

const base = import.meta.env.BASE_URL;

export default function App() {
  return (
    <BrowserRouter basename={base}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<TripFormPage />} />
        <Route path="/edit/:id" element={<TripFormPage />} />
        <Route path="/trip/:id" element={<TripDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
