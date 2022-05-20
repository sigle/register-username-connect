import { useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [secretKey, setSecretKey] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
