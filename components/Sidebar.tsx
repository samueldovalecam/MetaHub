
import React, { useState } from 'react';
import { Indicator, PlanType } from '../types';
import {
  ChevronDown,
  ChevronUp,
  CheckSquare,
  User,
  Plus
} from 'lucide-react';

interface SidebarProps {
  indicators: Indicator[];
  currentView: 'board' | 'account';
  onNavigate: (view: 'board' | 'account') => void;
  onOpenCreateModal: () => void; // Trigger to open modal instead of inline
  activeIndicatorId: string | null;
  onSelectIndicator: (id: string) => void;
  userPlan: PlanType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  indicators,
  currentView,
  onNavigate,
  onOpenCreateModal,
  activeIndicatorId,
  onSelectIndicator,
  userPlan
}) => {
  const [isListsExpanded, setIsListsExpanded] = useState(true);

  // Basic plan logic check
  const canAdd = userPlan === 'basic' || (userPlan === 'free' && indicators.length < 1);

  const handleAddClick = () => {
    onOpenCreateModal();
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-4 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-8 text-blue-600 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <CheckSquare className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xl font-semibold text-gray-700 tracking-tight">MetaHub</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">

        {/* Main Nav */}
        <div className="mb-4">
          <button
            onClick={() => setIsListsExpanded(!isListsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>Indicadores</span>
            {isListsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isListsExpanded && (
            <div className="mt-1 space-y-0.5">
              {indicators.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => {
                    onNavigate('board');
                    onSelectIndicator(ind.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-r-full mr-2 transition-colors text-left pl-6 ${currentView === 'board' && activeIndicatorId === ind.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <div className={`w-3 h-3 rounded bg-gray-300 ${currentView === 'board' && activeIndicatorId === ind.id ? 'bg-blue-500' : ''}`} />
                  <span className="truncate">{ind.title}</span>
                  <span className="ml-auto text-xs text-gray-400">{ind.actions.length || ''}</span>
                </button>
              ))}

              {/* Add New Indicator Button */}
              <button
                onClick={handleAddClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-r-full transition-colors text-left pl-6"
              >
                <Plus className="w-4 h-4" />
                <span>Criar novo indicador</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav (Account) */}
      <div className="p-2 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => onNavigate('account')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === 'account'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <User className="w-5 h-5" />
          <span>Minha conta</span>
        </button>

        <div className="mt-2 px-4 py-2">
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Plano Atual</div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold ${userPlan === 'basic' ? 'text-indigo-600' : 'text-gray-600'}`}>
              {userPlan === 'basic' ? 'Pro' : 'Grátis'}
            </span>
            {userPlan === 'free' && (
              <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">Max 1 ind.</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
