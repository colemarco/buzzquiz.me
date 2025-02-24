"use client";

import { useRef, useState, useEffect } from "react";

/**
 * DynamicInput - A text input that grows with user input
 *
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.minWidth - Minimum width of the input
 * @param {number} props.minLength - Minimum character length
 * @param {number} props.maxLength - Maximum character length
 * @param {Object} props.inputProps - Additional props to pass to the input element
 */
const DynamicInput = ({
    value,
    onChange,
    placeholder = "",
    className = "",
    minWidth = "120px",
    minLength = 3,
    maxLength = 100,
    inputProps = {},
}) => {
    const inputRef = useRef(null);
    const hiddenTextRef = useRef(null);
    const [inputWidth, setInputWidth] = useState("auto");
    const buffer = 20; // Small buffer to prevent text crowding

    // Update width when value or placeholder changes
    useEffect(() => {
        if (!hiddenTextRef.current || !inputRef.current) return;

        // Clone the input styles to our hidden text element
        const inputStyles = window.getComputedStyle(inputRef.current);
        hiddenTextRef.current.style.font = inputStyles.font;
        hiddenTextRef.current.style.letterSpacing = inputStyles.letterSpacing;
        hiddenTextRef.current.style.padding = inputStyles.padding;
        hiddenTextRef.current.style.border = inputStyles.border;
        hiddenTextRef.current.style.boxSizing = inputStyles.boxSizing;

        // Set content to measure
        hiddenTextRef.current.textContent = value || placeholder;

        // Calculate width with a buffer to prevent text crowding
        const rawWidth = hiddenTextRef.current.offsetWidth;

        // Get minimum width based on placeholder
        hiddenTextRef.current.textContent = placeholder;
        const placeholderWidth = hiddenTextRef.current.offsetWidth;

        // Set width to the larger of actual content width or placeholder width
        const calculatedWidth = Math.max(rawWidth, placeholderWidth) + buffer; // Adding buffer for both sides
        const minWidthPx = parseInt(minWidth, 10);

        setInputWidth(`${Math.max(minWidthPx, calculatedWidth)}px`);
    }, [value, placeholder, minWidth]);

    return (
        <div className="inline-block relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                style={{
                    width: inputWidth,
                    paddingLeft: `${buffer}px`, // Add the same buffer as padding
                    // paddingRight: `${buffer}px`, // Balanced padding on both sides
                }}
                className={`
                    bg-transparent 
                    outline-none transition-all duration-100 ease-out
                    ${className}
                `}
                {...inputProps}
            />

            <div
                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-100 ease-out`}
                style={{
                    width: `calc(100% - ${buffer}px)`, // Always visible, whether there's text or not
                    left: `${buffer / 2}px`, // Half buffer on the left
                    transform: "translateY(-1px)", // Adjust as needed
                }}
            />

            {/* Hidden element to measure text width - styled like the input */}
            <div
                ref={hiddenTextRef}
                aria-hidden="true"
                className="absolute top-0 left-0 invisible whitespace-pre h-0 overflow-hidden"
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
                {value || placeholder}
            </div>
        </div>
    );
};

export default DynamicInput;
