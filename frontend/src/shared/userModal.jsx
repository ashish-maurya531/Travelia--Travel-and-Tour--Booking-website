import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userModal.css'; // Ensure this import is correct

const UserModal = ({ user, isOpen, toggle }) => {
  const [bookedTours, setBookedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
      if (user && isOpen) {
        
          const fetchBookedTours = async () => {
              try {
                  setLoading(true);
                  const response = await axios.get(`http://localhost:4000/api/v1/booking?userId=${user._id}`, {
            withCredentials: true // Include cookies with the request
          });
          console.log(response)
          
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
      const requestData = {
        userId: tour._id,      // The current user's ID
        fullName: tour.fullName, // Assuming fullName is equivalent to the username
        guestSize: tour.guestSize,
        tourName: tour.tourName,
        tourId: tour.tourId,// Number of guests in the tour
      };
      console.log(tour.tourId)
      console.log(requestData)
  
      await axios.delete(`http://localhost:4000/api/v1/booking/delete/${tour.tourId}`, {
 // Pass the requestData object in the body of the request
        withCredentials: true // Include cookies with the request
      });
      console.log(tour.tourId)

  
      // Filter out the tour from the local state after successful deletion
      setBookedTours(bookedTours.filter(t => t._id !== user._id));
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
                <div key={tour._id.$oid} className="tour-card">
                  <div><strong>Tour Name:</strong> {tour.tourName}</div>
                  <div><strong>Tour Id:</strong> {tour.tourId}</div>
                  <div><strong>Date:</strong> {new Date(tour.bookAt).toLocaleDateString()}</div>
                  <div><strong>Number of Guests:</strong> {tour.guestSize}</div>
                  <div><strong>Phone:</strong> {tour.phone}</div>
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
