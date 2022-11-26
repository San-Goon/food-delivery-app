export interface OrderReturnType {
  end: {
    latitude: number;
    longitude: number;
  };
  orderId: string;
  price: number;
  start: {
    latitude: number;
    longitude: number;
  };
}
