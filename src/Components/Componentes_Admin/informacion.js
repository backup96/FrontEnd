import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

library.add(faPaperclip);

const Info = ({ currentRecords, apiS, data }) => {
  const proxy = process.env.REACT_APP_API_URL;
  const [isHovered, setIsHovered] = useState(false);
  const handleButtonClick = () => {
    document.getElementById("inputGroupFile04").click();
  };
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const [fileName, setFileName] = useState(
    "Adjuntar Foto del Contrato de Propiedad o Certificado de Tradición y Libertad"
  );
  const defFile = (e) => {
    const file = e.target.files[0];
    setText({ ...text, file: file });
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(
        "Adjuntar Foto del Contrato de Propiedad o Certificado de Tradición y Libertad"
      );
    }
  };
  const [text, setText] = useState({
    text: "",
    file: ""
  });

  const enviar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    currentRecords.forEach((item) => {
      formData.append(
        "recipients[]",
        JSON.stringify({
          correo: item.correo,
          nombre: `${item.nombre} ${item.apellido}`,
          codVivi: item.codigoVivienda,
          codPer: item.numDocumento,
          numPar: item.idParqueaderoFk,
        })
      );
    });
    try {
      const res = await axios.post(
        `${proxy}/admin/sendCircularInformacion`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        toast.success("Recibos enviados satisfactoriamente");
      } else {
        toast.error("Error al enviar correos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error en la solicitud");
    }
  };

  return (
    <div className="d-flex flex-column w-100 h-50">
      <ToastContainer />
      <div className=" d-flex flex-column justify-content-end">
        <div className="d-flex flex-column justify-content-start">
          <label
            htmlFor="exampleInputEmail1"
            className=" text-start form-label"
          >
            Circular
          </label>
          <textarea
            placeholder="Lo que escriba aquí siempre empezará con la frase: 
            'Un cordial saludo residentes de Torres de Santa Isabel. 
            El presente correo es para informar que (Su mensaje)'. 
            Así mismo finalizará con: 
            'Agradecemos su atención a esta circular y quedamos atentos a cualquier duda o comentario.
            Atentamente,
            Administración del Conjunto Residencial Torres de Santa Isabel'"
            className="form-control "
            id="exampleFormControlTextarea1"
            rows="7"
            name="CircularBody"
            onChange={(e) => setText({ ...text, text: e.target.value })}
          ></textarea>
        </div>
        <div className="d-flex justify-content-end my-3">
          <form onSubmit={enviar}>
            <button
              type="button"
              className={
                isHovered
                  ? "btn btn-outline-primary text-white"
                  : "btn btn-outline-primary text-primary"
              }
              onClick={handleButtonClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FontAwesomeIcon icon={faPaperclip} />
              <input
                type="file"
                id="inputGroupFile04"
                className="d-none"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Upload"
                onChange={(e) => defFile(e)}
                accept="application/pdf"
                hidden
              />
            </button>
            
            <button type="submit" className="btn btn-success mx-3 ">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Info;
