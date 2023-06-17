import { useEffect, useRef } from "react";

export default function UploadWidget({ buttonText }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "djwt8gjkl",
        sources: ["local", "url"],
        uploadPreset: "hteepswm",
        folder: "react-typescript-sasskit",
      },
      (error, result) => {
        if (result?.event === "success") {
          const avatarUrl = result.info.secure_url;
          console.log(avatarUrl);
        }
      },
    );
  }, []);

  return (
    <button type="button" onClick={() => widgetRef.current.open()}>
      {buttonText}
    </button>
  );
}
