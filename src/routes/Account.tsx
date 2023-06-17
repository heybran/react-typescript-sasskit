import Button from "../components/Button";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { MouseEvent } from "react";
import UploadWidget from "../components/UploadWidget";

export default function Account() {
  const user = useUserContext();

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

  return (
    <div className="user">
      <div className="user__avartar">
        <img src={user.avatarUrl} alt="User Avartar" crossOrigin="anonymous" />
        <UploadWidget buttonText="Change" />
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
