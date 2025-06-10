
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const Garcon = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'garcon']}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel do Garçom</h1>
            <p className="text-gray-600">
              Bem-vindo(a), {profile?.name} - Gerencie atendimento e pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Mesas Ocupadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">8</div>
                <p className="text-xs text-gray-500 mt-1">de 12 mesas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pedidos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">5</div>
                <p className="text-xs text-gray-500 mt-1">em preparo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Prontos para Servir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">3</div>
                <p className="text-xs text-gray-500 mt-1">aguardando entrega</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Vendas Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">R$ 856</div>
                <p className="text-xs text-gray-500 mt-1">suas vendas</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status das Mesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 12 }, (_, i) => {
                    const isOccupied = i < 8;
                    const needsAttention = i === 2 || i === 5;
                    return (
                      <button
                        key={i + 1}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center font-medium transition-colors ${
                          needsAttention
                            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                            : isOccupied
                            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span>Livre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span>Ocupada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span>Precisa atenção</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { mesa: 3, status: 'preparando', tempo: '12 min', total: 'R$ 89,50' },
                    { mesa: 7, status: 'pronto', tempo: '2 min', total: 'R$ 156,00' },
                    { mesa: 1, status: 'entregue', tempo: '45 min', total: 'R$ 67,30' },
                    { mesa: 9, status: 'preparando', tempo: '8 min', total: 'R$ 123,80' },
                  ].map((pedido, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Mesa {pedido.mesa}</span>
                        <Badge variant={
                          pedido.status === 'pronto' ? 'default' :
                          pedido.status === 'preparando' ? 'secondary' : 
                          'outline'
                        }>
                          {pedido.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{pedido.total}</div>
                        <div className="text-xs text-gray-500">{pedido.tempo}</div>
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
                      <p className="text-xs text-gray-500">Anotar pedido</p>
                    </div>
                  </button>

                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Entregar Pedido</h3>
                      <p className="text-xs text-gray-500">Marcar como entregue</p>
                    </div>
                  </button>

                  <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Solicitar Ajuda</h3>
                      <p className="text-xs text-gray-500">Chamar cozinha</p>
                    </div>
                  </button>

                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Conta da Mesa</h3>
                      <p className="text-xs text-gray-500">Gerar conta</p>
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

export default Garcon;
