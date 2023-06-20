import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return(
        <div className="Home mb-5">
            <div className="mobile-container container py-4">
                <div className="row row-cols-lg-2 mb-5 g-5 g-lg-4">
                    <div>
                        <div className="home-card p-4 bg-white rounded mx-4 mx-lg-0" style={{boxShadow:"0 .45rem 1.875rem rgba(0, 0, 0, 0.12)"}}>
                            <h4 className="f-600 mb-4">Subtitle 1</h4>
                            <p className="m-0">Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
                        </div>
                    </div>
                    <div>
                        <div className="video-responsive">
                            <iframe
                                width="100%"
                                height={"auto"}
                                src={`https://www.youtube.com/embed/8Cq5rxiq6Xw`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                        </div>
                    </div>
                </div>
                <section style={{maxWidth:"769px"}}>
                    <div className="text-center d-grid gap-4 px-4 position-relative">
                        <Button variant="primary" className="h-100" onClick={() => navigate("/buscar-turno")}>QUIERO OFRECER SERVICIOS</Button>
                        <Button variant="outline-primary" className="h-100" onClick={() => navigate("/buscar-turno")}>QUIERO BUSCAR UN TURNO</Button>
                    </div>
                </section>
            </div>
        </div>
    )
};

export default Home;