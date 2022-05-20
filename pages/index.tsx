import { useState } from "react";
import type { NextPage } from "next";
import {
  validateSubdomainFormat,
  IdentityNameValidityError,
} from "@stacks/keychain";
import styles from "../styles/Home.module.css";

const identityNameLengthError =
  "Your username should be at least 8 characters, with a maximum of 37 characters.";
const identityNameIllegalCharError =
  "You can only use lowercase letters (a–z), numbers (0–9), and underscores (_).";
const identityNameUnavailableError = "This username is not available.";
const errorTextMap = {
  [IdentityNameValidityError.MINIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.MAXIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.ILLEGAL_CHARACTER]: identityNameIllegalCharError,
  [IdentityNameValidityError.UNAVAILABLE]: identityNameUnavailableError,
};

const registrarUrl = "https://registrar.stacks.co";
const subdomain = "id.stx";

const validateSubdomainAvailability = async (
  name: string,
  subdomain: string
) => {
  try {
    const url = `${registrarUrl}/v1/names/${name.toLowerCase()}.${subdomain}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status !== "available") {
      return IdentityNameValidityError.UNAVAILABLE;
    }
    return null;
  } catch (error) {
    return IdentityNameValidityError.UNAVAILABLE;
  }
};

const Home: NextPage = () => {
  const [secretKey, setSecretKey] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (secretKey === "") {
      setErrorMessage("Secret key is required");
      return;
    }
    if (secretKey.split(" ").length !== 12) {
      setErrorMessage("Secret key must be 12 words");
      return;
    }

    if (username === "") {
      setErrorMessage("Username is required");
      return;
    }

    const validityError = await validateSubdomainAvailability(
      username,
      subdomain
    );
    if (validityError !== null) {
      setErrorMessage(errorTextMap[validityError]);
      return;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Register username</h1>
      <p>Enter your 12 words secret key</p>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="Secret key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />

        <div>
          <p>Enter your username</p>
          <input
            className={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        <div className={styles.submit_container}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Home;
