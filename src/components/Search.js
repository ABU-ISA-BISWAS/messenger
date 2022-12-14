import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
  
    const { currentUser } = useContext(AuthContext);
  
    const handleSearch = async (e) => {
      e.preventDefault();
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username)
      );
  
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    };
  
    // const handleKey = (e) => {
    //   e.code === "Enter" && handleSearch();
    // };
  
    const handleSelect = async () => {
      //check whether the group(chats in firestore) exists, if not create
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;
      try {
        const res = await getDoc(doc(db, "chats", combinedId));
  
        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "chats", combinedId), { messages: [] });
  
          //create user chats
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
  
          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
        }
      } catch (err) {}
  
      setUser(null);
      setUsername("")
    };
    return (
        <div className='search rounded-xl bg-blue-900 mx-2 mt-2'>
            <div className="searchForm w-full">
                <form onSubmit={handleSearch} >
                  <div className="flex flex-row">
                    <div>
                    <input onChange={e => setUsername(e.target.value)}  placeholder="Find a user" type="text" />
                    </div>
                    <div>
                    <button className="bg-slate-900 text-gray-200 px-1 rounded" >Search</button>
                    </div>
                  </div>
                
                
                </form>
            </div>
            {err && <span className="text-white">User not found!</span>}
           {user &&  <div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}

        </div>
    );
};

export default Search;