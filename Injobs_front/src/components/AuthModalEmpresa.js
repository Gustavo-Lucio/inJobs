import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthModalEmpresa = ({ setShowModal2, isSignUp2 }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [cookies, setCookie] = useCookies(['company']);
    const navigate = useNavigate();

    const handleClick2 = () => {
        setShowModal2(false);
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp2 && password !== confirmPassword) {
                setError('As senhas precisam corresponder!');
                return;
            }

            const response = await axios.post(`http://localhost:8000/company/${isSignUp2 ? 'signup' : 'login'}`, { email, password });

            // Armazenando os cookies após autenticação
            setCookie('AuthToken', response.data.token, { path: '/' });
            setCookie('CompanyId', response.data.companyId, { path: '/' });
            setCookie('UserType', 'empresa', { path: '/' });

            if (response.status === 201) {
                if (isSignUp2) {
                    navigate('/onboardingEmpresa');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            // Verificando erros específicos da resposta
            if (error.response) {
                setError('Email ou senha incorretos.');
            } else {
                setError('Erro de comunicação com o servidor.');
            }
        }
    };

    return (
        <div className="auth-modal-emp">
            <div className="close-icon" onClick={handleClick2}>ⓧ</div>
            <h2 className="h2-auth-modal">{isSignUp2 ? 'CONTA PERFIL EMPRESA' : 'LOGIN EMPRESA'}</h2>
            <p>
                Ao clicar em Login, você concorda com nossos termos. Saiba como processamos os seus dados na nossa Política de Privacidade e Política de Cookies.
            </p>
            <form onSubmit={handleSubmit2}>
                <input
                    type="email"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp2 && (
                    <input
                        type="password"
                        placeholder="Confirme a senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <input className="secondary-button" type="submit" value={isSignUp2 ? "Cadastrar" : "Login"} />
                {error && <p className="error-message">{error}</p>}
            </form>
            <hr />
        </div>
    );
};

export default AuthModalEmpresa;
