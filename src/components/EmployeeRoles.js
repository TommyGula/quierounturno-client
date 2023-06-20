import React, { useState } from "react";
import Socios from "../assets/rol_socios.png";
import Cajero from "../assets/rol_cajero.png";
import Profesional from "../assets/rol_profesional.png";

const roles = [
    {
        id:0,
        name:"Socios",
        img:Socios,
    },
    {
        id:1,
        name:"Profesional",
        img:Profesional,
    },
    {
        id:2,
        name:"Cajero",
        img:Cajero,
    },
]

const EmployeeRoles = (props) => {
    const [selectedRole, setSelectedRole] = useState(1);

    const select = (id) => {
        setSelectedRole(id);
        props.handleChange({
            target:{
                name:"role",
                value:id
            }
        });
    };

    return(
        <div className="EmployeeRoles">
            <div className="py-3 row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 justify-content-center g-3">
                {
                    roles.map((role) => {
                        return(
                            <div className={"role-item text-center p-3 " + (selectedRole === role.id ? "role-item-selected" : "")} key={role.id} onClick={() => select(role.id)}>
                                <div className="role-item-logo" style={{backgroundImage:"url(" + role.img + ")"}}></div>
                                <div className="role-item-name pt-2">
                                    <p className="mb-0">
                                        <strong>{role.name}</strong>
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default EmployeeRoles;