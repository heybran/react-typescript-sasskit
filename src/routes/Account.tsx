import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import UploadWidget from "../components/UploadWidget";
import defaultAvatar from "../assets/default_avatar.svg";
import { useUserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";

export default function Account() {
  const { user, setUser } = useUserContext();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleOnSuccess = async (avatarUrl: string) => {
    setIsUploadingAvatar(true);
    try {
      await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: It will be easier if we can store the user id into our userContext
        // so when we need to update user info, send along user id
        body: JSON.stringify({ username: user.username, avatarUrl }),
      });

      setUser({ ...user, avatarUrl });
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const prepareSetPassword = () => {
    setIsSettingPassword(true);
  };

  const updatePassword = async () => {
    setIsUpdatingPassword(true); // we want to show a spinner inside the button
    const password = (
      passwordInputRef.current as HTMLInputElement
    ).value.trim();

    try {
      await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: It will be easier if we can store the user id into our userContext
        // so when we need to update user info, send along user id
        body: JSON.stringify({ username: user.username, password }),
      });

      setUser({ ...user, password });
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="user">
      <div className="user__avartar">
        <img
          src={user.avatarUrl || defaultAvatar}
          alt="User Avartar"
          crossOrigin="anonymous"
        />
        <UploadWidget
          buttonText="Change"
          onSuccess={handleOnSuccess}
          spinner={isUploadingAvatar}
        />
      </div>
      <ul className="user__details">
        <li className="user__detail">
          <div>
            <strong>Username</strong>
          </div>
          <p>{user.username}</p>
        </li>
        <li className="user__detail">
          <div className="flex">
            <strong>Password</strong>
          </div>
          <div className="flex">
            {user.password || isSettingPassword ? (
              <>
                <input
                  id="user-password"
                  type="password"
                  ref={passwordInputRef}
                />
                <button
                  className="primary-button relative"
                  onClick={updatePassword}
                >
                  Update
                  {isUpdatingPassword ? <Spinner /> : null}
                </button>
              </>
            ) : (
              <button
                className="secondary-button full-width"
                type="button"
                onClick={prepareSetPassword}
              >
                Set your password
              </button>
            )}
          </div>
        </li>
        <li className="user__detail">
          <div className="flex">
            <strong>Subscription</strong>
            <span>
              <Link to="/dashboard/pricing">Upgrade</Link>
            </span>
          </div>
          <p className="capitalize">{user.subscription}</p>
        </li>
      </ul>
    </div>
  );
}
