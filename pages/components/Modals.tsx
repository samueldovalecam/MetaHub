
import React, { useState, useEffect } from 'react';
import { IndicatorUnit } from '../types';
import { X, CheckCircle2, Lock, TrendingUp } from 'lucide-react';

// --- UPGRADE MODAL ---
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">Desbloqueie o Poder Total</h3>
          <p className="text-blue-100 text-sm mt-1">Seu plano atual permite apenas 2 indicadores.</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Plano Pro - R$ 20/mês</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Indicadores ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Notificações via WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Gestão completa de metas</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onUpgrade}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all"
          >
            Atualizar para Pro
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};

// --- INDICATOR MODAL (CREATE/EDIT) ---
interface IndicatorData {
  title: string;
  description?: string;
  unit: IndicatorUnit;
  currentValue: number;
  targetValue: number;
}

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IndicatorData) => void;
  initialData?: IndicatorData | null;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState<IndicatorUnit>('currency');
  const [currentValue, setCurrentValue] = useState('');
  const [targetValue, setTargetValue] = useState('');

  // Load initial data when opening for edit
  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setUnit(initialData.unit);
      setCurrentValue(initialData.currentValue.toString());
      setTargetValue(initialData.targetValue.toString());
    } else if (isOpen && !initialData) {
      // Reset for create mode
      setTitle('');
      setDescription('');
      setUnit('currency');
      setCurrentValue('');
      setTargetValue('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && currentValue && targetValue) {
      onSave({
        title,
        description,
        unit,
        currentValue: Number(currentValue),
        targetValue: Number(targetValue)
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {initialData ? 'Editar Indicador' : 'Novo Indicador'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Indicador</label>
            <input
              required
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Faturamento Mensal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Breve detalhe sobre este indicador"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Medição</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUnit('currency')}
                className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${unit === 'currency' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Moeda (R$)
              </button>
              <button
                type="button"
                onClick={() => setUnit('percent')}
                className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${unit === 'percent' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Percentual (%)
              </button>
              <button
                type="button"
                onClick={() => setUnit('number')}
                className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${unit === 'number' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Número
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Atual</label>
              <input
                required
                type="number"
                step="any"
                value={currentValue}
                onChange={e => setCurrentValue(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Alvo</label>
              <input
                required
                type="number"
                step="any"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {currentValue && targetValue && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Gap (Diferença):</span>
                <span className="font-semibold text-gray-900">
                  {Number(Number(targetValue) - Number(currentValue)).toLocaleString('pt-BR', {
                    style: unit === 'currency' ? 'currency' : 'decimal',
                    currency: 'BRL',
                    maximumFractionDigits: 2
                  })}
                  {unit === 'percent' ? '%' : ''}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {initialData ? 'Salvar Alterações' : 'Criar Indicador'}
          </button>
        </form>
      </div>
    </div>
  );
};
