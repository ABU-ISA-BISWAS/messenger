import React, { useContext } from 'react';
import {signOut} from "firebase/auth"
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const {currentUser} = useContext(AuthContext);
    return (
        <div className='navbar'>
            <span className='logo mr-2'>My Chat</span>
            <div className="user">
                <img src={currentUser.photoURL} alt="" />
                <span>{currentUser.displayName}</span>
                <button className='rounded px-2 bg-red-600' onClick={()=>signOut(auth)}>logout</button>
            </div>
        </div>
    );
};

export default Navbar;