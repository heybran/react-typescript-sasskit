import Dialog from "./Dialog";
import { FormEvent, Ref, forwardRef, useState } from "react";
import Spinner from "./Spinner";
import styles from "./TwoFactorAuth.module.css";
import { useUserContext } from "../context/UserContext";
import apiEndpoints from "../../server/shared/apiRoutes.json";

interface AuthProps {
  onSuccess: () => void;
}

const TwoFactorAuth = forwardRef(
  ({ onSuccess }: AuthProps, ref: Ref<HTMLDialogElement>) => {
    const [isFetchingQRCode, setIsFetchingQRCode] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [isVerifyingToken, setIsVerifyingToken] = useState(false);
    const { user } = useUserContext();
    const [authCodeError, setAuthCodeError] = useState(null);

    const fetchQRCode = async () => {
      setIsFetchingQRCode(true);
      const res = await fetch(apiEndpoints.TWO_FACTOR_AUTH_ENABLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (!res.ok) {
        console.log(await res.json());
        setIsFetchingQRCode(false);
      } else {
        const data = await res.json();
        console.log(data);
        setQrDataUrl(data.qrDataUrl);
        console.log(qrDataUrl);
        setIsFetchingQRCode(false);
      }
    };

    const verifyToken = async (e: FormEvent<HTMLFormElement>) => {
      const form = e.target as HTMLFormElement;
      const data = new FormData(form);
      const token = data.get("two-factor-auth-code");
      e.preventDefault();
      setIsVerifyingToken(true);
      try {
        const res = await fetch(apiEndpoints.TWO_FACTOR_AUTH_VERIFY, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.username, token }),
        });

        if (!res.ok) {
          const error = await res.json();
          setAuthCodeError(error.message);
        } else {
          onSuccess();
        }
      } catch (err: any) {
        setAuthCodeError(err.message);
      } finally {
        setIsVerifyingToken(false);
      }
    };

    return (
      <Dialog ref={ref} ariaLabel="Setting Two-Factor Authentication">
        <form method="POST" className={styles.form} onSubmit={verifyToken}>
          <header>
            <h2>Setting Two-Factor Authentication</h2>
          </header>
          <article className={"relative spinner-center " + styles.article}>
            <p>
              Secure your account with two-factor authentication. You need to
              download Google Authenticator app on your mobile phone.
            </p>
            <div className={styles["qrcode-container"]}>
              {isFetchingQRCode ? <Spinner /> : null}
              {qrDataUrl ? (
                <>
                  <img
                    src={qrDataUrl}
                    className={styles.qrcode}
                    alt="Two Factor Authentication QRCode"
                  />
                  <input
                    type="text"
                    name="two-factor-auth-code"
                    id="two-factor-auth-code"
                    placeholder="Enter 6 digit code"
                  />
                </>
              ) : null}
              {authCodeError ? <p className="error"></p> : null}
            </div>
          </article>
          <footer>
            <menu>
              {qrDataUrl ? (
                <button className="primary-button relative" type="submit">
                  Finish
                  {isVerifyingToken ? <Spinner /> : null}
                </button>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  onClick={fetchQRCode}
                >
                  Proceed
                </button>
              )}
            </menu>
          </footer>
        </form>
      </Dialog>
    );
  },
);

export default TwoFactorAuth;
