import { useEffect, useRef } from "react";

export default function UploadWidget({ buttonText }: { buttonText: string }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    // @ts-ignore
    cloudinaryRef.current = window.cloudinary;
    // @ts-ignore
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "djwt8gjkl",
        sources: ["local", "url"],
        uploadPreset: "hteepswm",
        folder: "react-typescript-sasskit",
      },
      (error: any, result: any) => {
        if (result?.event === "success") {
          const avatarUrl = result.info.secure_url;
          console.log(avatarUrl);
          console.log(error);
        }
      },
    );
  }, []);

  return (
    // @ts-ignore
    <button type="button" onClick={() => widgetRef.current.open()}>
      {buttonText}
    </button>
  );
}
