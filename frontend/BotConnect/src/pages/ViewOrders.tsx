import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye } from 'lucide-react'

type Order = {
  id: string;
  time: string;
  customerName: string;
  items: { name: string; price: number }[];
};

const initialOrders: Order[] = [
  { id: '123', time: '2023-06-10 14:30', customerName: 'Adam', items: [{ name: 'Cheese Burger', price: 15 }, { name: 'French Fries', price: 15 }] },
  { id: '124', time: '2023-06-10 15:00', customerName: 'Emma', items: [{ name: 'Veggie Pizza', price: 20 }, { name: 'Salad', price: 10 }] },
  { id: '125', time: '2023-06-10 15:30', customerName: 'John', items: [{ name: 'Chicken Wings', price: 18 }, { name: 'Soda', price: 5 }] },
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
    setOrders(orders.filter(order => !selectedOrders.has(order.id)));
    setSelectedOrders(new Set());
  };

  const calculateTotal = (items: { name: string; price: number }[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    return (subtotal + tax).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">View Orders</h1>
      
      <div className="rounded-xl overflow-hidden border border-gray-700">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800 border-b border-gray-700">
                <TableHead className="w-[50px] py-4"></TableHead>
                <TableHead className="py-4">Order Time</TableHead>
                <TableHead className="py-4">Order ID</TableHead>
                <TableHead className="py-4">Customer Name</TableHead>
                <TableHead className="text-right py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="transition-colors duration-300 hover:bg-gray-800 border-b border-gray-700 last:border-b-0"
                >
                  <TableCell className="py-4">
                    <Checkbox
                      checked={selectedOrders.has(order.id)}
                      onCheckedChange={() => toggleOrderSelection(order.id)}
                      className="border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </TableCell>
                  <TableCell className="py-4">{order.time}</TableCell>
                  <TableCell className="py-4">{order.id}</TableCell>
                  <TableCell className="py-4">{order.customerName}</TableCell>
                  <TableCell className="text-right py-4">
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

      <Dialog open={viewingOrder !== null} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="bg-gray-800 text-white rounded-xl border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Order #{viewingOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {viewingOrder?.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 mt-4 pt-4">
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(parseFloat(calculateTotal(viewingOrder?.items || [])) * 0.1).toFixed(2)}</span>
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
                  setOrders(orders.filter(order => order.id !== viewingOrder.id));
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