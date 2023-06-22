import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import UploadWidget from "../components/UploadWidget";
import defaultAvatar from "../assets/default_avatar.svg";
import { useUserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";
import Input from "../components/Input";

export default function Account() {
  const { user, setUser } = useUserContext();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [updatePasswordError, setUpdatePasswordError] = useState<string | null>(
    null,
  );

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

  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    let next = false;
    e.preventDefault();
    console.log(e);
    setIsUpdatingPassword(true); // we want to show a spinner inside the button
    const formData = new FormData(e.target as HTMLFormElement);
    const passwords = Object.fromEntries(formData.entries());
    try {
      const isCurrentPasswordCorrectRes = await fetch(
        "/api/user/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            password: passwords["current-password"],
          }),
        },
      );

      if (isCurrentPasswordCorrectRes.ok) {
        next = true;
      } else {
        setIsUpdatingPassword(false);
        const error = await isCurrentPasswordCorrectRes.json();
        setUpdatePasswordError(error.message);
      }
    } catch (error) {
      setIsUpdatingPassword(false);
      setUpdatePasswordError("Something went wrong, please try again.");
    }

    if (!next) {
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: It will be easier if we can store the user id into our userContext
        // so when we need to update user info, send along user id
        body: JSON.stringify({
          username: user.username,
          password: passwords["new-password"],
        }),
      });

      if (res.ok) {
        setUpdatePasswordError(null);
        setUser({ ...user, password: true });
      } else {
        setUpdatePasswordError("Something went wrong, please try again.");
      }
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
        <li className="user__detail user__detail--password">
          <div className="flex">
            <strong>Password</strong>
          </div>
          {isSettingPassword ? (
            <form onSubmit={updatePassword}>
              <Input
                id="current-password"
                labelText="Current password"
                placeholder="Current password"
                type="password"
                name="current-password"
              />
              <Input
                id="new-password"
                labelText="New password"
                placeholder="New password"
                type="password"
                name="new-password"
              />
              <div className="flex">
                <button
                  className="primary-button relative half-width"
                  type="submit"
                >
                  Update
                  {isUpdatingPassword ? <Spinner /> : null}
                </button>
                <button
                  className="secondary-button half-width"
                  onClick={() => (
                    setIsSettingPassword(false), setUpdatePasswordError(null)
                  )}
                >
                  Cancel
                </button>
              </div>
              {updatePasswordError !== null ? (
                <p className="error">{updatePasswordError}</p>
              ) : null}
            </form>
          ) : null}
          {!isSettingPassword ? (
            <button
              className="secondary-button full-width"
              type="button"
              onClick={() => setIsSettingPassword(true)}
            >
              {user.password ? "Change" : "Set"} your password
            </button>
          ) : null}
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
