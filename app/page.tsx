'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { motion, LazyMotion, domAnimation } from "motion/react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface HomePageProps {

}

const HomePage: FunctionComponent<HomePageProps> = () => {

  const [loading, setLoading] = useState(true);

  const introDescRef = useRef<HTMLDivElement>(null);

  const [showTextEffect, setShowTextEffect] = useState(false);

  const introRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
         if (entry.target === introRef.current && entry.isIntersecting) {
            setShowIntro(true);
          }
          if (entry.target === cardsRef.current && entry.isIntersecting) {
            setShowCards(true);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (introRef.current) {
      observer.observe(introRef.current);
    }
    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const words =
    "At MoodMate, we understand the importance of mental well-being in achieving a balanced and fulfilling life. That’s why we’ve created a trusted platform to guide you through your mental health journey. " +
    "Whether you're seeking support, tools to manage stress, or a space to reflect, MoodMate is here to help. Our personalized resources, mood tracking, and expert advice are designed to empower you every step of the way. " +
    "Discover a safe space for self-care, growth, and connection. With MoodMate, you’re never alone. Let’s take care of your mental health—together.";

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <LazyMotion features={domAnimation}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Welcome to MoodMate
              </h1>
              <motion.h3
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Your Mental Health Companion
              </motion.h3>
            </motion.div>
          </LazyMotion>
        </div>
        <LazyMotion features={domAnimation}>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            src="https://imgur.com/Aisv6mt.png"
            alt="hero"
            width={450}
            height={320}
            style={{ borderRadius: "20px", marginTop: "2rem" }}
          />
        </LazyMotion>
      </div>
      <div className={styles.intro} ref={introRef}>
        <LazyMotion features={domAnimation}>
          <motion.div
            ref={introRef}
            className={styles.intro}
            initial={{ opacity: 0, y: 60 }}
            animate={showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className={styles.introDesc}>
              {showIntro && <p>{words}</p>}
            </div>
            <div className={styles.introTitle}>
              <motion.h1
                initial={false}
                animate={showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 2, delay: 0.5 }}
                className={styles.underlineGradient}
              >
                What is MoodMate?
              </motion.h1>
            </div>
          </motion.div>
        </LazyMotion>
      </div>
      <div className={styles.cardsContainer}>
        <LazyMotion features={domAnimation}>
          <motion.div
            ref={cardsRef}
            className={styles.cardsContainer}
            initial={{ opacity: 0, y: 60 }}
            animate={showCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className={styles.underlineGradient}>Why is Your Mental Health Important?</h1>
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
          </motion.div>
        </LazyMotion>
      </div>
    </>
  );
}

export default HomePage;