import { useState } from 'react';
import Header from '@/components/Header';
import MarmitaCard from '@/components/MarmitaCard';
import Cart from '@/components/Cart';
import { useCart } from '@/hooks/useCart';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/button';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';
import { Link } from 'react-router-dom';

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

  const { useProducts, useCategories, useCompanySettings } = useDatabase();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: settings, isLoading: isLoadingSettings } = useCompanySettings();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Criar lista de categorias incluindo "Todas"
  const categoryNames = ['Todas', ...categories.map(c => c.name)];
  
  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'Todas' 
    ? products 
    : products.filter(p => {
        const productCategory = categories.find(c => c.id === p.category_id);
        return productCategory?.name === selectedCategory;
      });

  // Usar configurações da empresa carregadas do banco de dados
  const restaurantName = settings?.restaurant_name || 'Carregando...';
  const restaurantSlogan = settings?.restaurant_slogan || 'Carregando...';
  const logoUrl = settings?.logo_url;
  const siteTitle = settings?.site_title || 'Carregando...';
  const siteDescription = settings?.site_description || 'Carregando...';
  const whatsappPhone = settings?.whatsapp_phone || 'Carregando...';
  const city = settings?.city || 'Carregando...';
  const state = settings?.state || '';
  const businessHours = settings?.business_hours || 'Carregando...';

  // Informações das seções carregadas dinamicamente
  const item1Title = settings?.item1_title || 'Carregando...';
  const item1Description = settings?.item1_description || 'Carregando...';
  const item2Title = settings?.item2_title || 'Carregando...';
  const item2Description = settings?.item2_description || 'Carregando...';
  const item3Title = settings?.item3_title || 'Carregando...';
  const item3Description = settings?.item3_description || 'Carregando...';

  const { profile, loading } = useRoleRedirect();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Se o usuário já está logado, mostrar painel baseado na role
  if (profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo(a), {profile.name}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Role: {profile.role} | Empresa: {profile.company_id}
          </p>
          
          <div className="space-y-4">
            {profile.role === 'admin' && (
              <Link to="/admin">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Acessar Painel Administrativo
                </Button>
              </Link>
            )}
            
            {profile.role === 'caixa' && (
              <Link to="/caixa">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Acessar Painel do Caixa
                </Button>
              </Link>
            )}
            
            {profile.role === 'garcon' && (
              <Link to="/garcon">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Acessar Painel do Garçom
                </Button>
              </Link>
            )}
            
            {profile.role === 'entregador' && (
              <Link to="/entregador">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Acessar Painel do Entregador
                </Button>
              </Link>
            )}
            
            {profile.role === 'cozinha' && (
              <Link to="/cozinha">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Acessar Painel da Cozinha
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Landing page para usuários não logados
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header 
        cartItemCount={getTotalItems()} 
        onCartClick={() => setIsCartOpen(true)}
        restaurantName={restaurantName}
        restaurantSlogan={restaurantSlogan}
        logoUrl={logoUrl}
      />
      
      {/* Hero Section - Totalmente dinâmico */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            {siteTitle}
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fade-in">
            {siteDescription}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center animate-fade-in">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{item1Title}</h3>
              <p className="text-orange-100">{item1Description}</p>
            </div>
            <div className="text-center animate-fade-in">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{item2Title}</h3>
              <p className="text-orange-100">{item2Description}</p>
            </div>
            <div className="text-center animate-fade-in">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{item3Title}</h3>
              <p className="text-orange-100">{item3Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categoryNames.map((category) => (
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

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              {selectedCategory === 'Todas' 
                ? 'Nenhum produto cadastrado ainda.' 
                : `Nenhum produto encontrado na categoria "${selectedCategory}".`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <MarmitaCard
                key={product.id}
                marmita={{
                  id: product.id,
                  name: product.name,
                  description: product.description || '',
                  price: Number(product.price),
                  image: product.image_url || '/placeholder.svg',
                  category: categories.find(c => c.id === product.category_id)?.name || 'Sem categoria',
                  ingredients: product.ingredients || []
                }}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer - Totalmente dinâmico */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">{restaurantName}</h3>
          <p className="text-gray-400 mb-4">{restaurantSlogan}</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>📞 {whatsappPhone}</span>
            <span>📍 {city}{state && `, ${state}`}</span>
            <span>⏰ {businessHours}</span>
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
