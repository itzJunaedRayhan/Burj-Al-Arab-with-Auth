import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    useEffect(()=>{
        fetch('http://localhost:4000/bookings?email='+loggedInUser.email,{
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setBookings(data)
        })
    },[])
    return (
        <div>
            <h3>You have: {bookings.length}</h3>
            {
                bookings.map(book => <li key={book._id}>{book.name} from: {(new Date(book.checkIn).toDateString('dd/MM/yyyy'))} to: {(new Date(book.checkOut).toDateString('dd/MM/yyyy'))}</li>)
            }
        </div>
    );
};
export default Bookings;