import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (state === "register" && !name) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    const url = state === "login" ? "/user/login" : "/user/register";
    try {
      const {data} = await axios.post(url, {name, email, password});
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(data.message || 'Authentication successful!');
      } else {
        toast.error(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
      <p className="text-2xl font-medium m-auto">
        <span className="text-purple-700">User</span> {state === "login" ? "Login" : "Sign Up"}
      </p>
      {state === "register" && (
        <div className="w-full">
          <p>Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-600" type="text" required />
        </div>
      )}
      <div className="w-full ">
        <p>Email</p>
        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-600" type="email" required />
      </div>
      <div className="w-full ">
        <p>Password</p>
        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-600" type="password" required />
      </div>
      {state === "register" ? (
        <p>
          Already have account? <span onClick={() => setState("login")} className="text-purple-600 cursor-pointer">click here</span>
        </p>
      ) : (
        <p>
          Create an account? <span onClick={() => setState("register")} className="text-purple-600 cursor-pointer">click here</span>
        </p>
      )}
      <button type='submit' disabled={loading} className="bg-purple-600 hover:bg-purple-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50">
        {loading ? "Loading..." : (state === "register" ? "Create Account" : "Login")}
      </button>
    </form>
  );
}

export default Login