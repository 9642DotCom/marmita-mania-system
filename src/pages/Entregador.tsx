
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const Entregador = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'entregador']}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel do Entregador</h1>
            <p className="text-gray-600">
              Bem-vindo(a), {profile?.name} - Gerencie suas entregas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Entregas Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-xs text-gray-500 mt-1">realizadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-xs text-gray-500 mt-1">para entrega</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Em Rota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">2</div>
                <p className="text-xs text-gray-500 mt-1">a caminho</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Faturamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">R$ 145</div>
                <p className="text-xs text-gray-500 mt-1">comissões hoje</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: '#001',
                      cliente: 'João Silva',
                      endereco: 'Rua das Flores, 123',
                      valor: 'R$ 45,50',
                      status: 'pronto',
                      tempo: '15 min'
                    },
                    {
                      id: '#002',
                      cliente: 'Maria Santos',
                      endereco: 'Av. Principal, 456',
                      valor: 'R$ 67,80',
                      status: 'saiu_entrega',
                      tempo: '8 min'
                    },
                    {
                      id: '#003',
                      cliente: 'Pedro Costa',
                      endereco: 'Rua do Centro, 789',
                      valor: 'R$ 32,90',
                      status: 'preparando',
                      tempo: '20 min'
                    }
                  ].map((entrega) => (
                    <div key={entrega.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{entrega.cliente}</h4>
                          <p className="text-sm text-gray-600">{entrega.endereco}</p>
                        </div>
                        <Badge variant={
                          entrega.status === 'pronto' ? 'default' :
                          entrega.status === 'saiu_entrega' ? 'secondary' :
                          'outline'
                        }>
                          {entrega.status === 'pronto' ? 'Pronto' :
                           entrega.status === 'saiu_entrega' ? 'Em rota' :
                           'Preparando'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600">{entrega.valor}</span>
                        <span className="text-xs text-gray-500">≈ {entrega.tempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mapa de Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-100 to-green-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Integração com mapa em desenvolvimento</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Visualização das rotas de entrega
                    </p>
                  </div>
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
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Confirmar Entrega</h3>
                      <p className="text-xs text-gray-500">Marcar como entregue</p>
                    </div>
                  </button>

                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Ver Rotas</h3>
                      <p className="text-xs text-gray-500">Otimizar trajeto</p>
                    </div>
                  </button>

                  <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Reportar Atraso</h3>
                      <p className="text-xs text-gray-500">Informar problema</p>
                    </div>
                  </button>

                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Relatório Diário</h3>
                      <p className="text-xs text-gray-500">Ver desempenho</p>
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

export default Entregador;
