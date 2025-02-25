import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ReactNode } from "react";

// Load fonts
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "BuzzQuiz - Find Out What You Are",
    description: "Generate fun, personalized quizzes about anything",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${poppins.variable}`}>
                {children}
            </body>
        </html>
    );
}
