import Nav from '../components/Nav';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnBoardingEmpresa = () => {
    const [cookies] = useCookies(['company', 'CompanyId']);
    const companyId = cookies.CompanyId;

    const [formData, setFormData] = useState({
        nome_empresa: "",
        cnpj: "",
        endereco_empresa: "",
        n_empresa: "",
        cidade_empresa: "",
        estado_empresa: "",
        pais_empresa: "",
        telefone_empresa: "",
        email_empresa: "",
        about_empresa: "",
        matches: []
    });

    let navigate = useNavigate();

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/company/companies/${companyId}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Erro ao carregar os dados da empresa:', error);
            }
        };

        if (companyId) {
            fetchCompanyData();
        }
    }, [companyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8000/company/putCompany', formData);
            if (response.status === 200) navigate('/dashboard');
        } catch (err) {
            console.error('Erro ao atualizar os dados da empresa:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <Nav setShowModal={() => { }} showModal={false} />
            <div className="onboarding">
                <h2>CRIE SUA CONTA</h2>
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="nome_empresa">Nome da Empresa</label>
                        <input id="nome_empresa" type='text' name="nome_empresa" placeholder="Nome da Empresa" required={true} value={formData.nome_empresa} onChange={handleChange} />
                        <label htmlFor="cnpj">CNPJ</label>
                        <div className="multiple-input-container">
                            <input id="cnpj" type='text' name="cnpj" placeholder="00.000.000/0000-00" required={true} value={formData.cnpj} onChange={handleChange} />
                        </div>
                        <label htmlFor="endereco_empresa">Endereço</label>
                        <div className="multiple-input-container">
                            <input id="endereco_empresa" type='text' name="endereco_empresa" placeholder="Rua Exemplo" required={true} value={formData.endereco_empresa} onChange={handleChange} />
                            <input className='div-number' id="n_empresa" type='number' name="n_empresa" placeholder="Nº" required={true} value={formData.n_empresa} onChange={handleChange} />
                            <input id="cidade_empresa" type='text' name="cidade_empresa" placeholder="Cidade" required={true} value={formData.cidade_empresa} onChange={handleChange} />
                        </div>
                        <div className="multiple-input-container">
                            <input id="estado_empresa" type='text' name="estado_empresa" placeholder="Estado" required={true} value={formData.estado_empresa} onChange={handleChange} />
                            <input id="pais_empresa" type='text' name="pais_empresa" placeholder="País" required={true} value={formData.pais_empresa} onChange={handleChange} />
                        </div>
                        <label>Contatos</label>
                        <div className="multiple-input-container">
                            <input id="telefone_empresa" type='text' name="telefone_empresa" placeholder="Telefone" required={true} value={formData.telefone_empresa} onChange={handleChange} />
                            <input id="email_empresa" type='text' name="email_empresa" placeholder="E-mail" required={true} value={formData.email_empresa} onChange={handleChange} />
                        </div>
                        <label htmlFor="about_empresa">Sobre a Empresa</label>
                        <input id="about_empresa" type="text" name="about_empresa" required={true} placeholder="Sobre..." value={formData.about_empresa} onChange={handleChange} />
                        <button className='submit-forms' type="submit">SALVAR</button>
                    </section>
                    {/* <section>
                        <label htmlFor="url">Logo da Empresa</label>
                        <input type="image" src="logo192.png" name="image" id="url" onChange={handleChange} required={true} />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview" />}
                        </div>
                    </section> */}
                </form>
            </div>
        </>
    );
};

export default OnBoardingEmpresa;
