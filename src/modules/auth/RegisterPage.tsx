import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApiService } from '../../services/endpoints/auth.service.js';
import { useAuth } from '../../context/AuthContext.js';
import { Input } from '../../common/components/ui/Input.js';
import { Button } from '../../common/components/ui/Button.js';
import { Building2, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      const res = await authApiService.register(data);
      login(res.tokens, res.user);
      toast.success('Organization registered successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please check your details.';
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
          Create Organization
        </h3>
        <p className="text-xs text-txt-muted mt-1">
          Set up a new StayNova  tenant & Super Admin
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 flex items-center space-x-2 text-status-danger text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input
          label="Organization / Company Name"
          placeholder="StayNova Hospitality LLC"
          leftIcon={<Building2 className="w-4 h-4" />}
          error={errors.organizationName?.message}
          {...register('organizationName')}
        />

        <Input
          label="Super Admin Full Name"
          placeholder="John Doe"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="admin@staynova.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number (Optional)"
          placeholder="+971 50 123 4567"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" variant="primary" size="md" className="w-full mt-3" isLoading={isSubmitting}>
          Create Organization & Launch
        </Button>
      </form>

      <div className="pt-4 border-t border-subtle text-center text-xs text-txt-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-500 hover:text-brand-400 font-semibold uppercase tracking-wider">
          Sign In
        </Link>
      </div>
    </div>
  );
};
