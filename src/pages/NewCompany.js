import React, { useContext, useState, useEffect } from "react";

import { TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Food from "../assets/food.png";
import Hairdresser from "../assets/hairdresser.png";
import Hamburger from "../assets/hamburger.png";
import Pharma from "../assets/pharmacy.png";
import Sweets from "../assets/sweets.png";
import Others from "../assets/others.png";
import Currency from "../components/Currency";
import UserContext from "../context/UserContext";
import { Info } from "react-bootstrap-icons";
import Schedules from "../components/Schedules";
import AddPictures from "../components/AddPictures";
import FormContext from "../components/FormContext";
import SectionTitle from "../components/SectionTitle";
import { formatScheduleBody } from "../components/Schedules";

const containerStyle = {
    width: '100%',
    maxWidth:'400px',
    margin:"auto",
    height: '345px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const requiredFields = [
    "name",
    "categories",
    "location",
    "currency",
    "schedule",
    "description",
    "createdBy",
];

const NewCompany = ({ navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow }) => {
    const context = useContext(UserContext);
    const [value, setValue] = useState({});
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "YOUR_API_KEY"
    });
    
    const [business, setBusiness] = useState({});
    const [image, setImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("arg");
    const [photos, setPhotos] = useState([]);
    const [submited, setSubmited] = useState(false);
    const [body, setBody] = useState({});


    useEffect(() => {
        getBody();
    }, [business, value, image, photos, selectedCategory, selectedCurrency]);

    const handleSelectedCategory = (cat) => {
        if (selectedCategory.includes(cat)) {
            setSelectedCategory(selectedCategory.filter(category => category !== cat));
        } else {
            setSelectedCategory([...selectedCategory, cat]);
        };
    };

    const handleUpdate = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setBusiness({...business, [name]:value});
    };

    const handleChange = (e, name) => {
        setValue({...value, [name]:e});
        //console.log({...value, [name]:e})
    };

    const [map, setMap] = useState(null);

    const onLoad = React.useCallback(function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map)
    }, [])
  
    const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
    }, []);

    const handleFileChange = async (e) => {
        const img = {
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0],
        }
        let formData = new FormData()
        formData.append('file', img.data);
        formData.append('userId', context.user._id);
        const response = await fetch(process.env.REACT_APP_BACKEND_PATH + 'upload', {
            method: 'POST',
            body: formData,
        })
        if (response) {
            setImage(img);
        };
    };

    const openFiles = () => {
        const input = document.getElementById("fileUploader");
        input.click();
    };

    const getBody = () => {
        const myBusiness = {
            name:business.name,
            slogan:business.slogan,
            logo:image ? image.data.name : null,
            location:business.location,
            categories:selectedCategory.length > 0 ? selectedCategory : null,
            currency:selectedCurrency,
            schedule:Object.keys(value).length > 0 ? formatScheduleBody(value) : {},
            description:business.description,
            photos:photos.map(photo=>photo.data.name),
            createdBy:context.user._id,
        };
        //console.log(myBusiness);
        setBody(myBusiness);
    };

    const createUser = (companyId, callback) => {
        fetch(process.env.REACT_APP_BACKEND_PATH + "/employees",{
            method:"POST",
            headers:{ 'Content-Type': 'application/json' },
            body:JSON.stringify({
                companyId:companyId,
                userId:context.user._id,
                role:"OWNER",
                permissions:["OWNER"],
                schedule:value
            })
        })
        .then(res=>res.json())
        .then(data=>callback())
        .catch(err=>callback(err))
    };

    return(
        <FormContext callback={createUser} redirect={"/me/[_id]/nuevo/servicio"} cta="CREAR"  redirectMessage="Ahora te recomendamos crear un servicio para tu negocio" setRedirect={setRedirect} body={body} setSubmited={setSubmited} requiredFields={requiredFields} postContext="businesses" method="POST" modal={handleShow}>
            <div className="p-4">
                <h3 className="title f-500">Datos del Negocio <Info className="info-icon"  onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Complete todos los campos requeridos" requiredtarget={business.name}></Info></h3>
                <div className="row row-cols-md-2 g-3 mt-2">
                    <div>
                        <TextField
                            id="name"
                            name="name"
                            className="textfield-primary w-100"
                            label="Nombre del negocio"
                            helperText="Barbaría Don Romeo"
                            placeholder="Ingresa un nombre"
                            variant="standard"
                            onChange={handleUpdate}
                            required
                            error={submited ? !body.name : false}
                        />
                    </div>
                    <div>
                        <TextField
                            id="slogan"
                            name="slogan"
                            className="textfield-primary w-100"
                            label="Slogan"
                            placeholder="Ingresa un slogan"
                            helperText="Tu estilo, nuestra prioridad"
                            variant="standard"
                            onChange={handleUpdate}
                        />
                    </div>
                </div>
                <div className="p-4 w-100">
                    <div className="logo rounded rounded-circle position-relative d-flex align-items-center justify-content-center overflow-hidden">
                        {
                            image ?
                            <img src={process.env.REACT_APP_BACKEND_PATH + "uploads/" + image.data.name} alt="" width={"100%"}/> :
                            <p className="m-0">Agregar Logo</p>
                        }
                    </div>
                    <div className="add-logo text-center mt-4">
                        <input type="file" id="fileUploader" className="d-none" onChange={handleFileChange}/>
                        <Button variant="primary" className="h-100" onClick={openFiles}>AÑADIR LOGO</Button>
                    </div>
                </div>
                <div className="mt-2">
                    <SectionTitle submited={submited} title="Ubicacion sucursal actual" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Completa todos los campos requeridos" requiredtarget={body.location}></SectionTitle>
                    <div className="mt-2">
                        <div className="col col-12 col-md-6">
                            <TextField
                                id="location"
                                name="location"
                                onChange={handleUpdate}
                                className="textfield-primary w-100"
                                label="Ubicación"
                                placeholder="Ingresa tu ubicación"
                                variant="standard"
                                required
                                error={submited ? !body.location : false}
                            />
                        </div>
                        <div className="map mt-4">
                            {
                                isLoaded ?
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={10}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    { /* Child components, such as markers, info windows, etc. */ }
                                    <></>
                                </GoogleMap> :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <div className="px-4">
                    <SectionTitle submited={submited} title="Rubro principal" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Elegí un rubro" requiredtarget={body.categories} validationFunction={(val) => val.length > 0}></SectionTitle>
                </div>
                <div className="categories py-3 px-4">
                    <div className="categories-slide d-flex gap-3">
                        <div className={"category " + (selectedCategory.includes(0) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(0)}>
                            <img src={Hamburger} alt="Restaurante" />
                            <p>Restaurante</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(1) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(1)}>
                            <img src={Food} alt="Supermercado" />
                            <p>Supermercado</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(2) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(2)}>
                            <img src={Pharma} alt="Farmacia" />
                            <p>Farmacia</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(3) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(3)}>
                            <img src={Sweets} alt="Kiosko" />
                            <p>Kiosko</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(4) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(4)}>
                            <img src={Hairdresser} alt="Peluquería" />
                            <p>Peluquería</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(5) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(5)}>
                            <img src={Others} alt="Otro" />
                            <p>Otro</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(2) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(2)}>
                            <img src={Pharma} alt="Farmacia" />
                            <p>Farmacia</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(3) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(3)}>
                            <img src={Sweets} alt="Kiosko" />
                            <p>Kiosko</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(4) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(4)}>
                            <img src={Hairdresser} alt="Peluquería" />
                            <p>Peluquería</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(5) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(5)}>
                            <img src={Others} alt="Otro" />
                            <p>Otro</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(2) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(2)}>
                            <img src={Pharma} alt="Farmacia" />
                            <p>Farmacia</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(3) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(3)}>
                            <img src={Sweets} alt="Kiosko" />
                            <p>Kiosko</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(4) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(4)}>
                            <img src={Hairdresser} alt="Peluquería" />
                            <p>Peluquería</p>
                        </div>
                        <div className={"category " + (selectedCategory.includes(5) ? "selectedCategory" : "")} onClick={() => handleSelectedCategory(5)}>
                            <img src={Others} alt="Otro" />
                            <p>Otro</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <SectionTitle title="Moneda" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                <div className="separator mb-2"></div>
                <div className="currencies d-flex w-100">
                    <Currency code="arg" ticker="ARS" onClick={() => setSelectedCurrency("arg")} selected={selectedCurrency === "arg" ? true : false}></Currency>
                    <Currency code="usa" ticker="USD" onClick={() => setSelectedCurrency("usa")} selected={selectedCurrency === "usa" ? true : false}></Currency>
                </div>
                <div className="mt-4">
                <SectionTitle submited={submited} title="Horarios de atención" validationtext="Selecciona un horario de atención" requiredtarget={body.schedule} validationFunction={(val) => Object.keys(val).filter(key=>val[key]).length > 0} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                <div className="separator"></div>
                    <Schedules handleChange={handleChange} value={value} setValue={setValue}></Schedules>
                </div>
                <div className="mt-5">
                    <SectionTitle submited={submited} title="Descripción del negocio" validationtext="Agrega una descripción" requiredtarget={body.description} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                    <div className="separator mb-4"></div>
                    <div className="form-group shadow-textarea">
                        <textarea className="form-control p-4" id="exampleFormControlTextarea1" name="description" required error={(submited ? (typeof body.description === 'undefined') : false).toString()} placeholder="Los productos / servicios que ofrecemos..." rows="3" onChange={handleUpdate}></textarea>
                    </div>
                </div>
                <div className="mt-5">
                    <h3 className="title">Fotos</h3>
                    <div className="separator mb-4"></div>
                    <AddPictures photos={photos} setPhotos={setPhotos} ></AddPictures>
                </div>
            </div>
        </FormContext>
    )
};

export default NewCompany;