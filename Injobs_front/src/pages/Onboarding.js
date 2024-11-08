import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OnBoarding = () => {
  const [cookies] = useCookies(["user", "UserId"]);
  const userId = cookies.UserId;
  const [editIndex, setEditIndex] = useState(null);
  const [editIndexExperiencia, setEditIndexExperiencia] = useState(null);

  const [formData, setFormData] = useState({
    user_id: userId,
    nome_candidato: "",
    cpf_candidato: "",
    endereco_candidato: "",
    n_candidato: "",
    cidade_candidato: "",
    estado_candidato: "",
    pais_candidato: "",
    dob: "",
    gender_identity: "",
    telefone_candidato: "",
    about_candidato: "",
    linkedin_candidato: "",
    links_candidato: [],
    formacoes: [],
    habilidades: [],
    experiencias: [],
    matches: [],
  });

  let navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/users/${userId}`
        );

        // Garantir que 'habilidades' seja um array após o fetch
        const fetchedData = response.data;
        fetchedData.habilidades = fetchedData.habilidades || [];  // Garantir que habilidades seja um array

        setFormData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.put("http://localhost:8000/user/putUser", {
        formData,
      });
      const success = response.status === 200;
      if (success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeExperiencia = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addLink = () => {
    const newLink = formData.linkInput.trim();
    if (newLink) {
      setFormData((prevState) => ({
        ...prevState,
        links_candidato: [...(prevState.links_candidato || []), newLink],
        linkInput: "",
      }));
    }
  };

  const deleteLink = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      links_candidato: prevState.links_candidato.filter((_, i) => i !== index), // Remove o link do array
    }));
  };

  const addFormacao = () => {
    const newFormacao = {
      nivel_escolaridade_candidato: formData.nivel_escolaridade_candidato,
      curso_candidato: formData.curso_candidato,
      instituicao_candidato: formData.instituicao_candidato,
      data_inicio: formData.data_inicio,
      data_termino: formData.data_termino,
      estado_estudo: formData.estado_estudo,
    };

    setFormData((prevState) => {
      const updatedFormacoes = prevState.formacoes || [];

      if (editIndex !== null) {
        updatedFormacoes[editIndex] = newFormacao;
        setEditIndex(null);
      } else {
        updatedFormacoes.push(newFormacao);
      }

      return { ...prevState, formacoes: updatedFormacoes };
    });

    setFormData((prevState) => ({
      ...prevState,
      nivel_escolaridade_candidato: "",
      curso_candidato: "",
      instituicao_candidato: "",
      data_inicio: "",
      data_termino: "",
      estado_estudo: "",
    }));
  };

  const editFormacao = (index, e) => {
    e.preventDefault();
    setFormData((prevState) => {
      const formacaoToEdit = prevState.formacoes[index];

      return {
        ...prevState,
        nivel_escolaridade_candidato:
          formacaoToEdit.nivel_escolaridade_candidato,
        curso_candidato: formacaoToEdit.curso_candidato,
        instituicao_candidato: formacaoToEdit.instituicao_candidato,
        data_inicio: formacaoToEdit.data_inicio,
        data_termino: formacaoToEdit.data_termino,
        estado_estudo: formacaoToEdit.estado_estudo,
      };
    });
    setEditIndex(index);
  };

  const deleteFormacao = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      formacoes: (prevState.formacoes || []).filter((_, i) => i !== index),
    }));
  };

  const addHabilidade = (e) => {
    e.preventDefault();

    const newHabilidade = {
      tipo_habilidade: formData.tipo_habilidade,
      habilidade_candidato: formData.habilidade_candidato,
      nivel_conhecimento: formData.nivel_conhecimento,
    };

    // Garantir que habilidades seja um array antes de usar o .map
  const habilidades = formData.habilidades || [];

    if (editIndex !== null) {
      const habilidadesAtualizadas = formData.habilidades.map(
        (habilidade, index) =>
          index === editIndex ? newHabilidade : habilidade
      );

      setFormData((prevState) => ({
        ...prevState,
        habilidades: habilidadesAtualizadas,
      }));

      setEditIndex(null);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        habilidades: [...prevState.habilidades, newHabilidade],
      }));
    }

    setFormData((prevState) => ({
      ...prevState,
      tipo_habilidade: "",
      habilidade_candidato: "",
      nivel_conhecimento: 0,
    }));
  };

  const editHabilidade = (index, e) => {
    e.preventDefault();
    const habilidadeParaEditar = formData.habilidades[index];

    setFormData((prevState) => ({
      ...prevState,
      tipo_habilidade: habilidadeParaEditar.tipo_habilidade,
      habilidade_candidato: habilidadeParaEditar.habilidade_candidato,
      nivel_conhecimento: habilidadeParaEditar.nivel_conhecimento,
    }));

    setEditIndex(index);
  };

  const deleteHabilidade = (index) => {
    const novasHabilidades = formData.habilidades.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      habilidades: novasHabilidades,
    }));
  };

  const addExperiencia = () => {
    const novaExperiencia = {
      nome_empresa: formData.nome_empresa,
      cargo: formData.cargo,
      tipo_cargo: formData.tipo_cargo,
      data_entrada: formData.data_entrada,
      data_saida: formData.data_saida,
      emprego_atual: formData.emprego_atual,
    };

    setFormData((prevState) => ({
      ...prevState,
      experiencias: [...(prevState.experiencias || []), novaExperiencia],
      nome_empresa: "", // Limpa o campo após adicionar
      cargo: "",
      tipo_cargo: "CLT", // Reseta para o valor padrão
      data_entrada: "",
      data_saida: "",
      emprego_atual: false,
    }));
  };

  const editExperiencia = (index) => {
    const experienciaEditada = formData.experiencias[index];
    setFormData((prevState) => ({
      ...prevState,
      nome_empresa: experienciaEditada.nome_empresa,
      cargo: experienciaEditada.cargo,
      tipo_cargo: experienciaEditada.tipo_cargo,
      data_entrada: experienciaEditada.data_entrada,
      data_saida: experienciaEditada.data_saida,
      emprego_atual: experienciaEditada.emprego_atual,
    }));
    setEditIndexExperiencia(index);
  };

  const deleteExperiencia = (index) => {
    const updatedExperiencias = formData.experiencias.filter(
      (_, i) => i !== index
    );
    setFormData((prevState) => ({
      ...prevState,
      experiencias: updatedExperiencias,
    }));
  };

  const TipoHabilidade = {
    VAZIO: "Selecione",
    TECNICA: "Técnica",
    COMPORTAMENTAL: "Comportamental",
    CERTIFICACAO: "Certificação",
  };

  const NivelEscolaridade = {
    VAZIO: "Selecione",
    ENSINO_FUNDAMENTAL: "Ensino Fundamental",
    ENSINO_MEDIO: "Ensino Médio",
    CURSO_TECNICO: "Curso Técnico",
    ENSINO_SUPERIOR: "Ensino Superior",
    POS_GRADUACAO: "Pós-Graduação",
    MESTRADO: "Mestrado",
    DOUTORADO: "Doutorado",
    POS_DOUTORADO: "Pós-Doutorado",
    CURSO_EXTENSAO: "Curso Profissionalizante",
  };

  const EstadoEscolaridade = {
    VAZIO: "Selecione",
    CURSANDO: "Cursando",
    INTERROMPIDO: "Interrompido",
    COMPLETO: "Completo",
  };

  const renderStars = (nivel) => {
    return [...Array(5)].map((_, index) => {
      const value = index + 1;
      return (
        <span
          key={index}
          style={{
            color: nivel >= value ? "crimson" : "gray",
            cursor: "pointer",
          }}
        >
          {value % 1 === 0 ? "★" : "☆"}
        </span>
      );
    });
  };

  return (
    <>
      <Nav setShowModal={() => { }} showModal={false} />
      <div className="scrolling-class">
        <div className="onboarding">
          <h1>DADOS DA CONTA</h1>
          <h2>Informações pessoais</h2>
          <form onSubmit={handleSubmit}>
            <section>
              <label htmlFor="nome_candidato">Nome Completo</label>
              <input
                id="nome_candidato"
                type="text"
                name="nome_candidato"
                placeholder="Nome do candidato"
                required={true}
                value={formData.nome_candidato}
                onChange={handleChange}
              />
              <label htmlFor="cpf_candidato">CPF</label>
              <input
                id="cpf_candidato"
                type="text"
                name="cpf_candidato"
                placeholder="000.000.000-00"
                required={true}
                value={formData.cpf_candidato}
                onChange={handleChange}
              />
              <label htmlFor="endereco_candidato">Endereço</label>
              <div className="multiple-input-container">
                <input
                  id="endereco_candidato"
                  type="text"
                  name="endereco_candidato"
                  placeholder="Rua Exemplo"
                  required={true}
                  value={formData.endereco_candidato}
                  onChange={handleChange}
                />
                <input
                  className="div-number"
                  id="n_candidato"
                  type="number"
                  name="n_candidato"
                  placeholder="Nº"
                  required={true}
                  value={formData.n_candidato}
                  onChange={handleChange}
                />
                <input
                  id="cidade_candidato"
                  type="text"
                  name="cidade_candidato"
                  placeholder="Cidade"
                  required={true}
                  value={formData.cidade_candidato}
                  onChange={handleChange}
                />
              </div>
              <div className="multiple-input-container">
                <input
                  id="estado_candidato"
                  type="text"
                  name="estado_candidato"
                  placeholder="Estado"
                  required={true}
                  value={formData.estado_candidato}
                  onChange={handleChange}
                />
                <input
                  id="pais_candidato"
                  type="text"
                  name="pais_candidato"
                  placeholder="País"
                  required={true}
                  value={formData.pais_candidato}
                  onChange={handleChange}
                />
              </div>

              <label htmlFor="dob">Data de Nascimento</label>
              <input
                id="dob"
                type="date"
                name="dob"
                required={true}
                value={formData.dob}
                onChange={(e) => handleChange(e)}
              />
              <label>Gênero</label>
              <div className="multiple-input-container">
                <input
                  id="man-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="Masculino"
                  required={true}
                  onChange={handleChange}
                />
                <label htmlFor="man-gender-identity">Masculino</label>
                <input
                  id="woman-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="Feminino"
                  required={true}
                  onChange={handleChange}
                />
                <label htmlFor="woman-gender-identity">Feminino</label>
                <input
                  id="outro-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="Outro"
                  required={true}
                  onChange={handleChange}
                />
                <label htmlFor="outro-gender-identity">Outro</label>
              </div>
              <label htmlFor="telefone_candidato">Telefone</label>
              <input
                id="telefone_candidato"
                type="text"
                name="telefone_candidato"
                placeholder="(XX) XXXXX-XXXX"
                required={true}
                value={formData.telefone_candidato}
                onChange={handleChange}
              />
              <label htmlFor="about_candidato">Sobre</label>
              <textarea
                id="about_candidato"
                name="about_candidato"
                placeholder="Conte um pouco sobre você!"
                required={true}
                value={formData.about_candidato}
                onChange={handleChange}
              ></textarea>
              <label htmlFor="linkedin_candidato">LinkedIn</label>
              <input
                id="linkedin_candidato"
                type="text"
                name="linkedin_candidato"
                placeholder="https://www.linkedin.com/in/exemplo"
                required={true}
                value={formData.linkedin_candidato}
                onChange={handleChange}
              />
              <h3>Links</h3>
              <div>
                <input
                  id="linkInput"
                  type="text"
                  name="linkInput"
                  placeholder="Digite o link"
                  value={formData.linkInput} // Deve ser sempre uma string
                  onChange={handleChange}
                />
                <button type="button" onClick={addLink}>
                  Adicionar Link
                </button>
                <ul>
                  {Array.isArray(formData.links_candidato) &&
                    formData.links_candidato.length > 0 ? (
                    formData.links_candidato.map((link, index) => (
                      <li key={index}>
                        <span>{link}</span>
                        <button onClick={() => deleteLink(index)}>
                          Excluir
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>Nenhum link cadastrado.</li>
                  )}
                </ul>
              </div>
              <button type="submit" className="submit-forms" id="save-button">
                SALVAR INFORMÇÕES PESSOAIS
              </button>
            </section>
          </form>
          <br />
          <br />
          <h2>Formação Acadêmica</h2>
          <form onSubmit={handleSubmit}>
            <section>
              <label htmlFor="nivel_escolaridade_candidato">
                Nível de Escolaridade
              </label>
              <select
                id="nivel_escolaridade_candidato"
                name="nivel_escolaridade_candidato"
                value={formData.nivel_escolaridade_candidato}
                onChange={handleChange}
              >
                <option value="VAZIO">Selecione</option>
                <option value="ENSINO_FUNDAMENTAL">Ensino Fundamental</option>
                <option value="ENSINO_MEDIO">Ensino Médio</option>
                <option value="CURSO_TECNICO">Curso Técnico</option>
                <option value="ENSINO_SUPERIOR">Ensino Superior</option>
                <option value="POS_GRADUACAO">Pós-Graduação</option>
                <option value="MESTRADO">Mestrado</option>
                <option value="DOUTORADO">Doutorado</option>
                <option value="POS_DOUTORADO">Pós-Doutorado</option>
                <option value="CURSO_EXTENSAO">Curso Profissionalizante</option>
              </select>
              <label htmlFor="curso_candidato">Curso</label>
              <input
                id="curso_candidato"
                type="text"
                name="curso_candidato"
                placeholder="Exemplo: Sistemas de Informação"
                value={formData.curso_candidato}
                onChange={handleChange}
              />
              <label htmlFor="instituicao_candidato">
                Instituição de Ensino
              </label>
              <input
                id="instituicao_candidato"
                type="text"
                name="instituicao_candidato"
                placeholder="Nome da instituição onde estudou"
                value={formData.instituicao_candidato}
                onChange={handleChange}
              />
              <div className="multiple-input-container">
                <p>Data de Início</p>
                <input
                  id="data_inicio"
                  type="date"
                  name="data_inicio"
                  value={formData.data_inicio}
                  onChange={handleChange}
                />
                <p>Data de Conclusão</p>
                <input
                  id="data_termino"
                  type="date"
                  name="data_termino"
                  value={formData.data_termino}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="estado_estudo">Estado</label>
              <select
                id="estado_estudo"
                name="estado_estudo"
                value={formData.estado_estudo}
                onChange={handleChange}
              >
                <option value="VAZIO">Selecione</option>
                <option value="CURSANDO">Cursando</option>
                <option value="COMPLETO">Completo</option>
                <option value="INTERROMPIDO">Interrompido</option>
              </select>
              <button type="button" onClick={addFormacao}>
                {editIndex !== null
                  ? "Atualizar Formação"
                  : "Adicionar Formação"}
              </button>
              <ul>
                {(formData.formacoes || []).length > 0 ? (
                  formData.formacoes.map((formacao, index) => {
                    const dataInicio = new Date(formacao.data_inicio);
                    const mesInicio = dataInicio.getMonth() + 1;
                    const anoInicio = dataInicio.getFullYear();
                    const dataTermino = new Date(formacao.data_termino);
                    const mesTermino = dataTermino.getMonth() + 1;
                    const anoTermino = dataTermino.getFullYear();

                    return (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong>{formacao.curso_candidato}</strong> -{" "}
                          {
                            NivelEscolaridade[
                            formacao.nivel_escolaridade_candidato
                            ]
                          }{" "}
                          ({mesInicio}/{anoInicio} - {mesTermino}/{anoTermino})
                          - {EstadoEscolaridade[formacao.estado_estudo]}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <button onClick={(e) => editFormacao(index, e)}>
                            Editar
                          </button>
                          <button onClick={() => deleteFormacao(index)}>
                            Excluir
                          </button>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li>Nenhuma formação cadastrada.</li>
                )}
              </ul>
              <button type="submit" className="submit-forms" id="save-button">
                SALVAR FORMAÇÃO ACADÊMICA
              </button>
            </section>
          </form>
          <br />
          <br />
          <h2>Habilidades</h2>
          <form onSubmit={handleSubmit}>
            <section>
              <label htmlFor="tipo_habilidade">Tipo de Habilidade</label>
              <select
                id="tipo_habilidade"
                name="tipo_habilidade"
                value={formData.tipo_habilidade}
                onChange={handleChange}
              >
                <option value=" ">{TipoHabilidade.VAZIO}</option>
                <option value="TECNICA">{TipoHabilidade.TECNICA}</option>
                <option value="COMPORTAMENTAL">
                  {TipoHabilidade.COMPORTAMENTAL}
                </option>
                <option value="CERTIFICACAO">
                  {TipoHabilidade.CERTIFICACAO}
                </option>
              </select>
              <label htmlFor="habilidade">Habilidade</label>
              <input
                id="habilidade_candidato"
                type="text"
                name="habilidade_candidato"
                placeholder="Exemplo: programação, design, línguas estrangeiras, etc"
                value={formData.habilidade_candidato}
                onChange={handleChange}
              />

              <label htmlFor="nivel_conhecimento">Nível de Conhecimento</label>
              <div
                id="nivel_conhecimento"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "15px",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    Básico
                  </span>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {[...Array(5)].map((_, index) => {
                      const value = index + 1;
                      return (
                        <label key={index} style={{ position: "relative" }}>
                          <input
                            type="radio"
                            name="nivel_conhecimento"
                            value={value}
                            checked={formData.nivel_conhecimento === value}
                            onChange={handleChange}
                            style={{ display: "none" }}
                          />
                          <span
                            style={{
                              fontSize: "40px",
                              color:
                                formData.nivel_conhecimento >= value
                                  ? "crimson"
                                  : "gray",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                nivel_conhecimento: value,
                              })
                            }
                          >
                            {value % 1 === 0 ? "★" : "☆"}{" "}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <span
                    style={{
                      marginLeft: "15px",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    Avançado
                  </span>
                </div>
              </div>
              <button type="button" onClick={addHabilidade}>
                {editIndex !== null
                  ? "Atualizar Habilidade"
                  : "Adicionar Habilidade"}
              </button>

              <ul>
                {formData.habilidades.map((habilidade, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ flex: 2 }}>
                      Habilidade: {habilidade.habilidade_candidato}
                    </strong>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      Tipo: {TipoHabilidade[habilidade.tipo_habilidade]}
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      Nível: {renderStars(habilidade.nivel_conhecimento)}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={(e) => editHabilidade(index, e)}
                        style={{ display: "flex" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteHabilidade(index)}
                        style={{ display: "flex" }}
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="submit" className="submit-forms" id="save-button">
                SALVAR HABILIDADES
              </button>
            </section>
          </form>
          <h2>Experiência</h2>
          <form onSubmit={handleSubmit}>
            <section>
              {/* Campos de entrada */}
              <label htmlFor="nome_empresa">Nome da Empresa</label>
              <input
                id="nome_empresa"
                type="text"
                name="nome_empresa"
                value={formData.nome_empresa}
                onChange={handleChangeExperiencia}
              />

              <label htmlFor="cargo">Cargo</label>
              <input
                id="cargo"
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChangeExperiencia}
              />

              <label htmlFor="tipo_cargo">Tipo de Cargo</label>
              <select
                id="tipo_cargo"
                name="tipo_cargo"
                value={formData.tipo_cargo}
                onChange={handleChangeExperiencia}
              >
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Estagiario">Estagiário</option>
                <option value="Autonomo">Autônomo</option>
                <option value="Temporario">Temporário</option>
              </select>

              <label htmlFor="data_entrada">Data de Entrada</label>
              <input
                id="data_entrada"
                type="date"
                name="data_entrada"
                value={formData.data_entrada}
                onChange={handleChangeExperiencia}
              />

              <label htmlFor="data_saida">Data de Saída</label>
              <input
                id="data_saida"
                type="date"
                name="data_saida"
                value={formData.data_saida}
                onChange={handleChangeExperiencia}
                disabled={formData.emprego_atual}
              />

              <label htmlFor="emprego_atual">Emprego Atual</label>
              <input
                id="emprego_atual"
                type="checkbox"
                name="emprego_atual"
                checked={formData.emprego_atual}
                onChange={handleChangeExperiencia}
              />

              <button type="button" onClick={addExperiencia}>
                {editIndexExperiencia !== null
                  ? "Atualizar Experiência"
                  : "Adicionar Experiência"}
              </button>

              <ul>
                {Array.isArray(formData.experiencias) &&
                  formData.experiencias.length > 0 ? (
                  formData.experiencias.map((experiencia, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>Empresa:</strong> {experiencia.nome_empresa}
                        <br></br>
                        <strong>Cargo:</strong> {experiencia.cargo}
                      </div>
                      <div style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "10px",
                      }}>
                        <button onClick={() => editExperiencia(index)}>
                          Editar
                        </button>
                        <button onClick={() => deleteExperiencia(index)}>
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>Nenhuma experiência adicionada.</li>
                )}
              </ul>

              <button
                type="submit"
                className="submit-forms"
                id="save-experience-button"
              >
                SALVAR EXPERIÊNCIAS
              </button>
            </section>
          </form>
        </div>
      </div>
    </>
  );
};

export default OnBoarding;
