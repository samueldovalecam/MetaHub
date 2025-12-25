
import React from 'react';
import { UserProfile, PlanType } from '../types';
import { CheckCircle2, XCircle, Zap, Lock } from 'lucide-react';

interface AccountSettingsProps {
  user: UserProfile;
  onUpdatePlan: (plan: PlanType) => void;
  onToggleNotifications: () => void;
  indicatorCount: number;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdatePlan, onToggleNotifications, indicatorCount }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Minha Conta</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Dados Cadastrais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">WhatsApp / Telefone</label>
            <input
              type="text"
              value={user.phone || 'Não informado'}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-700 mb-4">Notificações</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Receber resumo semanal</h4>
              <p className="text-sm text-gray-500">Pendências e Atrasos (via WhatsApp)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.plan === 'free' && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" /> Pro
              </span>
            )}
            <button
              onClick={onToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${user.whatsappNotifications ? 'bg-green-500' : 'bg-gray-200'
                } ${user.plan === 'free' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.whatsappNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-700 mb-4">Planos e Assinaturas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div
          onClick={() => onUpdatePlan('free')}
          className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${user.plan === 'free'
            ? 'border-blue-500 bg-blue-50/30'
            : 'border-gray-200 bg-white hover:border-blue-200'
            }`}
        >
          {user.plan === 'free' && (
            <div className="absolute top-4 right-4 text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <div className="mb-4">
            <h4 className="text-xl font-bold text-gray-800">Plano Grátis</h4>
            <p className="text-gray-500 text-sm mt-1">Para quem está começando</p>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-6">R$ 0<span className="text-sm font-normal text-gray-500">/mês</span></div>

          <ul className="space-y-3">
            <li className="flex items-start text-sm text-gray-600">
              <div className="mr-3 mt-0.5 text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
              <span>Criar até <strong>2 indicadores</strong></span>
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <div className="mr-3 mt-0.5 text-blue-500"><CheckCircle2 className="w-4 h-4" /></div>
              <span>Salvar planos válidos normalmente</span>
            </li>
            <li className="flex items-start text-sm text-gray-400">
              <div className="mr-3 mt-0.5 text-red-400"><XCircle className="w-4 h-4" /></div>
              <span>Sem notificações via WhatsApp</span>
            </li>
          </ul>

          <button className={`mt-8 w-full py-2 rounded-lg font-medium transition-colors ${user.plan === 'free'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {user.plan === 'free' ? 'Plano Atual' : 'Selecionar Grátis'}
          </button>

          {user.plan === 'free' && indicatorCount > 2 && (
            <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-100">
              Atenção: Você tem {indicatorCount} indicadores ativos. O limite deste plano é 2.
            </div>
          )}
        </div>

        {/* Basic Plan */}
        <div
          onClick={() => onUpdatePlan('basic')}
          className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${user.plan === 'basic'
            ? 'border-blue-500 bg-blue-50/30'
            : 'border-gray-200 bg-white hover:border-blue-200'
            }`}
        >
          {user.plan === 'basic' && (
            <div className="absolute top-4 right-4 text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full flex items-center shadow-sm">
            <Zap className="w-3 h-3 mr-1" fill="currentColor" /> RECOMENDADO
          </div>

          <div className="mb-4 mt-2">
            <h4 className="text-xl font-bold text-gray-800">Plano Pro</h4>
            <p className="text-gray-500 text-sm mt-1">Para expandir seus controles</p>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-6">R$ 20<span className="text-sm font-normal text-gray-500">/mês</span></div>

          <ul className="space-y-3">
            <li className="flex items-start text-sm text-gray-600">
              <div className="mr-3 mt-0.5 text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
              <span>Criar <strong>2+ indicadores</strong></span>
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <div className="mr-3 mt-0.5 text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
              <span>Notificações via WhatsApp (ações pendentes)</span>
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <div className="mr-3 mt-0.5 text-blue-500"><CheckCircle2 className="w-4 h-4" /></div>
              <span>Todas as funcionalidades do Grátis</span>
            </li>
          </ul>

          <button className={`mt-8 w-full py-2 rounded-lg font-medium transition-colors ${user.plan === 'basic'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
            : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}>
            {user.plan === 'basic' ? 'Plano Atual' : 'Assinar Pro'}
          </button>
        </div>
      </div>
    </div>
  );
};
