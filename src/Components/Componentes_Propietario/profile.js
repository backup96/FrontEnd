import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";

const Profile = ({ name }) => {  
  const [loading, setLoading] = useState(true);
  const [perfilData, setPerfilData] = useState([]);
  const [isEditing, setIsEditing] = useState({
    telefono: false,
    correo: false
  });
  const [editableData, setEditableData] = useState({
    telefono: "",
    correo: "",
    nombreUsuario: "",
  });
   const proxy = process.env.REACT_APP_API_URL;

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(`${proxy}/vista_perfil`, { name });
        setPerfilData(response.data);
        setEditableData({
          telefono: response.data[0].telefono || "",
          correo: response.data[0].correo || "",
          nombreUsuario: response.data[0].nombreUsuario || "",
        });
        setLoading(false);
      } catch (error) {
        toast.error("Error al obtener los datos");
      }
    };

    fetchProfile();
  }, [name]);  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = async (field, event) => {
    event?.preventDefault();  // Prevenir comportamiento por defecto si existe el evento
    
    if (isEditing[field]) {
      if (!isUpdating) {  // Verificar si no hay una actualización en curso
        await handleUpdate();
      }
    }
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = async () => {
    if (isUpdating) return;  
    
    setIsUpdating(true);
    try {
      const response = await axios.post(`${proxy}/actualizar_perfil`, {
        telefono: editableData.telefono,
        correo: editableData.correo,
        nombreUsuario: perfilData[0].nombreUsuario 
      });
      if (response.data.message) {
        toast.success("Perfil actualizado exitosamente");
        setPerfilData((prevData) => {
          const newData = [...prevData];
          newData[0] = { ...newData[0], ...editableData };
          return newData;
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al actualizar el perfil");
    } finally {
      setIsUpdating(false);
    }
  };


  const handlePasswordChange = async () => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    // Validación de campos vacíos
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor complete ambos campos");
      return;
    }
  
    // Validación de contraseñas coincidentes
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
  
    // Validación de longitud mínima
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
  
    // Validación de que comience con mayúscula y contenga letras y números
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Z][A-Za-z\d]*$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("La contraseña debe comenzar con una letra mayúscula y contener letras y números");
      return;
    }
  
    try {
      const response = await axios.post(`${proxy}/cambiar_contrasena`, {
        newPassword,
        nombreUsuario: perfilData[0].nombreUsuario,
      });
  
      if (response.data.message) {
        toast.success("Contraseña actualizada exitosamente");
        setShowModal(false);
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
      }
    } catch (error) {
      // toast.error(error.response?.data?.error || "Error al cambiar la contraseña");
    }
  };
  
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer limit={1} />
      <h1 className="profile-title">Mi Perfil</h1>
      <br></br>
      <div className="profile-grid">
        {perfilData.map((record, index) => (
          <div key={index} className="profile-columns">
            <div className="profile-left">
              <div className="profile-section">
                <h4>Información Personal</h4>
                <p>
                  <strong>Nombre:</strong> {record.nombre || "No disponible"}
                </p>
                <p>
                  <strong>Apellido:</strong> {record.apellido || "No disponible"}
                </p>

                <p>
                  <strong>Teléfono:</strong>
                  {isEditing.telefono ? (
                    <>
                      <input
                        type="text"
                        name="telefono"
                        value={editableData.telefono}
                        onChange={handleInputChange}
                        onBlur={() => handleToggleEdit("telefono")} 
                        autoFocus
                      />
                      <FaCheck className="check-icon" onClick={() => handleToggleEdit("telefono")} />
                    </>
                  ) : (
                    <>
                      {editableData.telefono || "No disponible"}
                      <FaEdit onClick={() => handleToggleEdit("telefono")} className="edit-icon" />
                    </>
                  )}
                </p>

                <p>
                  <strong>Correo:</strong>
                  {isEditing.correo ? (
                    <>
                      <input
                        type="email"
                        name="correo"
                        value={editableData.correo}
                        onChange={handleInputChange}
                        onBlur={() => handleToggleEdit("correo")} 
                        autoFocus
                      />
                      <FaCheck className="check-icon" onClick={() => handleToggleEdit("correo")} />
                    </>
                  ) : (
                    <>
                      {editableData.correo || "No disponible"}
                      <FaEdit onClick={() => handleToggleEdit("correo")} className="edit-icon" />
                    </>
                  )}
                </p>
              </div>

              <div className="profile-section">
                <h4>Información de Acceso</h4>
                <p>
          <strong>Usuario:</strong> {editableData.nombreUsuario || "No disponible"}
        </p>
                <Link to="#" className="text-primary" onClick={() => setShowModal(true)}>
                  Cambiar Contraseña
                </Link>
              </div>
            </div>

            <div>
            <div className="housing-info">
                <h4>Información de Vivienda</h4>
                <p>
                  <strong>Apartamento:</strong> {record.Apartamento_FK || "No disponible"}
                </p>
                <p>
                  <strong>Meses Atrasados:</strong> {record.mesesAtrasados || "0"}
                </p>
                <p>
                  <strong>ID Propietario:</strong> {record.idPropietario || "No disponible"}
                </p>
              </div>

              <div className="vehicle-info">
                <h4>Información de Vehículo</h4>
                <p>
                  <strong>Parqueadero:</strong> {record.idParqueaderoFk || "No asignado"}
                </p>
                <p>
                  <strong>Placa Vehículo:</strong> {record.placaVehiculo || "No registrado"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Contraseña</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña:</label>
                  <input type="password" id="newPassword" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                  <input type="password" id="confirmPassword" className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={handlePasswordChange}>
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
