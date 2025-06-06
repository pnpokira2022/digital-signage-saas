// frontend/src/components/Login.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

interface LoginFormData {
  email: string;
  password: string;
  twoFactorCode?: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      const response = await axios.post('http://backend:3001/api/users/login', { // Change localhost to backend
        email: data.email,
        password: data.password,
        twoFactorCode: data.twoFactorCode || '',
      });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response?.data?.error === 'Invalid 2FA code') {
        setTwoFactorRequired(true);
        setErrorMessage('Code 2FA invalide. Veuillez réessayer.');
      } else {
        setErrorMessage(axiosError.response?.data?.error || 'Erreur lors de la connexion. Vérifiez votre connexion au backend.');
        console.error(axiosError);
      }
    }
  };

  const enable2FA = async () => {
    try {
      setErrorMessage(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Vous devez être connecté pour activer la 2FA.');
        return;
      }
      const response = await axios.post('http://backend:3001/api/users/enable-2fa', {}, { // Change localhost to backend
        headers: { Authorization: `Bearer ${token}` },
      });
      setTwoFactorSecret(response.data.secret);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      setErrorMessage(axiosError.response?.data?.error || 'Erreur lors de l’activation de la 2FA. Vérifiez votre connexion au backend.');
      console.error(axiosError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Connexion</h2>
        {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
        <div className="mb-4">
          <label className="block text-sm">Email</label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <span className="text-red-500 text-sm">Email requis</span>}
        </div>
        <div className="mb-4">
          <label className="block text-sm">Mot de passe</label>
          <input
            {...register('password', { required: true })}
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <span className="text-red-500 text-sm">Mot de passe requis</span>}
        </div>
        {twoFactorRequired && (
          <div className="mb-4">
            <label className="block text-sm">Code 2FA</label>
            <input
              {...register('twoFactorCode', { required: true })}
              className="w-full p-2 border rounded"
            />
            {errors.twoFactorCode && <span className="text-red-500 text-sm">Code requis</span>}
          </div>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Se connecter</button>
        <button onClick={enable2FA} className="mt-2 w-full bg-gray-500 text-white p-2 rounded">Activer 2FA</button>
        {twoFactorSecret && <QRCodeCanvas value={`otpauth://totp/DigitalSignage?secret=${twoFactorSecret}`} />}
      </form>
    </div>
  );
};

export default Login;