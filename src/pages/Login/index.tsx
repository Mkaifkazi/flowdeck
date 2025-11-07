import { useState, FormEvent } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { setUser } from '@features/auth/authSlice';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('demo@flowdeck.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      dispatch(setUser(data.user));
      toast.success('Welcome to Flowdeck!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Floating orbs background */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <Container>
        <div className="login-container">
          <div className="text-center mb-5">
            <div className="logo-wrapper mb-3">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="logo-icon">
                <rect width="60" height="60" rx="16" fill="url(#gradient1)"/>
                <path d="M20 30L27 37L40 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="60" y2="60">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="brand-title mb-2">Flowdeck</h1>
            <p className="brand-subtitle">Project Management Made Simple</p>
          </div>

          <Card className="login-card shadow-lg">
            <Card.Body>
              <h4 className="text-center mb-4">Welcome Back!</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 sign-in-btn"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In →'
                  )}
                </Button>
              </Form>

              <div className="mt-4 text-center">
                <div className="demo-badge">
                  <span>✨ Demo credentials are pre-filled</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <p className="footer-text">
              Made with ❤️ by Flowdeck Team
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
