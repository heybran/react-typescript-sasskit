import { forwardRef, Ref, useState, MouseEvent } from "react";
import Dialog from "./Dialog";
import { useUserContext } from "../context/UserContext";
import Spinner from "./Spinner";
import apiEndpoints from "../../server/shared/apiRoutes.json";

interface AuthProps {
  onSuccess: () => void;
}

const RemoveTwoFactorAuth = forwardRef(
  ({ onSuccess }: AuthProps, ref: Ref<HTMLDialogElement>) => {
    const { user } = useUserContext();
    const [disableAuthError, setDisableAuthError] = useState(null);
    const [isDiablingAuth, setIsDiablingAuth] = useState(false);
    const disableTwoFactorAuth = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDiablingAuth(true);
      try {
        const res = await fetch(apiEndpoints.TWO_FACTOR_AUTH_DISABLE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.username }),
        });

        if (!res.ok) {
          const error = await res.json();
          setDisableAuthError(error.message);
        }
        {
          onSuccess();
        }
      } catch (err: any) {
        setDisableAuthError(err?.message);
      } finally {
        setIsDiablingAuth(false);
      }
    };

    return (
      <Dialog ref={ref} ariaLabel="Disable two factor authentication">
        <form method="POST">
          <p>Are you sure you want to disabled Two-Factor Authentication?</p>
          {disableAuthError ? (
            <p className="error">{disableAuthError}</p>
          ) : null}
          <footer>
            <menu>
              <button
                autoFocus
                className="secondary-button"
                type="button"
                onClick={(e) =>
                  (e.target as HTMLButtonElement).closest("dialog")?.close()
                }
              >
                Cancel
              </button>
              <button
                className="primary-button relative"
                type="submit"
                value="confirm"
                onClick={disableTwoFactorAuth}
              >
                Confirm
                {isDiablingAuth ? <Spinner /> : null}
              </button>
            </menu>
          </footer>
        </form>
      </Dialog>
    );
  },
);

export default RemoveTwoFactorAuth;
