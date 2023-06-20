import Button from "../components/Button";
import { Link } from "react-router-dom";
import { MouseEvent } from "react";
import UploadWidget from "../components/UploadWidget";
import defaultAvatar from "../assets/default_avatar.svg";
import useUser from "../hooks/useUser";

export default function Account() {
  const { isPending, user, setUser } = useUser();

  const handleSignout = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch("/api/user/signout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => (window.location.href = "/"))
      .catch((error) => console.error(error));
  };

  const handleOnSuccess = async (avatarUrl: string) => {
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
    }
  };

  if (!isPending) {
    return (
      <div className="user">
        <div className="user__avartar">
          <img
            src={user.avatarUrl || defaultAvatar}
            alt="User Avartar"
            crossOrigin="anonymous"
          />
          <UploadWidget buttonText="Change" onSuccess={handleOnSuccess} />
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
              <strong>Subscription</strong>
              <span>
                <Link to="/dashboard/pricing">Upgrade</Link>
              </span>
            </div>
            <p>Free</p>
          </li>
        </ul>
        <Button onClick={handleSignout} text="Sign out" theme="primary" />
      </div>
    );
  }
}
