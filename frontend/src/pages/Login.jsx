import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { 
 signInWithEmailAndPassword, 
 createUserWithEmailAndPassword, 
 sendPasswordResetEmail,
 signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
 const [isSignup, setIsSignup] = useState(false);
 const [isForgotMode, setIsForgotMode] = useState(false);
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [message, setMessage] = useState('');
 const [showPassword, setShowPassword] = useState(false);

 const navigate = useNavigate();
 const dispatch = useDispatch();

 // Helper to format username to email for Firebase Auth
 const formatEmail = (userStr) => {
 if (userStr.includes('@')) return userStr;
 return `${userStr}@sigwe.in`; // default domain for usernames
 };

 // Helper to check access roles
 const getRole = (email) => {
 const raw = email.split('@')[0];
 if (raw === 'sigwepal') return 'admin';
 if (raw === 'sales') return 'sales';
 return 'user';
 };

 const handleAuth = async (e) => {
 e.preventDefault();
 setError('');
 setMessage('');
 
 const email = formatEmail(username);

 try {
 if (isForgotMode) {
 await sendPasswordResetEmail(auth, email);
 setMessage('Password reset email sent! Check your inbox.');
 setIsForgotMode(false);
 } else if (isSignup) {
 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 const userRole = getRole(email);
 dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email, role: userRole }));
 navigate('/shop');
 } else {
 const userCredential = await signInWithEmailAndPassword(auth, email, password);
 const userRole = getRole(email);
 dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email, role: userRole }));
 navigate('/shop');
 }
 } catch (err) {
 console.error(err);
 if (err.code === 'auth/invalid-credential') {
 setError('Invalid credentials or account does not exist. If this is a new account, please click "Sign Up" below.');
 } else {
 setError(err.message || 'Authentication failed');
 }
 }
 };

 const handleGoogleSignIn = async () => {
 try {
 const userCredential = await signInWithPopup(auth, googleProvider);
 const email = userCredential.user.email;
 const userRole = getRole(email);
 dispatch(setUser({ uid: userCredential.user.uid, email, role: userRole }));
 navigate('/shop');
 } catch (err) {
 console.error(err);
 setError(err.message || 'Google sign in failed');
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-[#f5fbf5] p-4 relative">
 <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-8 max-w-md w-full">
 <div className="text-center mb-8">
 <div className="flex justify-center mb-6">
 <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE Logo" className="h-16 object-contain" />
 </div>
 <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
 {isForgotMode ? 'Reset Password' : isSignup ? 'Create Account' : 'SIGWE Login'}
 </h1>
 <p className="text-gray-500">
 {isForgotMode ? 'Enter your username' : isSignup ? 'Join the SIGWE platform' : 'Enter your credentials to access the system'}
 </p>
 </div>
 
 {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
 {message && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-sm">{message}</div>}

 <form onSubmit={handleAuth} className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2 uppercase text-xs">Username</label>
 <input 
 type="text" 
 required
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
 placeholder="Enter Username"
 />
 </div>
 
 {!isForgotMode && (
 <div>
 <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2 uppercase text-xs">Password</label>
 <div className="relative">
 <input 
 type={showPassword ? "text" : "password"} 
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
 placeholder="Enter Password"
 />
 <button 
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
 >
 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
 </button>
 </div>
 </div>
 )}

 {!isForgotMode && !isSignup && (
 <div className="flex justify-end">
 <button 
 type="button" 
 onClick={() => { setIsForgotMode(true); setError(''); setMessage(''); }} 
 className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
 >
 Forgot Password?
 </button>
 </div>
 )}

 <button 
 type="submit"
 className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors mt-4"
 >
 {isForgotMode ? 'Send Reset Link' : isSignup ? 'Sign Up' : 'Sign In'}
 </button>
 </form>

 {!isForgotMode && (
 <div className="mt-6">
 <div className="relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-gray-200"></div>
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="px-2 bg-white text-gray-400">Or continue with</span>
 </div>
 </div>

 <button 
 onClick={handleGoogleSignIn}
 type="button"
 className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
 >
 <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
 </svg>
 Google
 </button>
 </div>
 )}

 <div className="mt-8 text-center text-sm text-gray-500">
 {isForgotMode ? (
 <button onClick={() => { setIsForgotMode(false); setError(''); setMessage(''); }} className="text-emerald-700 hover:text-emerald-800 font-semibold">Back to Login</button>
 ) : isSignup ? (
 <>Already have an account? <button onClick={() => { setIsSignup(false); setError(''); setMessage(''); }} className="text-emerald-700 hover:text-emerald-800 font-semibold">Sign In</button></>
 ) : (
 <>Don't have an account? <button onClick={() => { setIsSignup(true); setError(''); setMessage(''); }} className="text-emerald-700 hover:text-emerald-800 font-semibold">Sign Up</button></>
 )}
 </div>
 </div>
 </div>
 );
}
