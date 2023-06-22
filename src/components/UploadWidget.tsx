import { useEffect, useRef } from "react";

interface UploadWidgetProps {
  buttonText: string;
  onSuccess: (avatarUrl: string) => void;
  spinner?: boolean;
}

export default function UploadWidget({
  buttonText,
  onSuccess,
  spinner,
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
    <button
      type="button"
      // @ts-ignore
      onClick={() => widgetRef.current.open()}
      className={spinner ? "loading" : ""}
    >
      {buttonText}
    </button>
  );
}
