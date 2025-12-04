import { useEffect } from 'react';
import Auth from './components/features/auth/auth';
import { useAuthStore } from './store/authStore';
import { supabase } from './supabaseClient';
import Dashboard from './components/layouts/dashboard';

const App = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      const session = response.data.session;
      setUser({ id: session?.user.id || '', email: session?.user.email || '' });
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id || '', email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });

    const subscription = data.subscription

    return () => {
      subscription.unsubscribe();
    }


  }, [setUser]);

  if (!user) {
    return <Auth />;
  }
  return <Dashboard />
};

export default App;
