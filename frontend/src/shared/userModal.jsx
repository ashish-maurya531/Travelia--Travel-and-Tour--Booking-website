
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userModal.css'; // Ensure this import is correct
import { BASE_URL } from '../utils/config'


const UserModal = ({ user, isOpen, toggle }) => {
  const [bookedTours, setBookedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user && isOpen) {
      const fetchBookedTours = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BASE_URL}/booking?userId=${user._id}`, {
            withCredentials: true // Include cookies with the request
          });
          
          const filteredBookings = response.data.data.filter(
            (booking) => booking.userId === user._id
          );
          setBookedTours(filteredBookings);
        } catch (error) {
          setError('Error fetching booked tours.');
        } finally {
          setLoading(false);
        }
      };
    
      fetchBookedTours();
    }
  }, [user, isOpen]);

  const handleCancelTour = async (tour) => {
    try {
      await axios.delete(`${BASE_URL}/booking/delete/${tour.tourId}`, {
        withCredentials: true // Include cookies with the request
      });
  
      // Remove the canceled tour from the state
      setBookedTours(bookedTours.filter(t => t.tourId !== tour.tourId));
    } catch (error) {
      console.error('Error cancelling tour:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={toggle}>
      <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <h2>{user.username}'s Details</h2>
          <button className="user-close-button" onClick={toggle}>X</button>
        </div>
        <div className="user-modal-body">
          <h3>Booked Tours:</h3>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {bookedTours.length > 0 ? (
            <div className="tour-cards">
              {bookedTours.map((tour) => (
                <div key={tour._id} className="tour-card">
                  <div><strong>Tour Name:</strong> {tour.tourName}</div>
                  <div><strong>Tour Id:</strong> {tour.tourId}</div>
                  <div><strong>Date:</strong> {new Date(tour.bookAt).toLocaleDateString()}</div>
                  <div><strong>Number of Guests:</strong> {tour.guestSize}</div>
                  <div><strong>Phone:</strong> {tour.phone}</div>
                  <div><strong>Hotel Preference:</strong> {tour.hotelPreference}</div> {/* Added hotel preference */}
                  <div><strong>Travel Preference:</strong> {tour.travelPreference}</div> {/* Added travel preference */}
                  <button className="cancel-tour-button" onClick={() => handleCancelTour(tour)}>Cancel Tour</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No tours booked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
