import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLoginUserMutation, LoginInput } from '@/graphql/generated/types';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [loginUser, { loading }] = useLoginUserMutation({
    onCompleted: (data) => {
      const { accessToken, user } = data.login;

      // Update auth store
      setAuth(
        {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken,
      );

      toast({
        title: 'Accesso effettuato!',
        description: `Benvenuto, ${user.firstName}!`,
      });

      // Redirect to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore di accesso',
        description: error.message || 'Credenziali non valide. Riprova.',
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginUser({
        variables: {
          loginInput: data as LoginInput,
        },
      });
    } catch (error) {
      // Error handled by onError callback
      console.error('Login error:', error);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input id="email" type="email" placeholder="mario.rossi@email.com" className="pl-10" {...register('email')} disabled={isLoading} />
        </div>
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Inserisci la tua password"
            className="pl-10 pr-10"
            {...register('password')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <a href="#" className="text-sm text-emerald-600 hover:underline" tabIndex={isLoading ? -1 : 0}>
          Password dimenticata?
        </a>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Accesso in corso...
          </>
        ) : (
          'Accedi'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
