
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, QrCode, Users, Truck, ChefHat, BarChart3, Clock, TrendingUp, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const SalesPage = () => {
  const features = [
    {
      icon: <QrCode className="w-12 h-12 text-orange-600" />,
      title: "QR Code nas Mesas",
      description: "Clientes fazem pedidos direto pelo celular escaneando o QR Code da mesa"
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: "Painel do Garçom",
      description: "Garçons podem fazer pedidos rapidamente para os clientes"
    },
    {
      icon: <Truck className="w-12 h-12 text-blue-600" />,
      title: "Sistema de Delivery",
      description: "Gestão completa de entregas com controle de entregadores"
    },
    {
      icon: <ChefHat className="w-12 h-12 text-red-600" />,
      title: "Gestão da Cozinha",
      description: "Cozinheiros recebem pedidos organizados em tempo real"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-purple-600" />,
      title: "Dashboard Administrativo",
      description: "Relatórios completos, gestão de usuários e controle total"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Reduz Tempo de Atendimento",
      description: "Pedidos automáticos eliminam filas e esperas"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Aumenta as Vendas",
      description: "Cardápio digital com fotos aumenta pedidos em até 30%"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Fideliza Clientes",
      description: "Experiência moderna e conveniente gera satisfação"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Reduz Erros",
      description: "Pedidos digitais eliminam mal-entendidos"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      restaurant: "Pizzaria do Carlos",
      text: "Nossas vendas aumentaram 40% no primeiro mês. Os clientes adoram a praticidade!",
      rating: 5
    },
    {
      name: "Ana Costa",
      restaurant: "Restaurante Sabor & Arte",
      text: "A organização da cozinha melhorou 100%. Não perdemos mais nenhum pedido!",
      rating: 5
    },
    {
      name: "João Santos",
      restaurant: "Lanchonete Central",
      text: "O sistema de QR Code foi um sucesso. Menos filas, mais vendas!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">RestaurantePro</h1>
          <div className="space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="text-orange-600 bg-white hover:bg-gray-100">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-white text-orange-600 hover:bg-gray-100">
                Teste Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Revolucione Seu <span className="text-orange-600">Restaurante</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo de gestão que <strong>acelera pedidos</strong>, <strong>aumenta vendas</strong> e <strong>fideliza clientes</strong> com tecnologia QR Code
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4">
                🚀 Começar Teste Grátis
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              📺 Ver Demonstração
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">+40%</div>
              <div className="text-gray-600">Aumento nas Vendas</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">-60%</div>
              <div className="text-gray-600">Tempo de Atendimento</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h3>
            <p className="text-xl text-gray-600">Simples, rápido e eficiente</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h4 className="text-xl font-bold mb-4">📱 Cliente Escaneia QR Code</h4>
              <p className="text-gray-600">
                Imprima o QR Code e cole nas mesas. Clientes acessam o cardápio pelo celular em segundos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-bold mb-4">🍽️ Faz o Pedido</h4>
              <p className="text-gray-600">
                Cardápio digital com fotos, descrições e preços. Cliente escolhe e pede direto pelo celular.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-xl font-bold mb-4">👨‍🍳 Cozinha Recebe</h4>
              <p className="text-gray-600">
                Pedido chega automaticamente na cozinha organizado e pronto para preparar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Funcionalidades Completas</h3>
            <p className="text-xl text-gray-600">Tudo que seu restaurante precisa em um só lugar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Por Que Escolher Nosso Sistema?</h3>
            <p className="text-xl text-gray-600">Benefícios comprovados para seu negócio</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferentes Formas de Usar */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">3 Formas de Atender</h3>
            <p className="text-xl text-gray-600">Flexibilidade total para seu restaurante</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <QrCode className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-orange-600">QR Code na Mesa</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Cliente escaneia e pede</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Sem filas ou esperas</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Atendimento 24/7</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Reduz staff necessário</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-green-600">Atendimento Garçom</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Garçom faz pedido no tablet</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Mais rapidez no atendimento</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Elimina erros de comunicação</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Controle total dos pedidos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-blue-600">Delivery em Casa</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Pedidos online para entrega</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Gestão de entregadores</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Rastreamento em tempo real</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Amplia área de vendas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">O Que Nossos Clientes Dizem</h3>
            <p className="text-xl text-gray-600">Resultados reais de restaurantes que já usam</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.restaurant}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4">Pronto Para Revolucionar Seu Restaurante?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de restaurantes que já aumentaram suas vendas e melhoraram a experiência dos clientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4">
                🚀 Teste Grátis por 30 Dias
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4">
                📞 Falar com Consultor
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-bold">Sem Permanência</div>
              <div className="text-orange-100">Cancele quando quiser</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-bold">Implementação Rápida</div>
              <div className="text-orange-100">Funciona em 24 horas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-bold">Suporte Total</div>
              <div className="text-orange-100">Ajuda sempre que precisar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-2xl font-bold mb-4">RestaurantePro</h4>
          <p className="text-gray-400 mb-8">O futuro da gestão de restaurantes está aqui</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>📧 contato@restaurantepro.com</span>
            <span>📞 (11) 9999-9999</span>
            <span>📍 São Paulo, SP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;
