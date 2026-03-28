import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loadingUser, setLoadingUser] = useState(true);

    const fetchUser = async () => {
        if (!token) {
            setUser(null);
            setLoadingUser(false);
            return;
        }
        
        try {
            const res = await axios.get('/user/profile', {headers: {Authorization: `Bearer ${token}`}});
            if (res.data.user) {
                setUser(res.data.user);
            } else {
                toast.error('Session expired. Please login again.');
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                setToken(null);
                localStorage.removeItem('token');
            } else {
                toast.error(err.response?.data?.message || 'Failed to fetch user data.');
            }
        } finally {
            setLoadingUser(false);
        }
    }

    const createNewChat = async (chatName) => {
        try {
            if (!user) {
                return toast.error('You must be logged in to create a chat.');
            }
            navigate('/');
            await axios.post('/chat/create', {}, {headers: {Authorization: `Bearer ${token}`}});
            await fetchUserChats();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || 'Failed to create chat. Please try again.');
        }
    }

    const fetchUserChats = async () => {
        try {
            const { data } = await axios.get('/chat/get', {headers: {Authorization: `Bearer ${token}`}});
            setChats(data.chats || []);
            if (!data.chats || data.chats.length === 0){
                await createNewChat();
                return fetchUserChats();
            } else {
                setSelectedChat(data.chats[0]);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to fetch chats. Please try again.');
        }
    }
    
    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(()=>{
        if(user){
            fetchUserChats();
        }else{
            setChats([]);
            setSelectedChat(null);
        }
    }, [user])

    useEffect(()=>{
        if (token){
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token])

    const value = {navigate, fetchUser, user, setUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme,
        createNewChat, loadingUser, fetchUserChats, token, setToken, axios
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);