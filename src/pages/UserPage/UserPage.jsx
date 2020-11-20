import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Navbar from './../../shared/components/Navbar/Navbar';
import './UserPage.scss';
import { useForm } from 'react-hook-form';
import { Popup } from 'react-map-gl';

const apiUrl = 'http://localhost:3001';


export default function UserPage() {
  const { handleSubmit, register } = useForm();
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    axios
      // We have to use { withCredentials: true } to send and receive valid cookies
      .get(`${apiUrl}/auth/profile`, { withCredentials: true })
      .then(({ data }) => setUser(data))
      .catch((err) => {
        console.log(err);
        history.push('/home');
      });
  }, []);

  const logout = (values) => {
    axios
      .get(`${apiUrl}/auth/logout`, { withCredentials: true })
      .then(() => {
        history.push('/login');
      })
      .catch(console.log);
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    // Hacemos append de los campos a mandar...
    Object.keys(values).forEach((key) => {
      if (typeof values[key] !== "undefined") {
        formData.append(key, values[key]);
      }
    });

    console.log(formData);

    axios
      .put(`${apiUrl}/user/${user._id}`, formData, { withCredentials: true }, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => {
        console.log('Usuario editado:', res.data);
      })
      .catch(console.log);
  };


  return (
    <div className="container">
      {user ? (

        <div className="structure">
          <div className="image-title">
            <div>
              <h2>
                {user.name} {user.lastName}
              </h2>
              <h3>
                Puedes ver y{' '}
                <Link to="/user/edit" className="user-edit">
                  editar
                </Link>{' '}
                tu perfil
              </h3>
              <img className="image" src={user.img} alt="" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="btnGuardian">
                  <h3>Modo guardián</h3>
                  <label class="switch">
                    <input type="checkbox" name="guardian" id="guardian" ref={register} defaultChecked={user.guardian} />
                    <span class="slider round"></span>
                  </label>
                  <button type="submit" className="btnEnviarGuardian">ENVIAR</button>
                  {/* <span class="popuptext" id="myPopup">Cambiando de Perfil ☺️ </span> */}

                  <hr />
                </div>
                <div className="reserve">
                  <h3>Tus reservas</h3>
                  <Link
                    className="icon-proximo proxUser"
                    to="user/booking"
                  >
                    {' '}
                  </Link>

                </div>
                <div>
                  <hr />
                  <Link
                    className="icon-cog icon-settings UserIcon"
                    to="/user" /*"Poner redirección"*/
                  >
                    {' '}
                  </Link>
                  <h3>Configuración</h3>
                  <hr />
                </div>
                <div>
                  <Link
                    className="icon-info UserIcon"
                    to="/user" /*"Poner redirección"*/
                  >
                    {' '}
                  </Link>
                  <h3>Ayuda</h3>
                  <hr />
                </div>
                <div className="btnLogOut">
                  <button className="icon-salir logOut" onClick={logout}>
                    {' '}
                  </button>
                  <h3>Salir</h3>
                  <hr />
                </div>
                <br />
                <br />
              </div>
            </form>
          </div>
          {/* ); */}
          {/* })} */}
        </div>
      ) : null
      }

      <Navbar />
    </div >
  );
}
