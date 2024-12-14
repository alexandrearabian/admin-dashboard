import React from "react";

const ImageBox = ({
  bbddImg,
  editableImg,
  handleImageChange,
  handleImageUpload,
}) => (
  <div className="img-box">
    <div style={{ display: "flex" }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e, editableImg)}
        className="input-field"
      />
      <button onClick={handleImageUpload}>Subir imagen</button>
    </div>
    <img src={bbddImg} alt="Imagen" className="foto-preview" />
  </div>
);

export default ImageBox;
