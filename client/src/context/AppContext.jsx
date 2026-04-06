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

    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dbUser, setDbUser] = useState(null);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [pendingHotels, setPendingHotels] = useState([]);

    const fetchUser = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (data.success) {
                setDbUser(data.user);
                setIsOwner(data.user.role === "hotelOwner");
                setIsAdmin(data.user.role === "admin");
            }
        } catch (error) {
            toast.error("Error fetching user data");
        }
    };

    useEffect(() => { if (user) fetchUser(); }, [user]);

    const value = {
        currency, navigate, user, dbUser, fetchUser, getToken, isOwner, setIsOwner, 
        isAdmin, setIsAdmin, axios, showHotelReg, setShowHotelReg, rooms, setRooms,
        pendingHotels, setPendingHotels
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);