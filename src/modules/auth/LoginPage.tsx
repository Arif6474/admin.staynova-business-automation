import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApiService } from '../../services/endpoints/auth.service.js';
import { useAuth } from '../../context/AuthContext.js';
import { Input } from '../../common/components/ui/Input.js';
import { Button } from '../../common/components/ui/Button.js';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      const res = await authApiService.login(data);
      login(res.tokens, res.user);
      toast.success(`Welcome back, ${res.user.fullName}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid email or password. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#dfa745] to-[#9e7120] flex items-center justify-center shadow-xl shadow-[#dfa745]/25 border border-[#f4e3ba]/30 mb-4">
          <span className="font-serif font-black text-slate-950 text-2xl tracking-tighter">SN</span>
        </div>
        <h3 className="text-xl font-bold text-txt-primary uppercase tracking-wider font-mono">
          StayNova  Login
        </h3>
        <p className="text-xs text-txt-muted mt-1">
          Enter your organization credentials to access the management portal
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 flex items-center space-x-2 text-status-danger text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          placeholder="admin@staynova.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={isSubmitting}>
          Sign In to StayNova
        </Button>
      </form>

      <div className="pt-4 border-t border-subtle text-center text-xs text-txt-muted">
        Need a new organization instance?{' '}
        <Link to="/register" className="text-brand-500 hover:text-brand-400 font-semibold uppercase tracking-wider">
          Register Organization
        </Link>
      </div>
    </div>
  );
};
