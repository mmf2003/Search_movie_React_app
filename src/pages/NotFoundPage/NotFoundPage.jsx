import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import "./NotFoundPage.css";

function NotFoundPage() {
    useEffect(() => {
        document.title = "404 | Movie Search";

        return () => {
            document.title = "Movie Search";
        };
    }, []);

    return (
        <main className="not-found">
            <div className="not-found__glow" aria-hidden="true" />

            <motion.section
                className="not-found__content"
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                <h1 className="not-found__code">404</h1>

                <h2 className="not-found__title">This scene does not exist</h2>

                <p className="not-found__description">
                    The page may have been removed, renamed, or never existed.
                </p>

                <Link className="not-found__link" to="/">
                    Return to movie search
                </Link>
            </motion.section>
        </main>
    );
}

export default NotFoundPage;
