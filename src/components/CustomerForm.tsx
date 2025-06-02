
import { useState } from 'react';
import { MapPin, User, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface CustomerData {
  name: string;
  whatsapp: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: CustomerData) => void;
  totalPrice: number;
}

const CustomerForm = ({ isOpen, onClose, onSubmit, totalPrice }: CustomerFormProps) => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    whatsapp: '',
    address: '',
    latitude: undefined,
    longitude: undefined
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setIsGettingLocation(false);
        toast({
          title: "Localização obtida!",
          description: "Sua localização foi capturada com sucesso."
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
          variant: "destructive"
        });
        console.error('Erro de geolocalização:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome.",
        variant: "destructive"
      });
      return;
    }

    if (!customerData.whatsapp.trim()) {
      toast({
        title: "WhatsApp obrigatório",
        description: "Por favor, informe seu número do WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    if (!customerData.address.trim()) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, informe seu endereço de entrega.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(customerData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados para Entrega
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={customerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium">
                WhatsApp *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={customerData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Endereço de entrega *
              </Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  placeholder="Rua, número, bairro, cidade, CEP"
                  value={customerData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Localização GPS</Label>
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="outline"
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {isGettingLocation ? 'Obtendo localização...' : 
                 customerData.latitude ? 'Localização capturada ✓' : 'Capturar localização'}
              </Button>
              {customerData.latitude && customerData.longitude && (
                <p className="text-xs text-gray-500">
                  Lat: {customerData.latitude.toFixed(6)}, Long: {customerData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total do Pedido:</span>
                <span className="text-orange-600">R$ {totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
