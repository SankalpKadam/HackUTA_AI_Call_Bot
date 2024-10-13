import "@src/app.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const categories = ["Restaurant", "Healthcare", "Finance", "Travel", "Retail"];
const servicesByCategory = {
	Restaurant: [
		"Delivery",
		"Dine-In",
		"Drive-thru",
		"Party Packages",
		"Catering",
	],
	Healthcare: [
		"Appointments",
		"Emergency Care",
		"Telemedicine",
		"Pharmacy",
		"Lab Tests",
	],
	Finance: [
		"Personal Banking",
		"Investments",
		"Loans",
		"Insurance",
		"Business Banking",
	],
	Travel: [
		"Flights",
		"Hotels",
		"Car Rentals",
		"Vacation Packages",
		"Travel Insurance",
	],
	Retail: [
		"In-Store Shopping",
		"Online Orders",
		"Curbside Pickup",
		"Returns",
		"Loyalty Program",
	],
};

export default function BusinessSetup() {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [availableServices, setAvailableServices] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const [descriptions, setDescriptions] = useState<{ [key: string]: string }>(
		{}
	);

	useEffect(() => {
		if (selectedCategory) {
			setAvailableServices(
				servicesByCategory[selectedCategory as keyof typeof servicesByCategory]
			);
			setSelectedServices([]);
			setDescriptions({});
		}
	}, [selectedCategory]);

	const toggleService = (service: string) => {
		setSelectedServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service]
		);
	};

	const handleDescriptionChange = (service: string, description: string) => {
		setDescriptions((prev) => ({ ...prev, [service]: description }));
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6 relative overflow-hidden">
			{/* Logo */}
      <span className="flex justify-start items-center m-2 mb-8">
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
        <h1 className="text-4xl font-bold  animate-fade-in-down">Business State</h1>
      </span>

			{/* Background Shapes */}
			<div className="absolute inset-0 overflow-hidden -z-10">
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

			{/* Main Content */}
			<div className="max-w-3xl mx-auto">
				<h2 className="text-2xl font-bold mb-4 animate-fade-in-down">
					Choose Business Category
				</h2>
				<div className="flex flex-wrap gap-3 mb-8">
					{categories.map((category, index) => (
						<button
							key={category}
							onClick={() => setSelectedCategory(category)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
								selectedCategory === category
									? "bg-emerald-400 text-gray-900"
									: "bg-gray-800 text-white border border-emerald-400 hover:bg-emerald-400 hover:text-gray-900"
							}`}
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{category}
						</button>
					))}
				</div>

				{selectedCategory && (
					<>
						<h2
							className="text-2xl font-bold mb-4 animate-fade-in-down"
							style={{ animationDelay: "500ms" }}
						>
							Select Services
						</h2>
						<div className="flex flex-wrap gap-3 mb-8">
							{availableServices.map((service, index) => (
								<button
									key={service}
									onClick={() => toggleService(service)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
										selectedServices.includes(service)
											? "bg-emerald-400 text-gray-900"
											: "bg-gray-800 text-white border border-emerald-400 hover:bg-emerald-400 hover:text-gray-900"
									}`}
									style={{ animationDelay: `${(index + 5) * 100}ms` }}
								>
									{service}
								</button>
							))}
						</div>
					</>
				)}

				{selectedServices.length > 0 && (
					<>
						<h2
							className="text-2xl font-bold mb-4 animate-fade-in-down"
							style={{ animationDelay: "1000ms" }}
						>
							Describe Services
						</h2>
						<div className="space-y-4">
							{selectedServices.map((service, index) => (
								<div
									key={service}
									className="animate-fade-in-up"
									style={{ animationDelay: `${1200 + index * 200}ms` }}
								>
									<p className="mb-2">
										{index + 1}. {service}
									</p>
									<textarea
										value={descriptions[service] || ""}
										onChange={(e) =>
											handleDescriptionChange(service, e.target.value)
										}
										placeholder={`Give a detailed description of ${service} (e.g. avg time, process, etc.)`}
										className="w-full h-32 px-3 py-2 text-gray-300 bg-gray-800 rounded-lg border border-gray-700 focus:border-emerald-400 focus:ring focus:ring-emerald-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out hover:border-emerald-300"
									/>
								</div>
							))}
						</div>
					</>
				)}

				{selectedServices.length > 0 && (
					<Link to="/dashboard">
						<button
							className="mt-8 px-6 py-2 bg-white text-gray-900 rounded-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-emerald-400 hover:text-white hover:shadow-lg animate-fade-in-up"
							style={{ animationDelay: "1400ms" }}
						>
							Submit
						</button>
					</Link>
				)}
			</div>
		</div>
	);
}
