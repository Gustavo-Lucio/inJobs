import React, { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import Nav from "../components/Nav";
import { FaCheck, FaXmark } from "react-icons/fa6";
import axios from "axios";

function Dashboard() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("informacoes");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCandidateView, setIsCandidateView] = useState(true);
  
  const [candidates, setCandidates] = useState([]);
  const [jobListings, setJobListings] = useState([]);

  const fetchData = async () => {
    try {
      const [candidatesResponse, jobListingsResponse] = await Promise.all([
        axios.get("http://localhost:8000/user"), // Ajuste a URL
        axios.get("http://localhost:8000/jobs")  // Ajuste a URL
      ]);
      setCandidates(candidatesResponse.data);
      setJobListings(jobListingsResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao buscar dados. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedItem(null);
    }, 500);
  };

  const handleAccept = () => {
    alert("Item aceito!");
    closeModal();
  };

  const handleReject = () => {
    alert("Item recusado!");
    closeModal();
  };

  const toggleView = () => {
    setIsCandidateView((prev) => !prev);
  };

  return (
    <div>
      <Nav setShowModal={() => {}} showModal={false} />
      <div className="dashboard">
        <ChatContainer user={{ matches: [] }} />
        <div className="list-container">
          <h2>{isCandidateView ? "Candidatos" : "Vagas"}</h2>
          <button onClick={toggleView} className="toggle-view-button">
            {isCandidateView ? "Ver Vagas" : "Ver Candidatos"}
          </button>
          <ul className="candidate-list">
            {(isCandidateView ? candidates : jobListings).map((item) => (
              <li
                key={isCandidateView ? item._id : item._id} // Usando _id para usuários e vagas
                onDoubleClick={() => handleItemClick(item)}
                className="candidate-item"
              >
                <div className="candidate-info">
                  <h3>{isCandidateView ? item.nome_candidato : item.job_title}</h3>
                  <p>{isCandidateView ? item.about_candidato : item.job_description}</p>
                  <p>
                    {isCandidateView
                      ? `Telefone: ${item.telefone_candidato}`
                      : `Localização: ${item.work_location}`}
                  </p>
                </div>
                <div className="modal-buttons">
                  <button className="accept-button" onClick={handleAccept}>
                    <FaCheck /> Aceitar
                  </button>
                  <button className="reject-button" onClick={handleReject}>
                    <FaXmark /> Recusar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedItem && (
        <div className={`modal ${isModalVisible ? "show" : ""}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{isCandidateView ? selectedItem.nome_candidato : selectedItem.job_title}</h2>
            <div className="tabs">
              <button onClick={() => setActiveTab("informacoes")}>Informações</button>
              {isCandidateView ? (
                <>
                  <button onClick={() => setActiveTab("formacoes")}>Formações</button>
                  <button onClick={() => setActiveTab("habilidades")}>Habilidades</button>
                  <button onClick={() => setActiveTab("experiencias")}>Experiências</button>
                </>
              ) : (
                <>
                  <button onClick={() => setActiveTab("descricao")}>Descrição</button>
                  <button onClick={() => setActiveTab("requisitos")}>Requisitos</button>
                  <button onClick={() => setActiveTab("beneficios")}>Benefícios</button>
                </>
              )}
            </div>
            {activeTab === "informacoes" && (
              <div>
                {isCandidateView ? (
                  <>
                    <p><strong>Email:</strong> {selectedItem.email_candidato || "N/A"}</p>
                    <p><strong>Data de Nascimento:</strong> {`${selectedItem.dob_day}/${selectedItem.dob_month}/${selectedItem.dob_year}` || "N/A"}</p>
                    <p><strong>Cidade:</strong> {selectedItem.cidade_candidato || "N/A"}</p>
                    <p><strong>LinkedIn:</strong> <a href={selectedItem.linkedin_candidato || "#"}>{selectedItem.linkedin_candidato || "N/A"}</a></p>
                  </>
                ) : (
                  <>
                    <p><strong>Salário:</strong> {selectedItem.salary || "N/A"}</p>
                    <p><strong>Localização:</strong> {selectedItem.work_location || "N/A"}</p>
                  </>
                )}
              </div>
            )}
            {activeTab === "descricao" && !isCandidateView && selectedItem.job_description && (
              <div>
                <h3>Descrição</h3>
                <p>{selectedItem.job_description}</p>
              </div>
            )}
            {activeTab === "requisitos" && !isCandidateView && selectedItem.requirements && (
                <div>
                  <h3>Requisitos</h3>
                  <ul>
                    {selectedItem.requirements.map((req, index) => (
                      <li key={`requirement-${index}`}>
                        <p><strong>Requisito:</strong> {req.requirement}</p>
                        <p><strong>Proficiência:</strong> {req.proficiency}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {activeTab === "beneficios" && !isCandidateView && selectedItem.benefits && (
              <div>
                <h3>Benefícios</h3>
                <p>{selectedItem.benefits}</p>
              </div>
            )}
            <div className="modal-buttons" id="button-container">
              <button className="accept-button" onClick={handleAccept}>
                <FaCheck /> Aceitar
              </button>
              <button className="reject-button" onClick={handleReject}>
                <FaXmark /> Recusar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
