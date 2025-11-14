import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Order {
  id: string
  artistWallet: string
  serviceType: "beats" | "cover-art" | "mixing" | "video-editing"
  description: string
  priceMint: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  createdAt: string
}

interface OrdersState {
  orders: Order[]
  addOrder: (order: Order) => void
  getUserOrders: (walletAddress: string) => Order[]
  updateOrderStatus: (id: string, status: Order["status"]) => void
}

/**
 * Zustand store for marketplace orders
 */
export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      getUserOrders: (walletAddress) => get().orders.filter((o) => o.artistWallet === walletAddress),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    {
      name: "mintwave-orders",
    },
  ),
)
