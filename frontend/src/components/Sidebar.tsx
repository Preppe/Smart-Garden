import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarData } from '@/hooks/useSidebarData';
import { useAuthStore } from '@/stores/authStore';
import { useLogoutUserMutation } from '@/graphql/generated/types';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Home, Sprout, Activity, Settings, BarChart3, Calendar, Bell, ChevronLeft, ChevronRight, Plus, User, LogOut } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { gardensCount, cultivationsCount } = useSidebarData();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  const [logoutUser] = useLogoutUserMutation({
    onCompleted: () => {
      logout();
      toast({
        title: 'Logout effettuato',
        description: 'Arrivederci!',
      });
      navigate('/auth');
    },
    onError: () => {
      // Even if the server logout fails, we still clear local state
      logout();
      navigate('/auth');
    },
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Fallback - clear local state even if server call fails
      logout();
      navigate('/auth');
    }
  };

  // Helper function to get user initials
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Garden',
      href: '/gardens',
      icon: Leaf,
      current: location.pathname.startsWith('/gardens'),
      badge: gardensCount > 0 ? gardensCount.toString() : undefined,
    },
    {
      name: 'Coltivazioni',
      href: '/cultivations',
      icon: Sprout,
      current: location.pathname.startsWith('/cultivations'),
      badge: cultivationsCount > 0 ? cultivationsCount.toString() : undefined,
    },
    {
      name: 'Sensori',
      href: '/sensors',
      icon: Activity,
      current: location.pathname.startsWith('/sensors'),
      badge: undefined, // Will be dynamic when sensor data is available
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: location.pathname.startsWith('/analytics'),
    },
    {
      name: 'Calendario',
      href: '/calendar',
      icon: Calendar,
      current: location.pathname.startsWith('/calendar'),
    },
  ];

  const quickActions = [
    {
      name: 'Nuovo Garden',
      href: '/gardens/new',
      icon: Plus,
      description: 'Crea un nuovo spazio verde',
    },
    {
      name: 'Nuova Coltivazione',
      href: '/cultivations/new',
      icon: Sprout,
      description: 'Aggiungi una pianta',
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white/90 backdrop-blur-md border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Orto</h2>
              <p className="text-xs text-gray-500">Smart Garden</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={item.current ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start h-10', item.current && 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', isCollapsed && 'px-2')}
                >
                  <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 text-xs bg-gray-100 text-gray-600">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <>
            <Separator className="my-4" />

            {/* Quick Actions */}
            <div className="p-2">
              <h3 className="px-2 mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Azioni Rapide</h3>
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.name} to={action.href}>
                      <Button variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-emerald-50">
                        <Icon className="h-4 w-4 mr-3 text-emerald-600" />
                        <div className="text-left">
                          <div className="text-sm font-medium">{action.name}</div>
                          <div className="text-xs text-gray-500">{action.description}</div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Status */}
            <div className="p-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">Sistema Online</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Tutti i sensori funzionanti</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <>
          <Separator />
          {/* User Profile Section */}
          <div className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-emerald-50">
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarFallback className="text-sm bg-emerald-100 text-emerald-700">
                      {user ? getUserInitials(user.firstName, user.lastName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="flex flex-col items-start">
                  <div className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'User'}</div>
                  <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profilo</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Impostazioni</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
