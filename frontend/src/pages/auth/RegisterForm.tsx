import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegisterUserMutation, RegisterInput } from '@/graphql/generated/types';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri'),
  lastName: z.string().min(2, 'Il cognome deve contenere almeno 2 caratteri'),
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [registerUser, { loading }] = useRegisterUserMutation({
    onCompleted: (data) => {
      const { accessToken, user } = data.register;

      // Update auth store (auto-login after registration)
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
        title: 'Account creato con successo!',
        description: `Benvenuto in Orto, ${user.firstName}!`,
      });

      // Redirect to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore nella registrazione',
        description: error.message || 'Si è verificato un errore. Riprova.',
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        variables: {
          registerInput: data as RegisterInput,
        },
      });
    } catch (error) {
      // Error handled by onError callback
      console.error('Register error:', error);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input id="firstName" type="text" placeholder="Mario" className="pl-10" {...register('firstName')} disabled={isLoading} />
          </div>
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Cognome</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input id="lastName" type="text" placeholder="Rossi" className="pl-10" {...register('lastName')} disabled={isLoading} />
          </div>
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

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
            placeholder="Minimo 8 caratteri"
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

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creazione account...
          </>
        ) : (
          'Crea Account'
        )}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <p>
          Creando un account accetti i nostri{' '}
          <a href="#" className="text-emerald-600 hover:underline">
            Termini di Servizio
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
