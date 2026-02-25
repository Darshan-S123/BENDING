import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/');
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="login-container">
            <div className={`glass login-card ${error ? 'shake' : ''}`}>
                <div className="login-header">
                    <div className="shield-icon">
                        <ShieldCheck size={32} color="var(--accent)" />
                    </div>
                    <h1>SECURE ACCESS</h1>
                    <p>Enter Master PIN to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="pin-input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Enter 4-digit PIN"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={4}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="error-msg">
                            <AlertCircle size={14} />
                            <span>Invalid PIN Access Denied</span>
                        </div>
                    )}

                    <button type="submit" className="login-btn">
                        UNLOCK SYSTEM
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2026 SS FINANCE • High-Level Encryption Active</p>
                </div>
            </div>

            <style>{`
                .login-container {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                }
                .login-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 3rem;
                    border-radius: 2rem;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: fadeIn 0.5s ease-out;
                }
                .shield-icon {
                    width: 64px;
                    height: 64px;
                    background: rgba(202, 138, 4, 0.1);
                    border-radius: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 8px 32px rgba(202, 138, 4, 0.2);
                }
                h1 {
                    font-size: 1.5rem;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.5rem;
                    font-weight: 800;
                }
                .login-header p {
                    color: var(--muted-foreground);
                    font-size: 0.875rem;
                    margin-bottom: 2.5rem;
                }
                .pin-input-group {
                    position: relative;
                    margin-bottom: 1.5rem;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--muted-foreground);
                }
                .pin-input-group input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--card-border);
                    padding: 1rem 1rem 1rem 3rem;
                    border-radius: 0.75rem;
                    color: white;
                    font-size: 1.25rem;
                    letter-spacing: 0.5em;
                    text-align: center;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .pin-input-group input:focus {
                    border-color: var(--accent);
                    background: rgba(255, 255, 255, 0.05);
                }
                .login-btn {
                    width: 100%;
                    background: var(--accent);
                    color: var(--accent-foreground);
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(202, 138, 4, 0.3);
                }
                .error-msg {
                    color: #ef4444;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }
                .login-footer {
                    margin-top: 2.5rem;
                    font-size: 0.7rem;
                    color: var(--muted-foreground);
                    opacity: 0.5;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                    border-color: #ef4444 !important;
                }
            `}</style>
        </div>
    );
};

export default Login;
