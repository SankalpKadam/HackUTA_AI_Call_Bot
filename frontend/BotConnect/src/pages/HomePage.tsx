import React from "react";
import "@/index.css";
import { Link } from "react-router-dom";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col">
			{/* Logo */}
			<Link to="/">
				<div className="p-6">
					<svg
						className="w-8 h-8 text-emerald-400"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
					</svg>
				</div>
			</Link>

			{/* Main Content */}
			<main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				{/* Background Shapes */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-teal-900/20 rounded-full"></div>
					<div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] border border-teal-900/20 rounded-full"></div>
					<div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-[400px] h-[800px] border border-teal-900/20 rounded-full"></div>
				</div>

				{/* Content */}
				<div className="max-w-3xl mx-auto text-center relative z-10">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
						Revolutionize Your Customer Interactions with AI-Powered Call Bots
					</h1>
					<p className="text-xl sm:text-2xl text-gray-300 mb-10">
						Engage, Support, and Connect Seamlessly with Our Intelligent Voice
						Assistants
					</p>
					<Link to="/buinesssetup">
						<button className="bg-emerald-400 text-gray-900 font-bold py-3 px-8 rounded-md text-lg hover:bg-emerald-300 transition-colors duration-300">
							Get Started
						</button>
					</Link>
				</div>
			</main>
		</div>
	);
}
