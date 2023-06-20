import { useEffect, useRef } from "react";

interface UploadWidgetProps {
  buttonText: string;
  onSuccess: (avatarUrl: string) => void;
}

export default function UploadWidget({
  buttonText,
  onSuccess,
}: UploadWidgetProps) {
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
          onSuccess(avatarUrl);
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
