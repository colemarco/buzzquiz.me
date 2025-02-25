import React, { useEffect, useRef, useState } from "react";

const AnimatedHeader = ({
    text = "BuzzQuiz",
    className = "",
    fontFamily = "",
    cursorRepulsionStrength = 10, // How strongly the cursor repels (in degrees)
}) => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 }); // Normalized position (0-1)

    // Handle mouse movement
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();

            // Calculate normalized position (0-1) within the container
            const x = Math.max(
                0,
                Math.min(1, (e.clientX - rect.left) / rect.width)
            );
            const y = Math.max(
                0,
                Math.min(1, (e.clientY - rect.top) / rect.height)
            );

            setMousePosition({ x, y });
        };

        // Add mouse event listeners
        container.addEventListener("mousemove", handleMouseMove);

        // Set default position when mouse leaves
        const handleMouseLeave = () => {
            setMousePosition({ x: 0.5, y: 0.5 });
        };

        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // Animation and transformation effect
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        let startTime = null;
        const animationDuration = 5000; // 6 seconds for a full animation cycle

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress =
                (elapsedTime % animationDuration) / animationDuration;

            // Base animation rotation angles
            const baseRotateX = Math.abs(Math.sin(progress * Math.PI * 2)) * 5;
            const baseRotateY = Math.sin(progress * Math.PI * 2) * 3;
            const baseRotateZ = Math.sin(progress * Math.PI * 2 * 0.5);

            // Calculate cursor repulsion effect
            // When cursor is at center (0.5, 0.5), no additional tilt
            // When cursor moves away from center, tilt away from cursor
            const cursorRotateX =
                (mousePosition.y - 0.5) * -2 * cursorRepulsionStrength; // Invert Y for natural feeling
            const cursorRotateY =
                (mousePosition.x - 0.5) * 2 * cursorRepulsionStrength; // Invert X for repulsion

            // Combine base animation with cursor repulsion
            const rotateX = baseRotateX + cursorRotateX;
            const rotateY = baseRotateY + cursorRotateY;
            const rotateZ = baseRotateZ;

            // Using sigmoid for smoother light transitions
            const sigmoid = (x) => 1 / (1 + Math.exp(-x * 3));

            // Apply lighting calculations as before, but using combined rotation values
            const topLeftBase = (-rotateX - 1) * (-rotateY - 1);
            const topLeftLight = sigmoid(topLeftBase) * 0.6;

            const topRightBase = (-rotateX - 1) * (rotateY - 1);
            const topRightLight = sigmoid(topRightBase) * 0.6;

            const bottomLeftBase = (rotateX - 1) * (-rotateY - 1);
            const bottomLeftLight = sigmoid(bottomLeftBase) * 0.6;

            const bottomRightBase = (rotateX - 1) * (rotateY - 1);
            const bottomRightLight = sigmoid(bottomRightBase) * 0.6;

            // Apply the lighting
            header.style.backgroundImage = `
        radial-gradient(circle at top left, rgba(150, 102, 241, ${topLeftLight}) 0%, transparent 80%),
        radial-gradient(circle at top right, rgba(236, 72, 153, ${topRightLight}) 0%, transparent 80%),
        radial-gradient(circle at bottom left, rgba(236, 72, 153, ${bottomLeftLight}) 0%, transparent 80%),
        radial-gradient(circle at bottom right, rgba(150, 102, 241, ${bottomRightLight}) 0%, transparent 80%),
        linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)
      `;

            // Apply the combined transformation
            header.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [mousePosition, cursorRepulsionStrength]);

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden py-6 relative cursor-default"
        >
            <h1
                ref={headerRef}
                className={`text-9xl font-extrabold text-center transition-transform ${fontFamily} ${className}`}
                style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    textShadow:
                        "0px 2px 4px rgba(0,0,0,0.3), 0px 8px 13px rgba(0,0,0,0.1)",
                    backgroundSize: "100% 100%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                {text}
            </h1>
        </div>
    );
};

export default AnimatedHeader;
