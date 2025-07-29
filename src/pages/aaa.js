import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const WordPressUploader = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const username = "yashkolnure58@gmail.com"; // Replace with your WP username
  const appPassword = "WtKE fjq1 mAuq N6mz Wv5K 4P7M"; // Replace with your Application Password
  const wpUrl = "https://data.avenirya.com/wp-json/wp/v2/media"; // Replace with your WP URL

 const token = btoa(`${username}:${appPassword}`);

  const uploadFileToWordPress = async (file) => {
    try {
      // Step 1: Upload the image file with proper Content-Disposition
      const uploadResponse = await axios.post(wpUrl, file, {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Disposition": `attachment; filename=\"${file.name || 'pasted-image.png'}\"`,
          "Content-Type": file.type,
        },
      });

      const mediaId = uploadResponse.data.id;

      // Step 2: Update media metadata (title, alt text, caption, description)
      await axios.post(
        `${wpUrl}/${mediaId}`,
        {
          title: file.name || 'Pasted Image',
          alt_text: file.name || 'Pasted Image',
          caption: file.name || 'Pasted Image',
          description: `Uploaded file named ${file.name || 'Pasted Image'}`,
        },
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUploadedImages((prev) => [
        ...prev,
        {
          url: uploadResponse.data.source_url,
          alt: file.name || 'Pasted Image',
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload: " + (file.name || 'Pasted Image'));
    }
  };

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    for (const file of acceptedFiles) {
      await uploadFileToWordPress(file);
    }
    setUploading(false);
  };

  const handlePaste = useCallback((event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        setUploading(true);
        uploadFileToWordPress(file).finally(() => setUploading(false));
        break;
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h2>WordPress Media Uploader</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: 40,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        <input {...getInputProps()} />
        <p>Drag and drop image files here, click to browse, or paste an image (Ctrl+V)</p>
      </div>

      {uploading && <p>Uploading...</p>}

      {uploadedImages.length > 0 && (
        <div>
          <h3>Uploaded Images</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {uploadedImages.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt}
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordPressUploader;