
import { useState } from 'react';
import Header from '@/components/Header';
import MarmitaCard from '@/components/MarmitaCard';
import Cart from '@/components/Cart';
import { useCart } from '@/hooks/useCart';
import { marmitas } from '@/data/marmitas';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', ...Array.from(new Set(marmitas.map(m => m.category)))];
  
  const filteredMarmitas = selectedCategory === 'Todas' 
    ? marmitas 
    : marmitas.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header 
        cartItemCount={getTotalItems()} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Marmitas Deliciosas
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fade-in">
            Sabor caseiro entregue na sua porta
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center animate-fade-in">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ingredientes Frescos</h3>
              <p className="text-orange-100">Selecionamos apenas os melhores ingredientes</p>
            </div>
            <div className="text-center animate-fade-in">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-orange-100">Receba sua marmita quentinha em até 45 minutos</p>
            </div>
            <div className="text-center animate-fade-in">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Feito com Amor</h3>
              <p className="text-orange-100">Cada marmita é preparada com carinho e tradição</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category 
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                : "hover:bg-orange-50"}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Marmitas Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMarmitas.map((marmita) => (
            <MarmitaCard
              key={marmita.id}
              marmita={marmita}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Marmita Mania</h3>
          <p className="text-gray-400 mb-4">Sabor caseiro na sua mesa, todos os dias!</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>📞 (11) 99999-9999</span>
            <span>📍 São Paulo, SP</span>
            <span>⏰ Segunda a Domingo: 10h às 22h</span>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        totalPrice={getTotalPrice()}
      />
    </div>
  );
};

export default Index;
