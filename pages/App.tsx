
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { IndicatorCard } from '../components/IndicatorCard';
import { AccountSettings } from '../components/AccountSettings';
import { IndicatorModal, UpgradeModal } from '../components/Modals';
import { Login } from '../components/Login';
// import { INITIAL_INDICATORS, INITIAL_USER } from './constants'; // Removed initial data import
import { INITIAL_USER, STRIPE_CHECKOUT_URL } from './constants';
import { Indicator, PlanType, UserProfile, IndicatorUnit } from './types';
import { Menu } from 'lucide-react';
import { supabase } from './lib/supabaseClient'; // Import supabase client

import { useAuth } from './context/AuthContext';

const App = () => {
  const { session, loading, signOut } = useAuth();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currentView, setCurrentView] = useState<'board' | 'account'>('board');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeIndicatorId, setActiveIndicatorId] = useState<string | null>(null);

  // Modals State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);

  // Fetch data from Supabase
  const fetchIndicators = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('indicators')
        .select(`
          *,
          actions (
            *,
            subTasks:sub_tasks (*)
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching indicators:', error);
        return;
      }

      // Transform data to match local Types
      const mappedIndicators: Indicator[] = (data || []).map((ind: any) => ({
        id: ind.id,
        title: ind.title,
        description: ind.description,
        unit: ind.unit,
        initialValue: Number(ind.initial_value),
        targetValue: Number(ind.target_value),
        currentValue: 0, // Will be calculated below
        actions: (ind.actions || []).map((act: any) => ({
          id: act.id,
          title: act.title,
          description: act.description,
          responsible: act.responsible,
          contribution: Number(act.contribution),
          deadline: act.deadline,
          completed: act.completed,
          completedAt: act.completed_at,
          subTasks: (act.subTasks || []).map((st: any) => ({
            id: st.id,
            title: st.title,
            responsible: st.responsible,
            deadline: st.deadline,
            completed: st.completed
          }))
        }))
      }));

      // Calculate current values
      const indicatorsWithCalculatedValues = mappedIndicators.map(ind => {
        const completedSum = ind.actions
          .filter(a => a.completed)
          .reduce((sum, a) => sum + a.contribution, 0);
        return {
          ...ind,
          currentValue: ind.initialValue + completedSum
        };
      });

      setIndicators(indicatorsWithCalculatedValues);

      // Set active indicator if none selected or invalid
      if (!activeIndicatorId || !indicatorsWithCalculatedValues.find(i => i.id === activeIndicatorId)) {
        if (indicatorsWithCalculatedValues.length > 0) {
          setActiveIndicatorId(indicatorsWithCalculatedValues[0].id);
        }
      }

    } catch (error) {
      console.error('Unexpected error fetching indicators:', error);
    }
  };

  // Fetch user profile
  const fetchProfile = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setUser(prev => ({
        ...prev,
        name: data.full_name || prev.name,
        phone: data.phone || prev.phone,
        plan: data.plan as PlanType,
        whatsappNotifications: data.whatsapp_notifications
      }));
    }
  };

  useEffect(() => {
    if (session?.user) {
      setUser(prev => ({
        ...prev,
        email: session.user.email || prev.email,
      }));
      setCurrentView('board'); // Force redirect to board on login
      fetchIndicators();
      fetchProfile();
    }
  }, [session]);

  // Check for Stripe success return
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true' && session?.user) {
      // Update local state
      setUser(prev => ({ ...prev, plan: 'basic' }));

      // Persist to Supabase
      supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        plan: 'basic',
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.error('Error saving profile:', error);
      });

      alert('Parabéns! Seu Plano Pro foi ativado com sucesso e salvo em sua conta.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [session]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#f8fafc]">Carregando...</div>;
  }

  // Login Handler
  if (!session) {
    return <Login />;
  }

  const handleOpenCreateModal = () => {
    if (user.plan === 'free' && indicators.length >= 2) {
      setShowUpgradeModal(true);
    } else {
      setEditingIndicator(null);
      setShowIndicatorModal(true);
    }
  };

  const handleSaveIndicator = async (data: { title: string; description?: string; unit: IndicatorUnit; currentValue: number; targetValue: number }) => {
    if (!session?.user) return;

    if (editingIndicator) {
      // Edit existing
      // Calculate initial_value from new currentValue
      // initial = current - completed_actions_contribution
      const completedSum = editingIndicator.actions
        .filter(a => a.completed)
        .reduce((sum, a) => sum + a.contribution, 0);

      const newInitialValue = data.currentValue - completedSum;

      const { error } = await supabase
        .from('indicators')
        .update({
          title: data.title,
          description: data.description,
          unit: data.unit,
          initial_value: newInitialValue,
          target_value: data.targetValue
        })
        .eq('id', editingIndicator.id);

      if (error) {
        console.error('Error updating indicator:', error);
        alert('Erro ao atualizar indicador');
      } else {
        fetchIndicators();
        setShowIndicatorModal(false);
        setEditingIndicator(null);
      }

    } else {
      // Create new
      const { error } = await supabase
        .from('indicators')
        .insert({
          user_id: session.user.id,
          title: data.title,
          description: data.description,
          unit: data.unit,
          initial_value: data.currentValue, // For new, initial = current
          target_value: data.targetValue
        });

      if (error) {
        console.error('Error creating indicator:', error);
        alert('Erro ao criar indicador');
      } else {
        fetchIndicators();
        setShowIndicatorModal(false);
      }
    }
  };

  const handleDeleteIndicator = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este indicador?')) {
      const { error } = await supabase.from('indicators').delete().eq('id', id);
      if (error) {
        console.error('Error deleting indicator:', error);
        alert('Erro ao excluir indicador');
      } else {
        const newIndicators = indicators.filter(i => i.id !== id);
        setIndicators(newIndicators);
        if (activeIndicatorId === id) {
          setActiveIndicatorId(newIndicators[0]?.id || null);
        }
      }
    }
  };

  const handleEditIndicator = (id: string) => {
    const indicator = indicators.find(i => i.id === id);
    if (indicator) {
      setEditingIndicator(indicator);
      setShowIndicatorModal(true);
    }
  };

  const handleAddAction = async (indicatorId: string, title: string, responsible: string, contribution: number, deadline?: string, description?: string) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('actions')
      .insert({
        indicator_id: indicatorId,
        user_id: session.user.id,
        title,
        description,
        responsible,
        contribution,
        deadline,
        completed: false
      });

    if (error) {
      console.error('Error adding action:', error);
      alert('Erro ao adicionar ação');
    } else {
      fetchIndicators();
    }
  };

  const handleEditAction = async (indicatorId: string, actionId: string, title: string, responsible: string, contribution: number, deadline?: string, description?: string) => {
    const { error } = await supabase
      .from('actions')
      .update({
        title,
        description,
        responsible,
        contribution,
        deadline
      })
      .eq('id', actionId);

    if (error) {
      console.error('Error updating action:', error);
      alert('Erro ao atualizar ação');
    } else {
      fetchIndicators();
    }
  };

  const handleDeleteAction = async (indicatorId: string, actionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ação?')) {
      const { error } = await supabase.from('actions').delete().eq('id', actionId);
      if (error) {
        console.error('Error deleting action:', error);
        alert('Erro ao excluir ação');
      } else {
        fetchIndicators();
      }
    }
  };

  const handleToggleAction = async (indicatorId: string, actionId: string) => {
    const indicator = indicators.find(i => i.id === indicatorId);
    const action = indicator?.actions.find(a => a.id === actionId);

    if (action) {
      const newCompleted = !action.completed;
      const newCompletedAt = newCompleted ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('actions')
        .update({
          completed: newCompleted,
          completed_at: newCompletedAt
        })
        .eq('id', actionId);

      if (error) {
        console.error('Error toggling action:', error);
      } else {
        fetchIndicators();
      }
    }
  };

  const handleAddSubTask = async (indicatorId: string, actionId: string, title: string, responsible: string, deadline?: string) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('sub_tasks')
      .insert({
        action_id: actionId,
        user_id: session.user.id,
        title,
        responsible,
        deadline,
        completed: false
      });

    if (error) {
      console.error('Error adding subtask:', error);
      alert('Erro ao adicionar sub-tarefa');
    } else {
      fetchIndicators();
    }
  };

  const handleEditSubTask = async (indicatorId: string, actionId: string, subTaskId: string, title: string, responsible: string, deadline?: string) => {
    const { error } = await supabase
      .from('sub_tasks')
      .update({
        title,
        responsible,
        deadline
      })
      .eq('id', subTaskId);

    if (error) {
      console.error('Error updating subtask:', error);
      alert('Erro ao editar sub-tarefa');
    } else {
      fetchIndicators();
    }
  };

  const handleDeleteSubTask = async (indicatorId: string, actionId: string, subTaskId: string) => {
    const { error } = await supabase.from('sub_tasks').delete().eq('id', subTaskId);
    if (error) {
      console.error('Error deleting subtask:', error);
      alert('Erro ao excluir sub-tarefa');
    } else {
      fetchIndicators();
    }
  };

  const handleToggleSubTask = async (indicatorId: string, actionId: string, subTaskId: string) => {
    const indicator = indicators.find(i => i.id === indicatorId);
    const action = indicator?.actions.find(a => a.id === actionId);
    const subTask = action?.subTasks.find(s => s.id === subTaskId);

    if (subTask) {
      const { error } = await supabase
        .from('sub_tasks')
        .update({
          completed: !subTask.completed
        })
        .eq('id', subTaskId);

      if (error) {
        console.error('Error toggling subtask:', error);
      } else {
        fetchIndicators();
      }
    }
  };

  const handleUpdatePlan = (plan: PlanType) => {
    if (STRIPE_CHECKOUT_URL.includes('BLOCKER')) {
      alert('O link de pagamento ainda não foi configurado pelo administrador.');
      return;
    }

    // Append client_reference_id and prefilled_email for robust webhook matching
    const separator = STRIPE_CHECKOUT_URL.includes('?') ? '&' : '?';
    const finalUrl = `${STRIPE_CHECKOUT_URL}${separator}client_reference_id=${user.id || session?.user?.id}&prefilled_email=${encodeURIComponent(user.email)}`;

    window.location.href = finalUrl;
  };

  const handleToggleNotifications = () => {
    if (user.plan === 'free') {
      setShowUpgradeModal(true);
      return;
    }
    setUser(prev => ({ ...prev, whatsappNotifications: !prev.whatsappNotifications }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">

      {/* Modals */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => handleUpdatePlan('basic')}
      />
      <IndicatorModal
        isOpen={showIndicatorModal}
        onClose={() => {
          setShowIndicatorModal(false);
          setEditingIndicator(null);
        }}
        onSave={handleSaveIndicator}
        initialData={editingIndicator}
      />

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="hidden md:block h-full shadow-xl z-10">
          <Sidebar
            indicators={indicators}
            currentView={currentView}
            onNavigate={setCurrentView}
            onOpenCreateModal={handleOpenCreateModal}
            activeIndicatorId={activeIndicatorId}
            onSelectIndicator={(id) => setActiveIndicatorId(id)}
            userPlan={user.plan}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Bar */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium text-gray-700">
              {currentView === 'account' ? 'Minha Conta' : 'Indicadores'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* User avatar removed */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {currentView === 'board' ? (
            <div className="h-full w-full overflow-x-auto overflow-y-hidden p-6">
              <div className="inline-flex h-full pb-4">
                {indicators.map(indicator => (
                  <IndicatorCard
                    key={indicator.id}
                    indicator={indicator}
                    onAddAction={handleAddAction}
                    onEditAction={handleEditAction}
                    onToggleAction={handleToggleAction}
                    onAddSubTask={handleAddSubTask}
                    onEditSubTask={handleEditSubTask}
                    onToggleSubTask={handleToggleSubTask}
                    onDelete={handleDeleteIndicator}
                    onEdit={handleEditIndicator}
                    onDeleteAction={handleDeleteAction}
                    onDeleteSubTask={handleDeleteSubTask}
                  />
                ))}

                {/* Ghost Button for Add */}
                <div className="min-w-[340px] w-[340px] h-12 mx-2 flex items-center justify-center">
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-50"
                  >
                    <span className="text-2xl font-light">+</span>
                    <span className="font-medium">Novo Indicador</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto custom-scrollbar bg-[#f8fafc]">
              <AccountSettings
                user={user}
                onUpdatePlan={handleUpdatePlan}
                onToggleNotifications={handleToggleNotifications}
                indicatorCount={indicators.length}
              />
              <div className="p-6">
                <button onClick={signOut} className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
