"use client";

import { useRef, useState, useEffect } from "react";

/**
 * DynamicInput - A text input that grows with user input and animates placeholders
 *
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.placeholder - Default placeholder text
 * @param {Array<string>} props.placeholderOptions - List of placeholder texts to cycle through
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.minWidth - Minimum width of the input
 * @param {number} props.maxLength - Maximum character length
 * @param {Object} props.inputProps - Additional props to pass to the input element
 */
const DynamicInput = ({
    value,
    onChange,
    placeholderOptions = [],
    className = "",
    minWidth = "120px",
    maxLength = 100,
    inputProps = {},
}) => {
    const inputRef = useRef(null);
    const hiddenTextRef = useRef(null);
    const [inputWidth, setInputWidth] = useState("auto");
    const [activePlaceholder, setActivePlaceholder] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    const [showCursor, setShowCursor] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const timeoutRef = useRef(null);
    const currentIndexRef = useRef(0);
    const lastIndexRef = useRef(-1); // Track the last used index to avoid repetition
    const minWidthPx = useRef(parseInt(minWidth, 10));
    const buffer = 20;

    // Initialize with first placeholder option if available
    useEffect(() => {
        if (placeholderOptions.length > 0) {
            let idx = getRandomIndex();
            setActivePlaceholder(placeholderOptions[idx]);
            currentIndexRef.current = idx;
            lastIndexRef.current = idx;
            setCursorPosition(placeholderOptions[idx].length);

            // Parse minimum width as number
            minWidthPx.current = parseInt(minWidth, 10);
        }
    }, [placeholderOptions, minWidth]);

    // Measure text width using the hidden element
    const measureTextWidth = (text) => {
        if (!hiddenTextRef.current || !inputRef.current)
            return minWidthPx.current;

        // Make sure styles are applied
        const inputStyles = window.getComputedStyle(inputRef.current);
        hiddenTextRef.current.style.font = inputStyles.font;
        hiddenTextRef.current.style.letterSpacing = inputStyles.letterSpacing;
        hiddenTextRef.current.style.padding = inputStyles.padding;

        hiddenTextRef.current.textContent = text || "";
        return hiddenTextRef.current.offsetWidth + buffer;
    };

    // Calculate cursor position in pixels with adjustment
    const calculateCursorPosition = (
        text = activePlaceholder,
        position = cursorPosition
    ) => {
        if (!hiddenTextRef.current) return buffer;

        // Measure just the text up to the cursor
        const textUpToCursor = text.substring(0, position);

        // Fixed cursor position adjustment
        return measureTextWidth(textUpToCursor) - buffer;
    };

    // Get random delay between 11-20 seconds
    const getRandomDelay = () => {
        return Math.floor(Math.random() * 10000) + 11000;
    };

    // Get a random index different from the last one
    const getRandomIndex = () => {
        if (placeholderOptions.length <= 1) return 0;

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * placeholderOptions.length);
        } while (
            randomIndex === lastIndexRef.current &&
            placeholderOptions.length > 1
        );

        lastIndexRef.current = randomIndex;
        return randomIndex;
    };

    // Clear all animation timeouts
    const clearAllTimeouts = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // Start the placeholder animation cycle
    const startAnimationCycle = () => {
        // Don't animate if user is typing or input is focused
        if (
            value ||
            hasFocus ||
            isAnimating ||
            placeholderOptions.length <= 1
        ) {
            return;
        }

        setIsAnimating(true);
        setShowCursor(true);

        // Get current placeholder text (use local variable to avoid async issues)
        const currentText = placeholderOptions[currentIndexRef.current];

        // Select next placeholder randomly
        const nextIndex = getRandomIndex();
        currentIndexRef.current = nextIndex;
        const nextText = placeholderOptions[nextIndex];

        // Get the current width - this is what we'll keep if next is wider
        const currentFullWidth = measureTextWidth(currentText);
        const nextFullWidth = measureTextWidth(nextText);

        // Compare widths to determine animation behavior
        const isNextWider = nextFullWidth > currentFullWidth;

        let phase = "backspacing";
        let charIndex = currentText.length;

        // Local variable to track current display text
        let currentDisplayText = currentText;

        // For wider next text, keep original width
        // For narrower next text, use next text width
        let widthToMaintain = isNextWider ? currentFullWidth : nextFullWidth;

        // Set initial cursor position and show it for half a second before animating
        setCursorPosition(charIndex);

        // Animation step function
        const animate = () => {
            // Backspacing phase
            if (phase === "backspacing") {
                if (charIndex > 0) {
                    charIndex--;
                    currentDisplayText = currentText.substring(0, charIndex);
                    setActivePlaceholder(currentDisplayText);

                    setCursorPosition(charIndex);

                    // Calculate width of current text
                    const currentTextWidth =
                        measureTextWidth(currentDisplayText);

                    // Important: If next is wider, always shrink with text
                    // If next is narrower, stop at next's full width
                    const targetWidth = isNextWider
                        ? Math.max(currentTextWidth, currentFullWidth) // For wider: just follow text
                        : Math.max(
                              currentTextWidth,
                              widthToMaintain,
                              minWidthPx.current
                          ); // For narrower: don't go below next width

                    setInputWidth(`${targetWidth}px`);

                    timeoutRef.current = setTimeout(animate, 60);
                } else {
                    // Transition to typing phase
                    phase = "typing";
                    charIndex = 0;
                    currentDisplayText = "";

                    // Important: Maintain our current width, not the next text's width
                    setInputWidth(
                        `${Math.max(minWidthPx.current, widthToMaintain)}px`
                    );

                    timeoutRef.current = setTimeout(animate, 300);
                }
            }
            // Typing phase
            else if (phase === "typing") {
                if (charIndex < nextText.length) {
                    charIndex++;
                    currentDisplayText = nextText.substring(0, charIndex);
                    setActivePlaceholder(currentDisplayText);
                    setCursorPosition(charIndex);

                    const currentTextWidth =
                        measureTextWidth(currentDisplayText);

                    // Only grow width if needed during typing
                    if (currentTextWidth > widthToMaintain) {
                        widthToMaintain = currentTextWidth;
                        setInputWidth(
                            `${Math.max(minWidthPx.current, widthToMaintain)}px`
                        );
                    }

                    timeoutRef.current = setTimeout(animate, 70);
                } else {
                    // Animation finished
                    timeoutRef.current = setTimeout(() => {
                        setShowCursor(false);
                        setIsAnimating(false);

                        // Schedule next cycle
                        timeoutRef.current = setTimeout(
                            startAnimationCycle,
                            getRandomDelay()
                        );
                    }, 500);
                }
            }
        };

        timeoutRef.current = setTimeout(() => {
            // Then start the actual animation
            animate();
        }, 500);
    };

    // Update width when content changes outside of animation
    useEffect(() => {
        if (!isAnimating) {
            const contentWidth = measureTextWidth(value || activePlaceholder);
            setInputWidth(
                `${Math.max(
                    measureTextWidth(activePlaceholder),
                    contentWidth
                )}px`
            );
        }
    }, [value, activePlaceholder, isAnimating]);

    // Handle focus events
    const handleFocus = (e) => {
        setHasFocus(true);
        setShowCursor(false);
        clearAllTimeouts();

        if (inputProps.onFocus) {
            inputProps.onFocus(e);
        }
    };

    const handleBlur = (e) => {
        setHasFocus(false);

        // Restart animation cycle if input is empty
        if (!value && !isAnimating) {
            timeoutRef.current = setTimeout(
                startAnimationCycle,
                getRandomDelay()
            );
        }

        if (inputProps.onBlur) {
            inputProps.onBlur(e);
        }
    };

    // Start initial animation after component mounts
    useEffect(() => {
        if (
            placeholderOptions.length > 1 &&
            !value &&
            !hasFocus &&
            !isAnimating
        ) {
            timeoutRef.current = setTimeout(
                startAnimationCycle,
                getRandomDelay()
            );
        }

        return clearAllTimeouts;
    }, []);

    // Restart animation when value or focus changes
    useEffect(() => {
        clearAllTimeouts();

        if (
            !value &&
            !hasFocus &&
            !isAnimating &&
            placeholderOptions.length > 1
        ) {
            timeoutRef.current = setTimeout(
                startAnimationCycle,
                getRandomDelay()
            );
        }
    }, [value, hasFocus]);

    return (
        <div className="inline-block relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={activePlaceholder}
                maxLength={maxLength}
                style={{
                    width: inputWidth,
                    paddingLeft: `${buffer}px`,
                    transition: "width 0.1s ease-out",
                }}
                className={`
          bg-transparent 
          outline-none
          ${className}
        `}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...inputProps}
            />

            {/* Thicker animated cursor with adjusted positioning */}
            {showCursor && !value && !hasFocus && (
                <div
                    className="absolute animate-pulse"
                    style={{
                        height: "1.4em",
                        width: "4px",
                        backgroundColor: "#666",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: `${calculateCursorPosition(
                            activePlaceholder,
                            cursorPosition
                        )}px`,
                    }}
                />
            )}

            <div
                className={`absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-out`}
                style={{
                    width: `calc(100% - ${buffer}px)`,
                    left: `${buffer / 2}px`,
                }}
            />

            {/* Hidden element to measure text width */}
            <div
                ref={hiddenTextRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    visibility: "hidden",
                    height: 0,
                    overflow: "hidden",
                    whiteSpace: "pre",
                }}
            >
                {value || activePlaceholder}
            </div>
        </div>
    );
};

export default DynamicInput;
