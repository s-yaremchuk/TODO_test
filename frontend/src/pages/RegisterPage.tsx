import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, RegisterFormData } from '../schemas/auth.schema';
import { registerApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const res = await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(res.token, res.user);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Не вдалося зареєструватися. Спробуйте пізніше.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#f4f4f5] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="font-mono text-xs text-[#FFD400] text-center mb-1 uppercase tracking-wider">
          AUTH // REGISTER
        </div>
        <h2 className="text-center text-2xl font-black uppercase tracking-tight text-white">
          СТВОРЕННЯ АКАУНТА
        </h2>
        <p className="mt-2 text-center font-mono text-xs text-neutral-500">
          ВЖЕ Є АКАУНТ?{' '}
          <Link to="/login" className="text-[#FFD400] hover:underline">
            [УВІЙТИ]
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] border border-neutral-800 p-8">
          {serverError && (
            <div className="mb-6 bg-red-950/20 border border-red-900/60 p-3 font-mono text-xs text-[#E5322D]">
              {serverError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                NAME
              </label>
              <input
                type="text"
                autoComplete="name"
                {...register('name')}
                className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD400] text-sm"
                placeholder="Олександр"
              />
              {errors.name && (
                <p className="mt-1 font-mono text-xs text-[#E5322D]">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                EMAIL
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD400] text-sm"
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="mt-1 font-mono text-xs text-[#E5322D]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD400] text-sm"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 font-mono text-xs text-[#E5322D]">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="w-full px-3 py-2 bg-[#111111] border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD400] text-sm"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 font-mono text-xs text-[#E5322D]">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 font-mono text-xs uppercase font-bold bg-[#FFD400] text-black hover:bg-[#FFE033] focus:outline-none disabled:opacity-50 transition-colors duration-100"
              >
                {isSubmitting ? 'РЕЄСТРАЦІЯ...' : 'ЗАРЕЄСТРУВАТИСЯ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
