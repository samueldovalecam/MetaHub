
import { Indicator, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Usuário MetaHub',
  email: 'usuario@metahub.com',
  phone: '(11) 99999-9999',
  plan: 'free',
  whatsappNotifications: false,
};

// TODO: Substitua pelo LINK DE PAGAMENTO gerado no painel do Stripe
// Product Name: Plano Pro (Recorrente)
// Price ID: Utilizando Link Gerado Manualmente
export const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/00wcN5fiS4L62Lg0dI4wM00';

export const INITIAL_INDICATORS: Indicator[] = [
  {
    id: '1',
    title: 'Faturamento Mensal',
    unit: 'currency',
    initialValue: 100000,
    currentValue: 100000,
    targetValue: 150000,
    actions: [
      {
        id: 'a1',
        title: 'Fechar contrato Enterprise',
        completed: false,
        contribution: 30000,
        deadline: '2024-12-15',
        responsible: 'Usuário',
        subTasks: [],
      },
      {
        id: 'a2',
        title: 'Upsell na base atual',
        completed: false,
        contribution: 20000,
        deadline: '2024-12-20',
        responsible: 'Usuário',
        subTasks: [],
      }
    ],
  },
];
