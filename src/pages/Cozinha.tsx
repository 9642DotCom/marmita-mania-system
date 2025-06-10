
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const Cozinha = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'cozinha']}>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel da Cozinha</h1>
            <p className="text-gray-600">
              Bem-vindo(a), {profile?.name} - Gerencie o preparo dos pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pedidos na Fila</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">8</div>
                <p className="text-xs text-gray-500 mt-1">aguardando preparo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Em Preparo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">5</div>
                <p className="text-xs text-gray-500 mt-1">sendo preparados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Prontos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">3</div>
                <p className="text-xs text-gray-500 mt-1">para entrega</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Tempo Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">18min</div>
                <p className="text-xs text-gray-500 mt-1">preparo hoje</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fila de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: '#001',
                      mesa: '5',
                      items: ['2x Hambúrguer', '1x Batata Frita', '2x Refrigerante'],
                      tempo: '5 min',
                      status: 'pendente',
                      prioridade: 'alta'
                    },
                    {
                      id: '#002',
                      mesa: 'Entrega',
                      items: ['1x Pizza Margherita', '1x Suco Natural'],
                      tempo: '12 min',
                      status: 'preparando',
                      prioridade: 'normal'
                    },
                    {
                      id: '#003',
                      mesa: '2',
                      items: ['3x Prato Executivo', '1x Salada'],
                      tempo: '8 min',
                      status: 'pronto',
                      prioridade: 'normal'
                    }
                  ].map((pedido) => (
                    <div key={pedido.id} className={`p-4 rounded-lg border-l-4 ${
                      pedido.prioridade === 'alta' ? 'border-red-500 bg-red-50' : 
                      pedido.status === 'pronto' ? 'border-green-500 bg-green-50' :
                      pedido.status === 'preparando' ? 'border-blue-500 bg-blue-50' :
                      'border-gray-300 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">Pedido {pedido.id} - Mesa {pedido.mesa}</h4>
                          <p className="text-sm text-gray-600">Há {pedido.tempo}</p>
                        </div>
                        <Badge variant={
                          pedido.status === 'pronto' ? 'default' :
                          pedido.status === 'preparando' ? 'secondary' :
                          'outline'
                        }>
                          {pedido.status === 'pronto' ? 'Pronto' :
                           pedido.status === 'preparando' ? 'Preparando' :
                           'Pendente'}
                        </Badge>
                      </div>
                      <ul className="text-sm space-y-1">
                        {pedido.items.map((item, i) => (
                          <li key={i} className="text-gray-700">• {item}</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex gap-2">
                        {pedido.status === 'pendente' && (
                          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                            Iniciar Preparo
                          </button>
                        )}
                        {pedido.status === 'preparando' && (
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                            Marcar Pronto
                          </button>
                        )}
                        {pedido.status === 'pronto' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Aguardando Entrega
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estoque de Ingredientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { item: 'Carne (hambúrguer)', quantidade: 15, min: 5, status: 'ok' },
                    { item: 'Queijo Mussarela', quantidade: 8, min: 10, status: 'baixo' },
                    { item: 'Tomate', quantidade: 25, min: 5, status: 'ok' },
                    { item: 'Alface', quantidade: 3, min: 5, status: 'critico' },
                    { item: 'Batata', quantidade: 20, min: 8, status: 'ok' }
                  ].map((ingrediente, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{ingrediente.item}</span>
                        <p className="text-xs text-gray-500">Mín: {ingrediente.min} unidades</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-medium ${
                          ingrediente.status === 'critico' ? 'text-red-600' :
                          ingrediente.status === 'baixo' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {ingrediente.quantidade}
                        </span>
                        <Badge 
                          variant={
                            ingrediente.status === 'critico' ? 'destructive' :
                            ingrediente.status === 'baixo' ? 'secondary' :
                            'outline'
                          }
                          className="ml-2"
                        >
                          {ingrediente.status === 'critico' ? 'Crítico' :
                           ingrediente.status === 'baixo' ? 'Baixo' :
                           'OK'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Novo Pedido</h3>
                      <p className="text-xs text-gray-500">Adicionar à fila</p>
                    </div>
                  </button>

                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Finalizar Pedido</h3>
                      <p className="text-xs text-gray-500">Marcar como pronto</p>
                    </div>
                  </button>

                  <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Gerenciar Estoque</h3>
                      <p className="text-xs text-gray-500">Atualizar ingredientes</p>
                    </div>
                  </button>

                  <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.294 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Alertas</h3>
                      <p className="text-xs text-gray-500">Ver problemas</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Cozinha;
