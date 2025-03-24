import {
  Dropzone,
  FileMosaic,
  FullScreen,
  ImagePreview
} from "@files-ui/react";
import { BsUpload } from "react-icons/bs";
import * as React from "react";

const BASE_URL = "https://www.myserver.com";

export default function CustomDropzone() {
  const [extFiles, setExtFiles] = React.useState([]);
  const [imageSrc, setImageSrc] = React.useState(undefined);

  const updateFiles = (incomingFiles) => {
    // Ensure only one file is selected
    setExtFiles(incomingFiles.slice(0, 1)); 
  };

  const onDelete = (id) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };

  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

  return (
    <>
      <Dropzone
        onChange={updateFiles}
        value={extFiles}
        accept=".png, .jpg, .jpeg" // Only allow PNG, JPG, and JPEG
        maxFiles={1} // Only allow one file
        maxFileSize={15 * 1024 * 1024} // 15MB limit
        minHeight="200px"
        label={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BsUpload size={20} style={{ color: "#588abd" }} />
              <span>Drag & drop a PNG or JPG image or click to browse</span>
            </div>
          }
        style={{
          backgroundColor: "#fffff",  // White background
          border: "2px dashed #fb8602", // Orange border
          borderRadius: "10px",
          color: "#333", // Dark text
        }}
        footerConfig={{
            style: {
                backgroundColor: "#588abd", // Change footer background color
                color: "#ffffff", // Change text color
                padding: "10px", // Add padding
                fontWeight: "bold", // Make text bold
                textAlign: "center", // Center text
              },
        }}
        actionButtons={false} // Removes upload and cancel buttons
      >
        {extFiles.map((file) => (
          <FileMosaic
            {...file}
            key={file.id}
            onDelete={onDelete}
            onSee={handleSee}
            preview
            info
            style={{
              backgroundColor: "#fff", // White background
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
            }}
          />
        ))}
      </Dropzone>

      <FullScreen open={imageSrc !== undefined} onClose={() => setImageSrc(undefined)}>
        <ImagePreview src={imageSrc} />
      </FullScreen>
    </>
  );
}
