
import { X, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-orange-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle>Detalhes do Pedido #{order.id}</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-gray-600">Cliente</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{order.whatsapp}</div>
                <div className="text-sm text-gray-600">WhatsApp</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <div className="font-medium">{order.address}</div>
                <div className="text-sm text-gray-600">Endereço de entrega</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Itens do Pedido</h4>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">Qtd: {item.quantity}</div>
                  </div>
                  <div className="font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-orange-600">R$ {order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-600">
              <div>Pedido realizado em: {order.createdAt}</div>
              <div className="mt-1">Status atual: <span className="font-medium">{order.status}</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsModal;
