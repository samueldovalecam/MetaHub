
import React, { useState, useRef, useEffect } from 'react';
import { Indicator } from '../types';
import { ActionItemComponent } from './ActionItemComponent';
import { MoreVertical, PlusCircle, Calendar, Hash, AlertCircle, Trash2, Edit2, AlignLeft, User } from 'lucide-react';

interface IndicatorCardProps {
  indicator: Indicator;
  onAddAction: (indicatorId: string, title: string, responsible: string, contribution: number, deadline?: string, description?: string) => void;
  onEditAction: (indicatorId: string, actionId: string, title: string, responsible: string, contribution: number, deadline?: string, description?: string) => void;
  onToggleAction: (indicatorId: string, actionId: string) => void;
  onAddSubTask: (indicatorId: string, actionId: string, title: string, responsible: string, deadline?: string) => void;
  onEditSubTask: (indicatorId: string, actionId: string, subTaskId: string, title: string, responsible: string, deadline?: string) => void;
  onToggleSubTask: (indicatorId: string, actionId: string, subTaskId: string) => void;
  onDelete: (indicatorId: string) => void;
  onEdit: (indicatorId: string) => void;
  onDeleteAction: (indicatorId: string, actionId: string) => void;
  onDeleteSubTask: (indicatorId: string, actionId: string, subTaskId: string) => void;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  indicator,
  onAddAction,
  onEditAction,
  onToggleAction,
  onAddSubTask,
  onEditSubTask,
  onToggleSubTask,
  onDelete,
  onEdit,
  onDeleteAction,
  onDeleteSubTask
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');
  const [newActionResponsible, setNewActionResponsible] = useState('');
  const [contribution, setContribution] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActionTitle.trim() && newActionResponsible.trim() && contribution && deadline) {
      onAddAction(indicator.id, newActionTitle, newActionResponsible, Number(contribution), deadline, newActionDesc || undefined);
      setNewActionTitle('');
      setNewActionDesc('');
      setNewActionResponsible('');
      setContribution('');
      setDeadline('');
      setIsAdding(false);
    }
  };

  const formatValue = (val: number) => {
    if (indicator.unit === 'currency') {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    }
    if (indicator.unit === 'percent') {
      return `${val}%`;
    }
    return val.toString();
  };

  const diff = indicator.targetValue - indicator.currentValue;
  const hasActions = indicator.actions.length > 0;

  // Calculate total contribution from PENDING actions only
  const pendingContribution = indicator.actions
    .filter(a => !a.completed)
    .reduce((sum, action) => sum + action.contribution, 0);

  // Missing planned is the gap (diff) minus what we have planned (pending)
  // If diff is 5 and we have 3 pending, missing is 2.
  const missingPlanned = diff - pendingContribution;
  const isUnderPlanned = missingPlanned > 0;

  return (
    <div className="min-w-[360px] w-[360px] h-full flex flex-col bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 mx-2 overflow-hidden transition-all hover:shadow-md">
      {/* Header with Math */}
      <div className="p-5 pb-3 border-b border-gray-50 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 relative">
              <h3 className="text-lg font-bold text-gray-900 leading-tight truncate" title={indicator.title}>
                {indicator.title}
              </h3>
              {isUnderPlanned && (
                <div className="relative group cursor-help">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  {/* Updated tooltip position: top-full (below) and left-0 (aligned left) or customized to avoid clipping */}
                  <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-52 p-2.5 bg-gray-800 text-white text-xs rounded-lg z-50 shadow-lg border border-gray-700">
                    <div className="font-semibold mb-1 text-amber-300">Atenção</div>
                    Faltam planejar {formatValue(missingPlanned)} em ações para atingir a meta.
                    {/* Little triangle pointing up */}
                    <div className="absolute bottom-full left-2 border-4 border-transparent border-b-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
            {indicator.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={indicator.description}>
                {indicator.description}
              </p>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onEdit(indicator.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => {
                    onDelete(indicator.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs mt-3">
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="text-gray-500 mb-1">Atual</div>
            <div className="font-semibold text-gray-800 truncate" title={formatValue(indicator.currentValue)}>
              {formatValue(indicator.currentValue)}
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="text-gray-500 mb-1">Meta</div>
            <div className="font-semibold text-blue-700 truncate" title={formatValue(indicator.targetValue)}>
              {formatValue(indicator.targetValue)}
            </div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
            <div className="text-blue-600 mb-1">Falta</div>
            <div className="font-bold text-blue-800 truncate" title={formatValue(missingPlanned)}>
              {missingPlanned > 0 ? formatValue(missingPlanned) : '0'}
            </div>
          </div>
        </div>
      </div>

      {/* Add Action Button / Form */}
      <div className="px-4 py-3 bg-gray-50/30">
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-white p-3 rounded-xl shadow-sm border border-blue-200 animate-in zoom-in-95 duration-200">
            <div className="mb-2">
              <input
                type="text"
                autoFocus
                required
                placeholder="Qual a ação?"
                className="w-full text-sm font-medium text-gray-800 placeholder-gray-400 border-b border-gray-200 pb-1 focus:border-blue-500 focus:outline-none"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
              />
            </div>

            <div className="mb-3 relative">
              <AlignLeft className="w-3 h-3 absolute top-1 left-0 text-gray-400" />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                className="w-full text-xs text-gray-600 placeholder-gray-400 pl-5 focus:outline-none bg-transparent"
                value={newActionDesc}
                onChange={(e) => setNewActionDesc(e.target.value)}
              />
            </div>

            <div className="mb-3 relative">
              <User className="w-3 h-3 absolute top-1 left-0 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Responsável"
                className="w-full text-xs text-gray-600 placeholder-gray-400 pl-5 focus:outline-none bg-transparent"
                value={newActionResponsible}
                onChange={(e) => setNewActionResponsible(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Hash className="w-3 h-3 absolute top-2 left-2 text-gray-400" />
                <input
                  type="number"
                  step="any"
                  required
                  placeholder={indicator.unit === 'currency' ? 'R$ Valor' : 'Peso/Valor'}
                  className="w-full text-xs bg-gray-50 rounded-md py-1.5 pl-6 pr-2 border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <Calendar className="w-3 h-3 absolute top-2 left-2 text-gray-400" />
                <input
                  type="date"
                  required
                  className="w-full text-xs bg-gray-50 rounded-md py-1.5 pl-6 pr-2 border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none text-gray-600"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-gray-500 px-3 py-1 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
              >
                Adicionar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm px-3 py-2 rounded-lg transition-all w-full text-left font-medium text-sm border border-transparent hover:border-gray-100"
          >
            <PlusCircle className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
            <span className="text-blue-600">Adicionar ação</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar bg-gray-50/30">
        {hasActions ? (
          <div className="space-y-4 px-2">
            {/* Grouped Pending Actions */}
            {(() => {
              const pendingActions = indicator.actions.filter(a => !a.completed);

              // Helper to normalize date (remove time)
              const normalizeDate = (dateStr: string) => {
                const d = new Date(dateStr);
                return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
              };

              const today = new Date();
              const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
              const tomorrowTime = todayTime + 86400000;

              const groups: { [key: string]: typeof pendingActions } = {};

              pendingActions.forEach(action => {
                if (!action.deadline) {
                  const key = 'Sem data';
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(action);
                  return;
                }

                const actionTime = normalizeDate(action.deadline);
                let key = '';

                if (actionTime < todayTime) key = 'Atrasadas';
                else if (actionTime === todayTime) key = 'Hoje';
                else if (actionTime === tomorrowTime) key = 'Amanhã';
                else key = new Date(action.deadline).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

                if (!groups[key]) groups[key] = [];
                groups[key].push(action);
              });

              // Sort actions by date first, then group
              const sortedPending = [...pendingActions].sort((a, b) => {
                const tA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                const tB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                return tA - tB;
              });

              const finalGroups: { title: string, actions: typeof pendingActions }[] = [];

              sortedPending.forEach(action => {
                if (!action.deadline) return;

                const actionTime = normalizeDate(action.deadline);
                let title = '';

                if (actionTime < todayTime) title = 'Atrasadas';
                else if (actionTime === todayTime) title = 'Hoje';
                else if (actionTime === tomorrowTime) title = 'Amanhã';
                else title = new Date(action.deadline).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

                let lastGroup = finalGroups[finalGroups.length - 1];
                if (!lastGroup || lastGroup.title !== title) {
                  finalGroups.push({ title, actions: [] });
                  lastGroup = finalGroups[finalGroups.length - 1];
                }
                lastGroup.actions.push(action);
              });

              return finalGroups.map(group => (
                <div key={group.title}>
                  <h4 className={`text-xs font-semibold mb-2 ${group.title === 'Atrasadas' ? 'text-red-500' : 'text-gray-500'}`}>
                    {group.title}
                  </h4>
                  <div className="space-y-1">
                    {group.actions.map(action => (
                      <ActionItemComponent
                        key={action.id}
                        action={action}
                        unit={indicator.unit}
                        onToggleAction={(actId) => onToggleAction(indicator.id, actId)}
                        onEditAction={(actId, title, responsible, contribution, deadline, description) => onEditAction(indicator.id, actId, title, responsible, contribution, deadline, description)}
                        onAddSubTask={(actId, title, responsible, dl) => onAddSubTask(indicator.id, actId, title, responsible, dl)}
                        onEditSubTask={(actId, subId, title, responsible, dl) => onEditSubTask(indicator.id, actId, subId, title, responsible, dl)}
                        onToggleSubTask={(actId, subId) => onToggleSubTask(indicator.id, actId, subId)}
                        onDeleteAction={(actId) => onDeleteAction(indicator.id, actId)}
                        onDeleteSubTask={(actId, subId) => onDeleteSubTask(indicator.id, actId, subId)}
                      />
                    ))}
                  </div>
                </div>
              ));
            })()}

            {/* Completed Actions Section */}
            {(() => {
              const completedActions = indicator.actions.filter(a => a.completed);
              if (completedActions.length === 0) return null;

              return (
                <div className="mt-4">
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 py-2 w-full transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium">Concluída ({completedActions.length})</span>
                  </button>

                  {showCompleted && (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      {completedActions.map(action => (
                        <ActionItemComponent
                          key={action.id}
                          action={action}
                          unit={indicator.unit}
                          onToggleAction={(actId) => onToggleAction(indicator.id, actId)}
                          onEditAction={(actId, title, contribution, deadline, description) => onEditAction(indicator.id, actId, title, contribution, deadline, description)}
                          onAddSubTask={(actId, title, dl) => onAddSubTask(indicator.id, actId, title, dl)}
                          onEditSubTask={(actId, subId, title, dl) => onEditSubTask(indicator.id, actId, subId, title, dl)}
                          onToggleSubTask={(actId, subId) => onToggleSubTask(indicator.id, actId, subId)}
                          onDeleteAction={(actId) => onDeleteAction(indicator.id, actId)}
                          onDeleteSubTask={(actId, subId) => onDeleteSubTask(indicator.id, actId, subId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6 opacity-60 mt-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <PlusCircle className="w-6 h-6 text-gray-300" />
            </div>
            <h4 className="text-gray-900 font-medium text-sm mb-1">Planeje suas ações</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              O que você precisa fazer para cobrir o gap de {formatValue(diff)}?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
