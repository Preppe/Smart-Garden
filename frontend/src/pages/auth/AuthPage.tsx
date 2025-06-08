import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Accedi' : 'Registrati'} - Orto</title>
        <meta name="description" content="Accedi al tuo giardino smart o crea un nuovo account per iniziare a gestire le tue piante con tecnologia IoT." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Orto</h1>
              <p className="text-xl text-gray-600">Smart Garden Management</p>
            </div>
          </div>

          <div className="space-y-4 text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800">Trasforma il tuo giardino in un ecosistema intelligente</h2>
            <p className="text-gray-600 leading-relaxed">
              Monitora, automatizza e ottimizza la cura delle tue piante con sensori IoT, intelligenza artificiale e automazione avanzata.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">98%</div>
              <div className="text-sm text-gray-600">Plant Survival Rate</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">70%</div>
              <div className="text-sm text-gray-600">Water Savings</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="bg-white/80 backdrop-blur-md border-green-100 shadow-xl">
            <CardHeader className="space-y-4">
              {/* Mobile Branding */}
              <div className="lg:hidden text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Orto</h1>
              </div>

              <CardTitle className="text-center">{isLogin ? 'Accedi al tuo giardino' : 'Crea il tuo account'}</CardTitle>

              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={isLogin ? 'default' : 'ghost'}
                  className={`flex-1 ${isLogin ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-600'}`}
                  onClick={() => setIsLogin(true)}
                >
                  Accedi
                </Button>
                <Button
                  variant={!isLogin ? 'default' : 'ghost'}
                  className={`flex-1 ${!isLogin ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-600'}`}
                  onClick={() => setIsLogin(false)}
                >
                  Registrati
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Form Content with Animation */}
              <div className="relative min-h-[400px]">
                <div
                  className={`transition-all duration-300 ${isLogin ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'}`}
                >
                  {isLogin && <LoginForm />}
                </div>
                <div
                  className={`transition-all duration-300 ${!isLogin ? 'opacity-100 translate-x-0 relative' : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'}`}
                >
                  {!isLogin && <RegisterForm />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Continuando accetti i nostri{' '}
              <a href="#" className="text-emerald-600 hover:underline">
                Termini di Servizio
              </a>{' '}
              e{' '}
              <a href="#" className="text-emerald-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AuthPage;
