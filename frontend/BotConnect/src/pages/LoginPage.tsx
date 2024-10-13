import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
// import Link from 'next/link'
import { Link } from "react-router-dom";
import "@src/app.css"; // Import the CSS file

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<span className="absolute flex justify-start items-center mb-8 bg-gray-900 text-white p-8">
				<Link to="/">
					<div className="transform transition-all duration-500 hover:scale-110 mr-5 relative top-[2px]">
						<svg
							className="w-8 h-8 text-emerald-400 animate-pulse"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
						</svg>
					</div>
				</Link>
				<h1 className="text-4xl font-bold  animate-fade-in-down">
					Welcome, User
				</h1>
			</span>

			<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
				<div className="w-full max-w-md animate-fade-in">
					<Card className="bg-gray-800 border-gray-700">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-white text-center">
								Login
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2 animate-fade-in-delay-1">
								<Label
									htmlFor="email"
									className="text-white"
								>
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
								/>
							</div>
							<div className="space-y-2 animate-fade-in-delay-2">
								<Label
									htmlFor="password"
									className="text-white"
								>
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<Link to="/businesssetup">
								<Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-300 animate-fade-in-delay-3">
									Login
								</Button>
							</Link>
							<p className="text-sm text-gray-400 text-center animate-fade-in-delay-3">
								Don't have an account?{" "}
								<Link
									to="/signup"
									className="text-emerald-500 hover:underline"
								>
									Sign up
								</Link>
							</p>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
