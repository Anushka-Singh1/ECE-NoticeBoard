import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isLogin && !displayName) {
      setError('Please enter a display name');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // const handleGoogleSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     await signInWithGoogle();
  //     navigate('/');
  //   } catch (err) {
  //     console.error('Google sign in error:', err);
  //     setError(err instanceof Error ? err.message : 'An error occurred with Google sign in');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const handleFacebookSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     await signInWithFacebook();
  //     navigate('/');
  //   } catch (err) {
  //     console.error('Facebook sign in error:', err);
  //     setError(err instanceof Error ? err.message : 'An error occurred with Facebook sign in');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      <main className="max-w-md mx-auto px-4 py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h1>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert 
                variant="error" 
                className="mb-4"
                onClose={() => setError(null)}
              >
                <p>{error}</p>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <Input
                    label="Display Name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    fullWidth
                    placeholder="Your name"
                    required={!isLogin}
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                </div>
              )}
              
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder="you@example.com"
                  required
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  placeholder="Your password"
                  required
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              </div>
              
              <Button 
                type="submit" 
                fullWidth 
                isLoading={loading}
                disabled={loading}
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={toggleAuthMode}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};