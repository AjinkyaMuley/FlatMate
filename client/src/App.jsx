import './App.css'
import io from 'socket.io-client';
import { Route, Router, Routes } from 'react-router-dom';
import Home from './pageComponents/Home';
import Search from './pageComponents/Search';
import Message from './pageComponents/Message';
import Profile from './pageComponents/Profile';
import Navbar from './pageComponents/Navbar';
import Auth from './pageComponents/Auth';
import NewListingForm from './pageComponents/NewListingForm';
import HouseListingsPage from './pageComponents/AllListings';
import About from './pageComponents/About';
import Testimonials from './pageComponents/Testimonials';
import Blogs from './pageComponents/Blogs';
import ListingDetailsPage from './pageComponents/ListingsDetails';
import Dashboard from './pageComponents/Dashboard';
import ProfileCompletion from './pageComponents/completeUserProfile';
import ProfileUpdateForm from './pageComponents/updateUserProfile';
import ListingsByUser from './pageComponents/ListingsByUser';
import MessageToOwner from './pageComponents/MessageToOwner';

const socket = io.connect("http://localhost:8000")

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listingsDetail/:id" element={<ListingDetailsPage />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/messages/:id" element={<MessageToOwner />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/newListingForm" element={<NewListingForm />} />
        <Route path="/allListings" element={<HouseListingsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Testimonials />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profileCompletion" element={<ProfileCompletion />} />
        <Route path="/profileUpdate" element={<ProfileUpdateForm />} />
        <Route path="/listingsByUser" element={<ListingsByUser />} />
        {/* Additional routes would go here */}
      </Routes>
    </>
  )
}

export default App
