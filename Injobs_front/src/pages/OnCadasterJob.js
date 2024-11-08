import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OnCadasterJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    requirements: [{ requirement: "", proficiency: 0 }],
    benefits: "",
    salary: "",
    work_location: "",
    contract_type: "",
    start_date: "",
    application_deadline: "",
    selection_process: "",
    diversity_policy: "",
    required_documents: "",
    company_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtenha os cookies
    const cookies = document.cookie.split("; ");
    const companyIdCookie = cookies.find((cookie) => cookie.startsWith("CompanyId="));
    
    // Se o cookie existir, extraia o valor
    if (companyIdCookie) {
      const companyId = companyIdCookie.split("=")[1];
      setFormData((prevState) => ({
        ...prevState,
        company_id: companyId,
        
      }));
    } else {
      // Se o cookie não existir, lidere com um erro
      setError("CompanyId não encontrado nos cookies. Por favor, faça login.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verificação adicional dos campos obrigatórios
    if (!formData.job_title || !formData.job_description || !formData.company_id || !formData.benefits) {
        setError("Título, descrição e companyId são obrigatórios.");
        setLoading(false);
        return;
    }

    try {
        // Log dos dados que serão enviados
        console.log("Enviando dados:", formData);

        const response = await fetch("http://localhost:8000/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Vaga criada com sucesso:", data);
            navigate("/dashboard");
        } else {
            const errorData = await response.json();
            setError("Erro ao criar a vaga: " + errorData.message);
            console.error("Erro ao criar a vaga:", errorData);
        }
    } catch (error) {
        setError("Erro de rede: " + error.message);
        console.error("Erro de rede:", error);
    } finally {
        setLoading(false);
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRequirementChange = (index, field, value) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      requirements: updatedRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prevState) => ({
      ...prevState,
      requirements: [...prevState.requirements, { requirement: "", proficiency: 0 }],
    }));
  };

  const removeRequirement = (index) => {
    const updatedRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      requirements: updatedRequirements,
    }));
  };

  return (
    <>
      <Nav setShowModal={() => {}} showModal={false} />
      <div className="onboarding" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>CRIE UMA VAGA DE EMPREGO</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <input
            type="text"
            name="job_title"
            placeholder="Título da vaga"
            value={formData.job_title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="job_description"
            placeholder="Descrição da vaga"
            value={formData.job_description}
            onChange={handleChange}
            required
            style={{ ...inputStyle, height: "100px" }}
          />

          <h3>Requisitos</h3>
          {formData.requirements.map((req, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Requisito"
                value={req.requirement}
                onChange={(e) => handleRequirementChange(index, "requirement", e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Proficiência (1-5)"
                value={req.proficiency}
                onChange={(e) => handleRequirementChange(index, "proficiency", e.target.value)}
                style={inputStyle}
              />
              <button type="button" onClick={() => removeRequirement(index)} style={{ marginLeft: "10px" }}>
                Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addRequirement} style={{ marginTop: "10px" }}>
            Adicionar Requisito
          </button>

          <input
            type="text"
            name="benefits"
            placeholder="Benefícios"
            value={formData.benefits}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="salary"
            placeholder="Salário"
            value={formData.salary}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="work_location"
            placeholder="Localização do trabalho"
            value={formData.work_location}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="contract_type"
            placeholder="Tipo de contrato"
            value={formData.contract_type}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="date"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="selection_process"
            placeholder="Processo de seleção"
            value={formData.selection_process}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="diversity_policy"
            placeholder="Política de diversidade"
            value={formData.diversity_policy}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="required_documents"
            placeholder="Documentos necessários"
            value={formData.required_documents}
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={{ padding: "10px 15px", cursor: "pointer", marginTop: "20px" }} disabled={loading}>
            {loading ? "Criando..." : "Criar Vaga"}
          </button>
        </form>
      </div>
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default OnCadasterJob;
