import Image from "next/image";
import styles from "./page.module.css";
import { FunctionComponent } from "react";
import { loadEnvFile } from "process";

interface HomePageProps {

}

const HomePage: FunctionComponent<HomePageProps> = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Welcome to MoodMate</h1>
            <h2>Your Mental Health</h2>
            <h3>Companian</h3>
          </div>
          <div className={styles.image}>
            <img
              src="https://imgur.com/Aisv6mt.png"
              alt="image1"
              width={450}
              height={320}
              style={{ borderRadius: "20px" }} />
          </div>
        </div>
      </div>
      {/* <div className={styles.introContainer}> */}
        <div className={styles.intro}>
          <div className={styles.introDesc}>
            <p>
              At MoodMate, we understand the importance of mental well-being in achieving a balanced and fulfilling life. That’s why we’ve created a trusted platform to guide you through your mental health journey.

              Whether you're seeking support, tools to manage stress, or a space to reflect, MoodMate is here to help. Our personalized resources, mood tracking, and expert advice are designed to empower you every step of the way.

              Discover a safe space for self-care, growth, and connection. With MoodMate, you’re never alone. Let’s take care of your mental health—together.
            </p>
          </div>
          <div className={styles.introTitle}>
            <h1>What is MoodMate?</h1>
          </div>
        </div>
      {/* </div> */}
      <div className={styles.cardsContainer}>
        <h1 style={{ padding: "20px" }}>Why is Your Mental Health Important?</h1>
        <div className={styles.cards}>
          <div className={styles.card} style={{ backgroundColor: "#E2DADB" }}>
            <img
              src="https://imgur.com/Yc29EYI.png"
              alt="image1"
              width={250}
              height={250}
              style={{ borderRadius: "15px 15px 0px 0px" }} />
            <div className={styles.desc}>
              <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>Foundation for Overall Well-being</p>
              <p>Mental health is closely linked to physical health. Good mental health helps individuals manage stress, make healthy decisions, and maintain energy levels, which are crucial for leading a balanced life.</p>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundColor: "#DAE2DF" }}>
            <img
              src="https://imgur.com/pwLlwTq.png"
              alt="image1"
              width={250}
              height={250}
              style={{ borderRadius: "15px 15px 0px 0px" }} />
            <div className={styles.desc}>
              <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>Improved Productivity and Performance</p>
              <p>A healthy mind fosters focus, creativity, and efficiency, whether at work, school, or in personal endeavors. Mental well-being enables people to perform at their best.</p>
            </div>
          </div>
          <div className={styles.card} style={{ backgroundColor: "#E2DADB" }}>
            <img
              src="https://imgur.com/eMRif3U.png"
              alt="image1"
              width={250}
              height={250}
              style={{ borderRadius: "15px 15px 0px 0px" }} />
            <div className={styles.desc}>
              <p style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>Strengthened Relationships</p>
              <p>Mental health affects how individuals communicate and connect with others. When mental well-being is prioritized, it enhances emotional understanding, reducing conflicts and strengthening bonds with family, friends, and colleagues.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;