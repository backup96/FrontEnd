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
    currentRecords.map(
      (item) => (
        formData.append("correo", item.correo),
        formData.append("nombre", `${item.nombre} ${item.apellido}`),
        formData.append("codVivi", item.codigoVivienda),
        formData.append("codPer", item.numDocumento),
        formData.append("numPar", item.idParqueaderoFk),
        formData.append("text", text.text),
        formData.append("file", text.file),
        handleSend(formData)
      )
    );
    toast.success("Recibos enviados satisfactoriamente");
  };

  const handleSend = (data) => {
    console.log(data);
    axios
      .post(`${proxy}/admin/sendCircularInformacion`, data)
      .then((res) => {
        if (res.status === 200) {
          console.log("Circulares enviados");
        } else {
          console.log("Correos no enviados");
        }
      })
      .catch((err) => console.log(err));
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
