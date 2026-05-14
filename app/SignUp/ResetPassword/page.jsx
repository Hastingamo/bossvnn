"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/Client';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //  useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const accessToken = urlParams.get('access_token');


  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
    if (error) setMessage(error.message);
    else setMessage('Password updated! You can now log in.');
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="New password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
      />
      <button onClick={handleUpdate}>Update Password</button>
      {message && <p>{message}</p>}
    </div>
  );
}