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
  const [text, setText] = useState({
    text: "",
  });

  const enviar = async (e) => {
    e.preventDefault();
    currentRecords.map((item) =>
      handleSend({
        correo: item.correo,
        nombre: `${item.nombre} ${item.apellido}`,
        codVivi: item.codigoVivienda,
        codPer: item.numDocumento,
        numPar: item.idParqueaderoFk,
      })
    );
    toast.success("Recibos enviados satisfactoriamente");
  };

  const enviarCircular = async (e) => {
    e.preventDefault();
    currentRecords.map((item) =>
      handleSend2({ correo: item.correo, text: text.text })
    );
    toast.success("Circulares enviadss satisfactoriamente");
  };

  const handleSend = (data) => {
    console.log(data);
    axios
      .post(`${proxy}/admin/sendInformacion`, data)
      .then((res) => {
        if (res.status === 200) {
          console.log("Correos enviados");
        } else {
          console.log("Correos no enviados");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSend2 = (data) => {
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
          <form onSubmit={enviarCircular}>
            <button
              type="submit"
              className="btn mx-2 bg-primary-subtle border border-primary text-primary p-2"
            >
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
          </form>

          <form onSubmit={enviar}>
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
