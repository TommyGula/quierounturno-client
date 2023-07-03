import React, {useContext} from "react";
import UserContext from "../context/UserContext";

import { Info, PlusLg, Trash3Fill } from "react-bootstrap-icons";

const AddPictures = (props) => {
    const context = useContext(UserContext);
    const handlePhotoChange = async (e) => {
        const img = {
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0],
        }
        props.setPhotos([...props.photos, img]);
        let formData = new FormData()
        formData.append('file', img.data);
        formData.append('userId', context.user._id);
        const response = await fetch(process.env.REACT_APP_BACKEND_PATH + 'upload', {
          method: 'POST',
          body: formData,
        })
        if (response) console.log(response)
    };

    const openPhoto = () => {
        const input = document.getElementById("photoUploader");
        input.click();
    };

    return(
        <div className="row row-cols-1 row-cols-md-3 g-4 g-md-2 g-lg-4">
            {
                props.photos.map((photo) => {
                    return(
                    <div className="photo position-relative" >
                        <div className="w-100 ratio ratio-1x1 rounded photo-content" style={{backgroundImage:"url(" + process.env.REACT_APP_BACKEND_PATH + "uploads/" + photo.data.name + ")", backgroundSize:"cover", backgroundRepeat:"no-repeat", backgroundPosition:"center"}}></div>
                        <div className="position-absolute top-0 px-4 py-4 photo-overlay d-none" onClick={() => props.setPhotos(props.photos.filter(ph=>ph !== photo))}>
                            <Trash3Fill width={"3rem"} height={"3rem"} color="white"></Trash3Fill>
                        </div>
                    </div>
                    );
                })
            }
            {
                props.photos.length < 3 ?
                <div className="photo" onClick={openPhoto}>
                    <input type="file" id="photoUploader" className="d-none" onChange={handlePhotoChange}/>
                    <div className="w-100 ratio ratio-1x1 rounded" style={{cursor:"pointer",backgroundColor:"#b6f7f1"}}>
                        <div className="plus p-4">
                        <PlusLg width={"3rem"} height={"3rem"}></PlusLg>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    )
};

export default AddPictures;