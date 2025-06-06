// frontend/src/components/Register.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';

interface RegisterFormData {
  email: string;
  password: string;
  tenant_name: string;
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      const response = await axios.post('http://backend:3001/api/users/register', data); // Change localhost to backend
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      setErrorMessage(axiosError.response?.data?.error || 'Erreur lors de l’inscription. Vérifiez votre connexion au backend.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Inscription</h2>
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
        <div className="mb-4">
          <label className="block text-sm">Nom du tenant</label>
          <input
            {...register('tenant_name', { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.tenant_name && <span className="text-red-500 text-sm">Nom du tenant requis</span>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;