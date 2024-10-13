import "@src/app.css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col">
			{/* Header */}
			<header className="m-2 p-6 flex justify-between items-center">
				{/* Logo */}
				<Link to="/">
					<div className="transform transition-all duration-500 hover:scale-110">
						<svg
							className="w-8 h-8 text-emerald-400 animate-pulse"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
						</svg>
					</div>
				</Link>

				{/* Login Button */}
				<Link to="/signup">
					<button className="bg-transparent border border-emerald-400 text-emerald-400 font-semibold py-2 px-4 rounded-md hover:bg-emerald-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
						Sign Up
					</button>
				</Link>
			</header>

			{/* Main Content */}
			<main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				{/* Background Shapes */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-teal-900/20 rounded-full animate-pulse"></div>
					<div
						className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] border border-teal-900/20 rounded-full animate-pulse"
						style={{ animationDelay: "1s" }}
					></div>
					<div
						className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-[400px] h-[800px] border border-teal-900/20 rounded-full animate-pulse"
						style={{ animationDelay: "2s" }}
					></div>
				</div>

				{/* Content */}
				<div className="max-w-3xl mx-auto text-center relative z-10">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-down">
						Revolutionize Your Customer Interactions with AI-Powered Call Bots
					</h1>
					<p
						className="text-xl sm:text-2xl text-gray-300 mb-10 animate-fade-in-up"
						style={{ animationDelay: "0.5s" }}
					>
						Engage, Support, and Connect Seamlessly with Our Intelligent Voice
						Assistants
					</p>
					<Link to="/login">
						<button
							className="bg-emerald-400 text-gray-900 font-bold py-3 px-8 rounded-md text-lg hover:bg-emerald-300 transition-all duration-300 transform hover:scale-105 animate-fade-in-up flex items-center justify-center mx-auto"
							style={{ animationDelay: "1s" }}
						>
							Get Started / Login
							<ArrowRight className="ml-2 h-5 w-5" />
						</button>
					</Link>
				</div>
			</main>
		</div>
	);
}
