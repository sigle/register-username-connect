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
      <img className={styles.logo} src="/logo.png" />
      <h1>Recover username</h1>

      <p className={styles.description}>
        When you pick a username on Sigle, the username is registered on-chain
        (which is an async operation). A transaction is sent to the Stacks
        blockchain and this transaction may succeed in 10 minutes or fail in 3
        days. If the transaction failed, the username was not registered and you
        have to register it again.
      </p>

      <p className={styles.description}>
        To fix the issue, you need to re-register the same username for your
        account. To do this please enter your <b>12 words</b> seed phrase and
        your username below. The code is{" "}
        <a
          href="https://github.com/sigle/register-username-connect"
          target="_blank"
        >
          open source
        </a>{" "}
        and you can run it locally if you wish.
      </p>

      <form onSubmit={handleSubmit}>
        <p>Enter your 12 words secret key</p>
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
          <button className={styles.submit} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
