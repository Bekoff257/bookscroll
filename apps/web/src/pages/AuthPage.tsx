import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function AuthPage() {
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cardTitle = useMemo(() => (tab === 'email' ? `${mode === 'login' ? 'Login' : 'Register'} with Email` : 'Login with Phone OTP'), [mode, tab]);

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const sendOtp = async () => {
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' });
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmation.confirm(otp);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
      <div className="ig-card w-full p-6">
        <h1 className="mb-5 text-center text-2xl font-semibold">BookScroll</h1>
        <div className="mb-4 flex rounded-xl bg-gray-100 p-1 text-sm">
          <button onClick={() => setTab('email')} className={`flex-1 rounded-lg p-2 ${tab === 'email' ? 'bg-white shadow' : ''}`}>Email</button>
          <button onClick={() => setTab('phone')} className={`flex-1 rounded-lg p-2 ${tab === 'phone' ? 'bg-white shadow' : ''}`}>Phone OTP</button>
        </div>
        <h2 className="mb-3 text-sm font-medium text-gray-600">{cardTitle}</h2>
        {tab === 'email' ? (
          <form onSubmit={handleEmail} className="space-y-3">
            <input className="w-full rounded-xl border border-gray-200 p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full rounded-xl border border-gray-200 p-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="w-full rounded-xl bg-black p-3 text-white">Continue</button>
            <p className="text-center text-sm text-gray-500">
              {mode === 'login' ? 'No account?' : 'Have an account?'}{' '}
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-medium text-gray-800">
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </form>
        ) : (
          <div className="space-y-3">
            <input className="w-full rounded-xl border border-gray-200 p-3" placeholder="+1..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button onClick={sendOtp} className="w-full rounded-xl bg-black p-3 text-white">Send OTP</button>
            <input className="w-full rounded-xl border border-gray-200 p-3" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button onClick={verifyOtp} disabled={!confirmation} className="w-full rounded-xl bg-black p-3 text-white disabled:bg-gray-400">Verify OTP</button>
            <div id="recaptcha-container" className="pt-2" />
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <Link to="/feed" className="mt-5 block text-center text-xs text-gray-400">Skip for now</Link>
      </div>
    </div>
  );
}
