import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

// const GET_DATA_URL = "https://f446-2603-8080-8f0-b730-75a5-419f-c6a6-892b.ngrok-free.app/getData"
const GET_DATA_URL = "http://localhost:3000/getData"

type Order = {
  order_id: string;
  name: string;
	address: string;
	items: { item_name: string; quantity:number; price: number }[];
  order_total: number;
	order_date: string;
	order_time: string;
};

const initialOrders: Order[] = [
	// {
	// 	id: "123",
	// 	order_date: "2023-06-10 14:30",
	// 	name: "Aryan",
	// 	items: [
	// 		{ name: "Cheese Burger", price: 15 },
	// 		{ name: "French Fries", price: 15 },
	// 	],
	// },
	// {
	// 	id: "124",
	// 	order_date: "2023-06-10 15:00",
	// 	name: "Shashwat",
	// 	items: [
	// 		{ name: "Veggie Pizza", price: 20 },
	// 		{ name: "Salad", price: 10 },
	// 	],
	// },
	// {
	// 	id: "125",
	// 	order_date: "2023-06-10 15:30",
	// 	name: "Sankalp",
	// 	items: [
	// 		{ name: "Chicken Wings", price: 18 },
	// 		{ name: "Soda", price: 5 },
	// 	],
	// },
	// {
	// 	id: "126",
	// 	time: "2023-06-10 14:30",
	// 	customerName: "Aryan",
	// 	items: [
	// 		{ name: "Cheese Burger", price: 15 },
	// 		{ name: "French Fries", price: 15 },
	// 	],
	// },
	// {
	// 	id: "127",
	// 	time: "2023-06-10 15:00",
	// 	customerName: "Shashwat",
	// 	items: [
	// 		{ name: "Veggie Pizza", price: 20 },
	// 		{ name: "Salad", price: 10 },
	// 	],
	// },
	// {
	// 	id: "128",
	// 	time: "2023-06-10 15:30",
	// 	customerName: "Sankalp",
	// 	items: [
	// 		{ name: "Chicken Wings", price: 18 },
	// 		{ name: "Soda", price: 5 },
	// 	],
	// },
	// {
	// 	id: "129",
	// 	time: "2023-06-10 14:30",
	// 	customerName: "Aryan",
	// 	items: [
	// 		{ name: "Cheese Burger", price: 15 },
	// 		{ name: "French Fries", price: 15 },
	// 	],
	// },
	// {
	// 	id: "130",
	// 	time: "2023-06-10 15:00",
	// 	customerName: "Shashwat",
	// 	items: [
	// 		{ name: "Veggie Pizza", price: 20 },
	// 		{ name: "Salad", price: 10 },
	// 	],
	// },
	// {
	// 	id: "131",
	// 	time: "2023-06-10 15:30",
	// 	customerName: "Sankalp",
	// 	items: [
	// 		{ name: "Chicken Wings", price: 18 },
	// 		{ name: "Soda", price: 5 },
	// 	],
	// },
	// {
	// 	id: "132",
	// 	time: "2023-06-10 14:30",
	// 	customerName: "Aryan",
	// 	items: [
	// 		{ name: "Cheese Burger", price: 15 },
	// 		{ name: "French Fries", price: 15 },
	// 	],
	// },
	// {
	// 	id: "133",
	// 	time: "2023-06-10 15:00",
	// 	customerName: "Shashwat",
	// 	items: [
	// 		{ name: "Veggie Pizza", price: 20 },
	// 		{ name: "Salad", price: 10 },
	// 	],
	// },
	// {
	// 	id: "134",
	// 	time: "2023-06-10 15:30",
	// 	customerName: "Sankalp",
	// 	items: [
	// 		{ name: "Chicken Wings", price: 18 },
	// 		{ name: "Soda", price: 5 },
	// 	],
	// },
	// {
	// 	id: "135",
	// 	time: "2023-06-10 14:30",
	// 	customerName: "Aryan",
	// 	items: [
	// 		{ name: "Cheese Burger", price: 15 },
	// 		{ name: "French Fries", price: 15 },
	// 	],
	// },
	// {
	// 	id: "136",
	// 	time: "2023-06-10 15:00",
	// 	customerName: "Shashwat",
	// 	items: [
	// 		{ name: "Veggie Pizza", price: 20 },
	// 		{ name: "Salad", price: 10 },
	// 	],
	// },
	// {
	// 	id: "137",
	// 	time: "2023-06-10 15:30",
	// 	customerName: "Sankalp",
	// 	items: [
	// 		{ name: "Chicken Wings", price: 18 },
	// 		{ name: "Soda", price: 5 },
	// 	],
	// },
	// Add more orders as needed
];

export default function ViewOrders() {
	const [orders, setOrders] = useState<Order[]>(initialOrders);
	const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
	const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

	const toggleOrderSelection = (orderId: string) => {
		const newSelectedOrders = new Set(selectedOrders);
		if (newSelectedOrders.has(orderId)) {
			newSelectedOrders.delete(orderId);
		} else {
			newSelectedOrders.add(orderId);
		}
		setSelectedOrders(newSelectedOrders);
	};

	const completeSelectedOrders = () => {
		setOrders(orders.filter((order) => !selectedOrders.has(order.order_id)));
		setSelectedOrders(new Set());
	};

	const calculateTotal = (items: { item_name: string; quantity:number; price: number }[]) => {
		const subtotal = items.reduce((sum, item) => sum + item.price, 0);
		const tax = subtotal * 0.1; // Assuming 10% tax
		return (subtotal + tax).toFixed(2);
	};

	useEffect(() => {
		const fetchOrders = async () => {
		try {
			const response = await axios.get(GET_DATA_URL);
			setOrders(response.data);
		} catch (error) {
			console.error("Error fetching orders: ", error);
		}
    };
    fetchOrders();
  }, []);

	return (
		<div className="min-h-screen bg-gray-900 text-white p-8">
			<span className="flex justify-start items-center mb-8">
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
				<h1 className="text-4xl font-bold  animate-fade-in-down">Orders</h1>
			</span>

			<div className="rounded-xl overflow-hidden border border-gray-700">
				<ScrollArea className="h-[calc(100vh-200px)]">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-800 border-b border-gray-700 ">
								<TableHead className="text-white w-[50px] py-4"></TableHead>
								<TableHead className="text-white px-4 py-4">Order Date</TableHead>
								<TableHead className="text-white px-4 py-4">Order Time</TableHead>
								<TableHead className="text-white px-4 py-4">Order ID</TableHead>
								<TableHead className="text-white px-4 py-4">Customer Name</TableHead>
								<TableHead className="text-white px-5 py-4 text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order,index) => (
								<TableRow
									key={index}
									className="transition-colors duration-300 hover:bg-gray-950 border-b border-gray-700 last:border-b-0"
								>
									<TableCell className="px-4 py-4">
										<Checkbox
											checked={selectedOrders.has(order.order_id)}
											onCheckedChange={() => toggleOrderSelection(order.order_id)}
											className="border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
										/>
									</TableCell>
									<TableCell className="px-4 py-4">{new Date(order.order_date).toLocaleDateString()}</TableCell>
									<TableCell className="px-4 py-4">{order.order_time}</TableCell>
									<TableCell className="px-4 py-4">{order.order_id}</TableCell>
									<TableCell className="px-4 py-4">{order.name}</TableCell>
									<TableCell className="px-5 py-4 text-right">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setViewingOrder(order)}
											className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-300"
										>
											<Eye className="w-4 h-4 mr-2" />
											View
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>

			<div className="mt-6 flex justify-end">
				<Button
					onClick={completeSelectedOrders}
					disabled={selectedOrders.size === 0}
					className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-300 px-6 py-2 rounded-full"
				>
					Complete Selected Orders
				</Button>
			</div>

			<Dialog
				open={viewingOrder !== null}
				onOpenChange={() => setViewingOrder(null)}
			>
				<DialogContent className="bg-gray-800 text-white rounded-xl border border-gray-700">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							Order #{viewingOrder?.order_id}
						</DialogTitle>
					</DialogHeader>
					<div className="mt-4">
            <div
								className="flex justify-between items-center py-2"
							>
								<span className="w-1/3">Item Name</span>
								<span className="w-1/3 text-center">Quantity</span>
								<span className="w-1/3 text-right">Price</span>
							</div>
						{viewingOrder?.items.map((item, index) => (
							<div
								key={index}
								className="flex justify-between items-center py-2"
							>
								<span className="w-1/3">{item.item_name}</span>
								<span className="w-1/3 text-center">{item.quantity}</span>
								<span className="w-1/3 text-right">${item.price.toFixed(2)}</span>
							</div>
						))}
						<div className="border-t border-gray-600 mt-4 pt-4">
							<div className="flex justify-between">
								<span>Tax</span>
								<span>
									$
									{(
										parseFloat(calculateTotal(viewingOrder?.items || [])) * 0.1
									).toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between font-bold mt-2">
								<span>Total</span>
								<span>${calculateTotal(viewingOrder?.items || [])}</span>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => {
								if (viewingOrder) {
									setOrders(
										orders.filter((order) => order.order_id !== viewingOrder.order_id)
									);
									setViewingOrder(null);
								}
							}}
							className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-300 px-6 py-2 rounded-full"
						>
							Complete Order
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
