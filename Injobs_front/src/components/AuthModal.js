import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [cookies, setCookie] = useCookies(['user']);
    
    let navigate = useNavigate();

    const handleClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('As senhas precisam corresponder!');
                return;
            }

            // const response = await axios.post(`http://localhost:8000/user/${isSignUp ? 'signup' : 'login'}, { email, password }`); tava assim, tive que arrumar
            const response = await axios.post(`http://localhost:8000/user/${isSignUp ? 'signup' : 'login'}`, { email, password });

            // Armazenar o token e o ID do usuário nos cookies
            setCookie('AuthToken', response.data.token, { path: '/' });
            setCookie('UserId', response.data.userId, { path: '/' });
            setCookie('UserType', 'candidato', { path: '/' }); // Tipo manualmente setado como "candidato"

            const success = response.status === 201;

            if (success && isSignUp) {
                navigate('/onboarding');
            } else if (success && !isSignUp) {
                navigate('/dashboard');
            }

            window.location.reload();    

        } catch (error) {
            console.error('Erro ao realizar login ou cadastro:', error);
            setError('Email ou senha incorretos.'); // Mensagem de erro genérica
        }
    };

    return (
        <div className="auth-modal-cand">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>

            <h2 className="h2-auth-modal">{isSignUp ? 'CONTA PERFIL CANDIDATO' : 'LOGIN CANDIDATO'}</h2>
            <p>
                Ao clicar em Login, você concorda com nossos termos. Saiba como processamos os seus dados na nossa Política de Privacidade e Política de Cookies.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && (
                    <input
                        type="password"
                        id="password-check"
                        name="password-check"
                        placeholder="Confirme a senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <input className="secondary-button" type="submit" value={isSignUp ? "Cadastrar" : "Login"} />
                {error && <p className="error-message">{error}</p>}
            </form>
            <hr />
        </div>
    );
};

export default AuthModal;