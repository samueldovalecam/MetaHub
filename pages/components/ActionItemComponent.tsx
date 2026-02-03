
import React, { useState } from 'react';
import { ActionItem, IndicatorUnit } from '../types';
import { Check, Calendar, Plus, Circle, Trash2, Save, X, Edit2, Hash, AlignLeft, User } from 'lucide-react';

interface ActionItemProps {
  action: ActionItem;
  unit: IndicatorUnit;
  onToggleAction: (id: string) => void;
  onEditAction: (id: string, title: string, responsible: string, contribution: number, deadline?: string, description?: string) => void;
  onAddSubTask: (actionId: string, title: string, responsible: string, deadline?: string) => void;
  onEditSubTask?: (actionId: string, subTaskId: string, title: string, responsible: string, deadline?: string) => void;
  onToggleSubTask: (actionId: string, subTaskId: string) => void;
  onDeleteAction: (id: string) => void;
  onDeleteSubTask: (actionId: string, subTaskId: string) => void;
}

export const ActionItemComponent: React.FC<ActionItemProps> = ({
  action,
  unit,
  onToggleAction,
  onEditAction,
  onAddSubTask,
  onEditSubTask,
  onToggleSubTask,
  onDeleteAction,
  onDeleteSubTask
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Add SubTask State
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [newSubTaskResponsible, setNewSubTaskResponsible] = useState('');
  const [newSubTaskDate, setNewSubTaskDate] = useState('');
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);

  // Edit SubTask State
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editSubTaskTitle, setEditSubTaskTitle] = useState('');
  const [editSubTaskResponsible, setEditSubTaskResponsible] = useState('');
  const [editSubTaskDate, setEditSubTaskDate] = useState('');

  // Edit Action State
  const [isEditingAction, setIsEditingAction] = useState(false);
  const [editActionTitle, setEditActionTitle] = useState(action.title);
  const [editActionDesc, setEditActionDesc] = useState(action.description || '');
  const [editActionResponsible, setEditActionResponsible] = useState(action.responsible || '');
  const [editActionDeadline, setEditActionDeadline] = useState(action.deadline || '');
  const [editActionContribution, setEditActionContribution] = useState(action.contribution.toString());

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskTitle.trim() && newSubTaskResponsible.trim()) {
      onAddSubTask(action.id, newSubTaskTitle, newSubTaskResponsible, newSubTaskDate || undefined);
      setNewSubTaskTitle('');
      setNewSubTaskResponsible('');
      setNewSubTaskDate('');
      setIsAddingSubTask(false);
      setIsExpanded(true);
    }
  };

  const startEditingSubTask = (subTask: { id: string, title: string, responsible: string, deadline?: string }) => {
    setEditingSubTaskId(subTask.id);
    setEditSubTaskTitle(subTask.title);
    setEditSubTaskResponsible(subTask.responsible);
    setEditSubTaskDate(subTask.deadline || '');
  };

  const handleSaveEditSubTask = () => {
    if (editingSubTaskId && editSubTaskTitle.trim() && editSubTaskResponsible.trim() && onEditSubTask) {
      onEditSubTask(action.id, editingSubTaskId, editSubTaskTitle, editSubTaskResponsible, editSubTaskDate || undefined);
      setEditingSubTaskId(null);
    }
  };

  const startEditingAction = () => {
    setIsEditingAction(true);
    setEditActionTitle(action.title);
    setEditActionDesc(action.description || '');
    setEditActionResponsible(action.responsible);
    setEditActionDeadline(action.deadline || '');
    setEditActionContribution(action.contribution.toString());
  };

  const handleSaveEditAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (editActionTitle.trim() && editActionResponsible.trim() && editActionContribution) {
      onEditAction(
        action.id,
        editActionTitle,
        editActionResponsible,
        Number(editActionContribution),
        editActionDeadline || undefined,
        editActionDesc || undefined
      );
      setIsEditingAction(false);
    }
  };

  const handleCancelEditAction = () => {
    setIsEditingAction(false);
    setEditActionTitle(action.title);
    setEditActionDesc(action.description || '');
    setEditActionDeadline(action.deadline || '');
    setEditActionContribution(action.contribution.toString());
  };

  const formatValue = (val: number) => {
    if (unit === 'currency') {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (unit === 'percent') {
      return `+ ${val}%`;
    }
    return `+ ${val}`;
  };

  // Check if deadline is passed
  const isDeadlinePassed = action.deadline
    ? new Date(action.deadline) < new Date(new Date().setHours(0, 0, 0, 0))
    : false;

  return (
    <div className="group relative bg-white hover:shadow-md transition-all duration-200 rounded-xl p-3 mb-2 border border-transparent hover:border-gray-100">
      {isEditingAction ? (
        /* Edit Form */
        <form onSubmit={handleSaveEditAction} className="space-y-3">
          <div>
            <input
              type="text"
              autoFocus
              required
              placeholder="Título da ação"
              className="w-full text-sm font-medium text-gray-800 border-b border-gray-300 pb-1 focus:border-blue-500 focus:outline-none"
              value={editActionTitle}
              onChange={(e) => setEditActionTitle(e.target.value)}
            />
          </div>

          <div className="relative">
            <AlignLeft className="w-3 h-3 absolute top-1 left-0 text-gray-400" />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              className="w-full text-xs text-gray-600 pl-5 focus:outline-none bg-transparent"
              value={editActionDesc}
              onChange={(e) => setEditActionDesc(e.target.value)}
            />
          </div>

          <div className="relative">
            <User className="w-3 h-3 absolute top-1 left-0 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Responsável"
              className="w-full text-xs text-gray-600 pl-5 focus:outline-none bg-transparent"
              value={editActionResponsible}
              onChange={(e) => setEditActionResponsible(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Hash className="w-3 h-3 absolute top-2 left-2 text-gray-400" />
              <input
                type="number"
                step="any"
                required
                placeholder="Valor"
                className="w-full text-xs bg-gray-50 rounded-md py-1.5 pl-6 pr-2 border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
                value={editActionContribution}
                onChange={(e) => setEditActionContribution(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="w-3 h-3 absolute top-2 left-2 text-gray-400" />
              <input
                type="date"
                required
                className="w-full text-xs bg-gray-50 rounded-md py-1.5 pl-6 pr-2 border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none text-gray-600"
                value={editActionDeadline}
                onChange={(e) => setEditActionDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelEditAction}
              className="text-xs text-gray-500 px-3 py-1 hover:bg-gray-100 rounded flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Cancelar
            </button>
            <button
              type="submit"
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Salvar
            </button>
          </div>
        </form>
      ) : (
        /* Normal Display */
        <div className="w-full">
          {/* Main Action Row */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleAction(action.id)}
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${action.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-400 hover:border-blue-600'
                }`}
            >
              {action.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0 relative group/text">
              <div className="flex items-start gap-3 w-full">
                <div className="flex flex-col flex-1 min-w-0 mr-2">
                  <div
                    className={`text-sm font-medium text-gray-800 cursor-pointer leading-tight line-clamp-3 ${action.completed ? 'line-through text-gray-400' : ''}`}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '100%',
                      textOverflow: 'ellipsis'
                    }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={action.title}
                  >
                    {action.title}
                  </div>
                  {/* Description shows on hover */}
                  {action.description && (
                    <div className="hidden group-hover:block text-xs text-gray-500 mt-1 animate-in fade-in duration-200">
                      {action.description}
                    </div>
                  )}

                  {/* Responsible - Between title and date */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600" title={action.responsible}>
                      {(action.responsible || '').length > 20 ? `${(action.responsible || '').substring(0, 20)}...` : (action.responsible || '')}
                    </span>
                  </div>

                  {/* Date Info - Moved here to sit directly below title */}
                  <div className="flex items-center gap-2 mt-2">
                    {action.deadline && !action.completed && (
                      <div className={`inline-flex items-center text-xs ${isDeadlinePassed ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        <Calendar className={`w-3 h-3 mr-1 ${isDeadlinePassed ? 'text-red-500' : 'text-gray-400'}`} />
                        Fim: {new Date(action.deadline + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </div>
                    )}
                    {action.completed && action.completedAt && (
                      <div className="text-xs text-gray-400">
                        Concluída em: {new Date(action.completedAt).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 pl-2">
                  {/* Contribution Badge */}
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100 whitespace-nowrap ${action.completed ? 'opacity-50' : ''}`}>
                    {formatValue(action.contribution)}
                  </div>

                  <div className="flex gap-1">
                    {/* Edit Action Button */}
                    <button
                      onClick={startEditingAction}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all"
                      title="Editar Ação"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Action Button */}
                    <button
                      onClick={() => onDeleteAction(action.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                      title="Excluir Ação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>



              {/* Subtasks Preview or List */}
              {action.subTasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  {action.subTasks.map(st => {
                    const isSubDeadlinePassed = st.deadline
                      ? new Date(st.deadline) < new Date(new Date().setHours(0, 0, 0, 0))
                      : false;

                    if (editingSubTaskId === st.id) {
                      return (
                        <div key={st.id} className="flex flex-col gap-2 bg-gray-50 p-2 rounded border border-blue-200">
                          <input
                            type="text"
                            autoFocus
                            required
                            placeholder="Título da tarefa"
                            className="text-xs w-full p-1 border rounded focus:border-blue-500 outline-none"
                            value={editSubTaskTitle}
                            onChange={(e) => setEditSubTaskTitle(e.target.value)}
                          />
                          <input
                            type="text"
                            required
                            placeholder="Responsável"
                            className="text-xs w-full p-1 border rounded focus:border-blue-500 outline-none"
                            value={editSubTaskResponsible}
                            onChange={(e) => setEditSubTaskResponsible(e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-gray-400 bg-white px-1 border rounded">
                              <input
                                type="date"
                                className="text-xs outline-none text-gray-600 p-0.5"
                                value={editSubTaskDate}
                                onChange={(e) => setEditSubTaskDate(e.target.value)}
                              />
                              {!editSubTaskDate && <span className="text-[10px] whitespace-nowrap">(opcional)</span>}
                            </div>
                            <div className="flex gap-1 ml-auto">
                              <button onClick={handleSaveEditSubTask} className="p-1 text-green-600 hover:bg-green-100 rounded"><Save className="w-3 h-3" /></button>
                              <button onClick={() => setEditingSubTaskId(null)} className="p-1 text-red-600 hover:bg-red-100 rounded"><X className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={st.id} className="group/sub flex items-center justify-between gap-2 pl-1 pr-1 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); onToggleSubTask(action.id, st.id); }}
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${st.completed ? 'bg-gray-400 border-gray-400' : 'border-gray-300 hover:border-blue-500'
                              }`}
                          >
                            {st.completed && <Check className="w-2.5 h-2.5 text-white" />}
                          </button>
                          <span
                            className={`text-xs truncate cursor-pointer hover:text-blue-600 ${st.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}
                            onClick={() => startEditingSubTask(st)}
                            title={st.title}
                          >
                            {st.title}
                          </span>
                          <span className="text-[10px] flex items-center text-gray-500">
                            <User className="w-2.5 h-2.5 mr-0.5" />
                            {(st.responsible || '').length > 15 ? `${(st.responsible || '').substring(0, 15)}...` : (st.responsible || '')}
                          </span>
                          {st.deadline && (
                            <span className={`text-[10px] flex items-center ${isSubDeadlinePassed ? 'text-red-500' : 'text-gray-400'}`}>
                              <Calendar className="w-2.5 h-2.5 mr-0.5" />
                              {new Date(st.deadline + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteSubTask(action.id, st.id)}
                          className="opacity-0 group-hover/sub:opacity-100 text-gray-300 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add Subtask Input */}
              {isAddingSubTask ? (
                <form onSubmit={handleAddSubTask} className="mt-2 pl-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Circle className="w-3 h-3 text-gray-300" />
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="Nova tarefa..."
                      className="flex-1 text-xs bg-gray-50 border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1"
                      value={newSubTaskTitle}
                      onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pl-5 mb-1">
                    <input
                      type="text"
                      required
                      placeholder="Responsável"
                      className="flex-1 text-xs bg-gray-50 border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1"
                      value={newSubTaskResponsible}
                      onChange={(e) => setNewSubTaskResponsible(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pl-5">
                    <div className="flex items-center gap-1 text-gray-400">
                      <input
                        type="date"
                        className="w-24 text-xs bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none text-gray-500"
                        value={newSubTaskDate}
                        onChange={(e) => setNewSubTaskDate(e.target.value)}
                      />
                      {!newSubTaskDate && <span className="text-[10px] whitespace-nowrap">(opcional)</span>}
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button type="button" onClick={() => setIsAddingSubTask(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
                      <button type="submit" className="text-xs text-blue-600 font-medium">Salvar</button>
                    </div>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingSubTask(true)}
                  className="mt-2 pl-1 flex items-center gap-2 text-xs text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-3 h-3" /> Adicionar tarefa
                </button>
              )}
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

