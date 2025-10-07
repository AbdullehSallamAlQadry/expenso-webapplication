  import Sign from './script/sign.js'
  import Main from './script/main.js'
  import {useEffect, useState } from 'react';

  export default function App() {
    const [user, setUser] = useState(null);
    const [webMode, setWebMode] = useState(true); //Light mode 

    useEffect(() => {
      // Check if user data is available in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    },[]);

    useEffect(() => {
      // Update localStorage whenever user state changes
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }, [user]);

    return (
      <>
        {(user) ? <Main user={user} setWebMode={setWebMode}/> : <Sign onUserLogin={setUser}/>}
        <footer>&copy;Copyright by <a href="https://www.linkedin.com/in/abdulleh-sallam-844608355/">Abdulleh Sallam</a></footer>
      </>
    )
  }