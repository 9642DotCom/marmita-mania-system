
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { useDatabase } from '@/hooks/useDatabase';
import CustomerForm from './CustomerForm';

interface CustomerData {
  name: string;
  whatsapp: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void; // Corrigido para string
  onRemoveItem: (id: string) => void; // Corrigido para string
  onClearCart: () => void;
  totalPrice: number;
}

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalPrice
}: CartProps) => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { createOrder, createOrderItems } = useDatabase();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione alguns itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }
    
    setShowCustomerForm(true);
  };

  const handleCustomerSubmit = async (customerData: CustomerData) => {
    try {
      console.log('Criando pedido com dados:', { customerData, cartItems, totalPrice });
      
      // Criar o pedido
      const orderData = {
        customer_name: customerData.name,
        customer_phone: customerData.whatsapp,
        customer_address: customerData.address,
        status: 'pendente' as const,
        total_amount: totalPrice,
        order_type: 'delivery' as const,
        notes: `Pedido de delivery para ${customerData.name}`
      };

      const order = await createOrder.mutateAsync(orderData);
      console.log('Pedido criado:', order);

      // Criar os itens do pedido
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        notes: `${item.name}`
      }));

      await createOrderItems.mutateAsync({
        orderId: order.id,
        items: orderItems
      });

      console.log('Itens do pedido criados:', orderItems);
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Olá ${customerData.name}! Seu pedido de R$ ${totalPrice.toFixed(2)} foi enviado para a cozinha. Tempo estimado: 30-45 minutos.`,
      });
      
      setShowCustomerForm(false);
      onClearCart();
      onClose();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: "Erro ao criar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-in">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Seu Carrinho</CardTitle>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col max-h-[60vh]">
            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Seu carrinho está vazio</p>
                <p className="text-sm">Adicione algumas marmitas deliciosas!</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 border-b pb-3">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-orange-600 font-bold">R$ {item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          
                          <Button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            onClick={() => onRemoveItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t bg-gray-50 p-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      size="lg"
                      disabled={createOrder.isPending}
                    >
                      {createOrder.isPending ? 'Processando...' : 'Finalizar Pedido'}
                    </Button>
                    
                    <Button
                      onClick={onClearCart}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <CustomerForm
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSubmit={handleCustomerSubmit}
        totalPrice={totalPrice}
      />
    </>
  );
};

export default Cart;
