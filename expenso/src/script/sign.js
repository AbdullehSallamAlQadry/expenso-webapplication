import {useState} from 'react';
import logoImg from '../images/logo2.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faLock} from '@fortawesome/free-solid-svg-icons';

// InputGroup component for reusable input fields with icons
function InputGroup({type, icon, value, placeholder, onSetValue}) {
  return (
    <div className="input-group">
      <FontAwesomeIcon icon={icon} className="input-icon" />
      <input type={type} value={value} placeholder={placeholder} required onChange={onSetValue} name={placeholder}/>
    </div>
  );
}

// Sign component handles both login and registration
export default function Sign({onUserLogin}) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [register, setRegister] = useState(false);

  // Function to handle form submission for login and registration
  async function handleSubmit(e, URL) {
    e.preventDefault();
    try{
      setError("")
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: user, password: password}),
      })
      const data = await res.json()
      if(res.status !== 200) {
        throw new Error(data.message || "An error occurred, please try again")
      }
      if(data.status === 'success'){
        console.log("User logged in successfully:", data.user);
        onUserLogin(data.user);
      }
    }   
    catch(err) {
      setError(error => error = err)
    }
  }

  // Function to handle password confirmation during registration to ensure passwords match
  function handlerConfirmPassword(e) {
    e.preventDefault();
    try {
      const confirmPasswordValue = e.target.elements['Ensure Password'].value;
      if(password !== confirmPasswordValue) {
        throw new Error("Passwords do not match");
      }
      handleSubmit(e, 'http://localhost:9000/user/signup/')
    }
    catch(err) {
      setError(error => error = err);
    }
  }

  // Function to toggle between login and registration forms
  function registerHandler() {
    setRegister(!register);
    setUser('');
    setPassword('');
    setError('');
  }

  return (
    <div className='sign_login_container'>
      <>
        {register ?
          <SignUp
            setUser={setUser}
            setPassword={setPassword}
            user={user}
            password={password}
            error={error}
            onSubmit={handlerConfirmPassword}
            onRegister = {registerHandler}/>
        :
          <Login 
            setUser={setUser}
            setPassword={setPassword}
            user={user}
            password={password}
            error={error}
            onSubmit={handleSubmit}
            onRegister={registerHandler}
          />
        }
      </>
    </div>
  )
}

// Login component for user login
function Login({ setUser, setPassword, user, password, error, onSubmit, onRegister}) {
  return (
    <div className="login-container">
        <Logo />
        <p>Please log in to continue</p>
        <form onSubmit={(e) => onSubmit(e, 'http://localhost:9000/user/login/')}>
          <InputGroup 
            key={'user'}
            type="text" 
            icon={faUser} 
            value={user} 
            placeholder="Username" 
            onSetValue={(e) => setUser(e.target.value)} 
          />
          <InputGroup 
            key={'password'}
            type="password" 
            icon={faLock} 
            value={password} 
            placeholder="Password" 
            onSetValue={(e) => setPassword(e.target.value)} 
          />
          {
            (error && <p style={{color: "red"}}>{error.message}</p>)
          }
          <button type="submit">Log In</button>
        </form>
        <p className="register-link">Don't have an account? <a onClick={onRegister}>Register here</a></p>
      </div>
  )
}

// SignUp component for user registration
function SignUp({setUser, setPassword, user, password, error, onSubmit, onRegister}) {
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="register-container">
      <Logo />
      <p>Register a new account</p>
      <form onSubmit={onSubmit}>
        <InputGroup 
          key={'user'}
          type="text" 
          icon={faUser} 
          value={user} 
          placeholder="Username" 
          onSetValue={(e) => setUser(e.target.value)} 
        />
        <InputGroup 
          key={'password'}
          type="password" 
          icon={faLock} 
          value={password}
          placeholder="Password" 
          onSetValue={(e) => setPassword(e.target.value)} 
        />
        <InputGroup 
          key={'confirmPassword'}
          type="password" 
          icon={faLock} 
          value={confirmPassword}
          placeholder="Ensure Password" 
          onSetValue={(e) => setConfirmPassword(e.target.value)} 
        />
        {
          (error && <p style={{color: "red"}}>{error.message}</p>)
        }
        <button type="submit">Sign Up</button>
      </form>
      <p className="login-link">Already have an account? <a onClick={onRegister}>Login here</a></p>
    </div>
  )
}

// Logo component to display the application logo and title
function Logo() {
  return (
    <>
      <img src={logoImg} alt="Expenso Logo" />
      <h1>Welcome to Expenso</h1>
    </>
  )
}