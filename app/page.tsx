import Image from "next/image";
import styles from "./page.module.css";
import { FunctionComponent } from "react";

interface HomePageProps {

}

const HomePage: FunctionComponent<HomePageProps> = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Welcome to MoodMate</h1>
          <h2>Your Mental Health</h2>
          <h3>Companian</h3>
        </div>
        <div className={styles.image}>
          <img
            src="https://imgur.com/1OpAhUn.png"
            alt="image1"
            width={450}
            height={320} />
        </div>
      </div>
      <div className={styles.container}>
        <h1>Start Now!</h1>
      </div>
    </>
  );
}

export default HomePage;