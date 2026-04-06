import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || " ₹";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    // STATES
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);
    
    // ADMIN STATES
    const [dashStats, setDashStats] = useState(null);
    const [registeredHotels, setRegisteredHotels] = useState(null);
    const [pendingHotels, setPendingHotels] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [dbUser, setDbUser] = useState(null);

    

    // FETCH FUNCTIONS
    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 1. Add a new state for the database user data


// 2. Update fetchUser to store that data
    const fetchUser = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user', { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (data.success) {
                // data.user now exists because of the change in userController.js
                setDbUser(data.user); 
                setIsOwner(data.user.role === "hotelOwner"); 
                setIsAdmin(data.user.role === "admin");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Error fetching user data");
        }
    };

    // ADMIN FETCH FUNCTIONS
    const fetchDashStats = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard', { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) setDashStats(data.stats);
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    };

    const fetchRegisteredHotels = async () => {
        try {
            const { data } = await axios.get('/api/admin/hotels/registered', { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) setRegisteredHotels(data.hotels);
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    };

    const fetchPendingHotels = async () => {
        try {
            const { data } = await axios.get('/api/admin/hotels/pending', { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) setPendingHotels(data.pendingHotels);
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    };

    const fetchTransactions = async () => {
        try {
            const { data } = await axios.get('/api/admin/transactions', { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) setTransactions(data.transactions);
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    };

    const fetchUserStats = async () => {
        try {
            const { data } = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) setUserStats(data.stats);
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    };

    // USE EFFECTS
    useEffect(() => {
        if (user) fetchUser();
    }, [user]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchDashStats();
        }
    }, [isAdmin]);

    // THE MAGIC VALUE OBJECT (Everything must be exported here!)
    const value = {
        currency, navigate, user, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg, searchedCities, setSearchedCities, rooms, setRooms, isAdmin, setIsAdmin, dashStats, fetchDashStats, registeredHotels, fetchRegisteredHotels, pendingHotels, fetchPendingHotels, setPendingHotels, transactions, fetchTransactions, userStats, fetchUserStats, fetchUser, dbUser,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);