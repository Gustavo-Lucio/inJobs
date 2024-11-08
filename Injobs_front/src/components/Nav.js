// import { useEffect, useState } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { FaHouse } from "react-icons/fa6";
// import { useCookies } from "react-cookie";

// const Nav = ({
//   setShowModal,
//   showModal,
//   setIsSignUp,
//   setShowModal2,
//   showModal2,
//   setIsSignUp2,
// }) => {
//   const location = useLocation();
//   const navigate = useNavigate(); // Hook para navegação
//   const [currentPath, setCurrentPath] = useState(location.pathname);
//   const [cookies, removeCookie] = useCookies(["AuthToken", "UserType"]); // Obtendo e removendo cookies
//   const authToken = cookies.AuthToken;
//   const userType = cookies.UserType; // Tipo de usuário (candidato ou empresa)

//   useEffect(() => {
//     setCurrentPath(location.pathname);
//   }, [location.pathname]);

//   const handleClick = () => {
//     setShowModal(true);
//     setIsSignUp(false);
//   };

//   const handleClick2 = () => {
//     setShowModal2(true);
//     setIsSignUp2(false);
//   };

//   // Função para fazer logout
//   const handleLogout = () => {
//     removeCookie("AuthToken", { path: "/" });
//     removeCookie("UserType", { path: "/" });
//     navigate("/"); // Redireciona para a home após logout
//   };

//   return (
//     <nav>
//       {currentPath === "/" &&
//         (!authToken || userType !== "candidato" || userType !== "empresa") && (
//           <>
//             <button
//               className="primary-button-login-cand"
//               onClick={handleClick}
//               disabled={showModal}
//             >
//               Login Candidato
//             </button>
//             <button
//               className="primary-button-login-emp"
//               onClick={handleClick2}
//               disabled={showModal2}
//             >
//               Login Empresa
//             </button>
//           </>
//         )}

//       {[
//         "/dashboard",
//         "/onBoarding",
//         "/onBoardingEmpresa",
//         "/onCadasterJob",
//       ].includes(currentPath) && (
//         <>
//           <div className="logo-container">
//             <Link to="/dashboard" className="home-icon">
//               <FaHouse />
//             </Link>

//             <input
//               type="text"
//               placeholder="Search keywords..."
//               className="search-bar"
//             />
//           </div>

//           {/* Verifica se o userType é candidato ou empresa */}
//           {userType === "candidato" ? (
//             <Link to="/onBoarding" className="primary-button-edit-profile">
//               Editar Perfil (Candidato)
//             </Link>
//           ) : (
//             <Link
//               to="/onBoardingEmpresa"
//               className="primary-button-edit-profile"
//             >
//               Editar Perfil (Empresa)
//             </Link>
//           )}

//           {(currentPath === "/dashboard" ||
//             currentPath === "/onBoardingEmpresa" ||
//             currentPath === "/onCadasterJob") &&
//             authToken &&
//             userType === "empresa" && (
//               <Link to="/onCadasterJob" className="primary-button-criar-vaga">
//                 Publicar Vaga
//               </Link>
//             )}

//           <button onClick={handleLogout} className="primary-button-logout">
//             Logout
//           </button>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Nav;

import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";
import { useCookies } from "react-cookie";

const Nav = ({
  setShowModal,
  showModal,
  setIsSignUp,
  setShowModal2,
  showModal2,
  setIsSignUp2,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [cookies, removeCookie] = useCookies(["AuthToken", "UserType"]);
  const authToken = cookies.AuthToken;
  const userType = cookies.UserType;
  const [showOpenPositions, setShowOpenPositions] = useState(false); // Estado para controlar a visibilidade do dropdown

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  const handleClick2 = () => {
    setShowModal2(true);
    setIsSignUp2(false);
  };

  const handleLogout = () => {
    removeCookie("AuthToken", { path: "/" });
    removeCookie("UserType", { path: "/" });
    removeCookie("UserId", { path: "/" });
    navigate("/");
  };

  const toggleOpenPositions = () => {
    setShowOpenPositions((prev) => !prev); // Alterna a visibilidade do dropdown
  };

  // Lista de vagas abertas (exemplo)
  const openPositions = [
    { id: 1, title: "Desenvolvedor Frontend", location: "São Paulo" },
    { id: 2, title: "Analista de Sistemas", location: "Rio de Janeiro" },
  ];

  return (
    <nav>
      {currentPath === "/" &&
        (!authToken || userType !== "candidato" || userType !== "empresa") && (
          <>
            <button
              className="primary-button-login-cand"
              onClick={handleClick}
              disabled={showModal}
            >
              Login Candidato
            </button>
            <button
              className="primary-button-login-emp"
              onClick={handleClick2}
              disabled={showModal2}
            >
              Login Empresa
            </button>
          </>
        )}

      {[
        "/dashboard",
        "/onBoarding",
        "/onBoardingEmpresa",
        "/onCadasterJob",
      ].includes(currentPath) && (
        <>
          <div className="logo-container">
            <Link to="/dashboard" className="home-icon">
              <FaHouse />
            </Link>

            <input
              type="text"
              placeholder="Search keywords..."
              className="search-bar"
            />
          </div>

          {(currentPath === "/dashboard" ||
            currentPath === "/onBoardingEmpresa" ||
            currentPath === "/onCadasterJob") &&
            authToken &&
            userType === "empresa" && (
              <Link to="/onCadasterJob" className="primary-button-criar-vaga">
                Publicar Vaga
              </Link>
            )}

          {(currentPath === "/dashboard" ||
            currentPath === "/onBoardingEmpresa" ||
            currentPath === "/onCadasterJob") &&
            authToken &&
            userType === "empresa" && (
              <>
                <div className="dropdown">
                  <button
                    onClick={toggleOpenPositions}
                    className="primary-button-ver-vaga"
                  >
                    Vagas Abertas
                  </button>

                  {showOpenPositions && (
                    <ul className="open-positions-dropdown">
                      {openPositions.map((position) => (
                        <li key={position.id}>
                          <strong>{position.title}</strong> -{" "}
                          {position.location}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

          {userType === "candidato" ? (
            <Link to="/onBoarding" className="primary-button-edit-profile">
              Editar Perfil (Candidato)
            </Link>
          ) : (
            <Link
              to="/onBoardingEmpresa"
              className="primary-button-edit-profile"
            >
              Editar Perfil (Empresa)
            </Link>
          )}

          <button onClick={handleLogout} className="primary-button-logout">
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Nav;
