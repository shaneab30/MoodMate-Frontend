'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { motion, LazyMotion, domAnimation, rgba } from "motion/react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { WobbleCard } from "@/components/ui/wobble-card";

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
                  background: 'rgba(127, 140, 170)',
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
                  background: 'rgba(127, 140, 170)',
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
                  background: 'rgba(127, 140, 170)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(127, 140, 170, 0.3)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                  onClick={() => window.location.href = "/sign-up"}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(127, 140, 170, 0)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(127, 140, 170, 0)';
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
      <LazyMotion features={domAnimation}>
        <motion.div
          ref={introRef}
          className={`${styles.intro} grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
          initial={{ opacity: 0, y: 60 }}
          animate={showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        >
          {/* LEFT: Wobble Card */}
          <WobbleCard
            containerClassName="relative w-full bg-[rgba(127,140,170,1)] min-h-[450px] rounded-3xl overflow-hidden order-2 lg:order-1"
          >
            {/* Apply the CSS Module class here */}
            <div className={styles.wobbleContent}>
              <div style={{ maxWidth: '600px' }}>
                <h2 className="text-left text-3xl lg:text-5xl font-bold text-white leading-tight">
                  At Moodmate
                </h2>
                <p className={styles.wobbleText}>
                  we understand the importance of mental well-being in achieving a balanced and fulfilling life.
                  That's why we've created a trusted platform to guide you through your mental health journey.
                  Whether you're seeking support, tools to manage stress, or a space to reflect, MoodMate is here to help.
                  Our personalized resources, mood tracking, and expert advice are designed to empower you every step of the way.
                  Discover a safe space for self-care, growth, and connection.
                  With MoodMate, you're never alone. Let's take care of your mental health—together.
                </p>
              </div>
            </div>

            <img
              src="https://imgur.com/pwLlwTq.png"
              alt="demo"
              className="absolute -right-5 -bottom-12 w-36 md:w-48 lg:-right-15 lg:-bottom-10 lg:w-96 opacity-70 md:opacity-70 pointer-events-none object-contain z-[-1]"
            />
          </WobbleCard>

          {/* RIGHT: Title */}
          <div className={`${styles.introTitle} order-1 lg:order-2`}>
            <h1 className={styles.underlineGradient}>
              What is MoodMate?
            </h1>
          </div>
        </motion.div>
      </LazyMotion>
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
              <div className={styles.card} style={{ backgroundColor: "#7F8CAA" }}>
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
              <div className={styles.card} style={{ backgroundColor: "#7F8CAA" }}>
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
              <div className={styles.card} style={{ backgroundColor: "#7F8CAA" }}>
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