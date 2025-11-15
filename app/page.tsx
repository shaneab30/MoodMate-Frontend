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
    
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero} >
          {/* Animated background blobs */}
          <div className={styles.blobs} ></div>
          <div className={styles.blobs2} ></div>

          <div className={styles.content} style={{
            
          }}>
            <LazyMotion features={domAnimation}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.1,
                    marginBottom: '20px'
                  }}
                >
                  Welcome to MoodMate
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '30px'
                  }}
                >
                  Your Mental Health Companion
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <button style={{
                    padding: '16px 36px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}
                    onClick={() => window.location.href = "/sign-up"}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(168, 85, 247, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.3)';
                    }}
                  >
                    Get Started
                  </button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  position: 'absolute',
                  inset: '-20px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  borderRadius: '30px',
                  filter: 'blur(40px)',
                  opacity: 0.3,
                  zIndex: -1
                }}></div>
                <img
                  src="https://imgur.com/Aisv6mt.png"
                  alt="hero"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '30px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </motion.div>
            </LazyMotion>
          </div>
          <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-30px) translateX(20px); }
          }
        `}</style>
        </section>
        <div className={styles.intro} ref={introRef}>
          <LazyMotion features={domAnimation}>
            <motion.div
              ref={introRef}
              className={styles.intro}
              initial={{ opacity: 0, y: 60 }}
              animate={showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            >
              <div className={styles.introDesc}>
                {showIntro && <p style={{ fontSize: 20}}>{words}</p>}
              </div>
              <div className={styles.introTitle}>
                {/* <motion.h1
                initial={false}
                animate={showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.5 }}
                className={styles.underlineGradient}
              > */}
                <h1 className={styles.underlineGradient}>What is MoodMate?</h1>
                {/* </motion.h1> */}
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
              transition={{ duration: 2, ease: "easeOut" }}
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
      </div>
      );
}

      export default HomePage;