import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WelcomePart = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user_name = localStorage.getItem('user_name');

    const logout = async (e) => {
        e.preventDefault();

        if (!token) {
            console.log("No token found, already logged out.");
            navigate('/login');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/user/logout', { token });
            if (res.data.logout_status === 0) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_name');
                navigate('/login');
            } else {
                console.log("Logout failed: Token not found.");
            }
        } catch (error) {
            console.error("Logout failed due to server issue:", error);
        }
    };

    return (
        <div>
            <p>
                Welcome {user_name} | 
                <button onClick={logout} style={{ 
                    background: "none", 
                    border: "none", 
                    color: "blue", 
                    textDecoration: "underline", 
                    cursor: "pointer", 
                    fontSize: "inherit" 
                }}>
                    Logout
                </button>
            </p>
        </div>
    );
};

export default WelcomePart;
