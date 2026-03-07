import React from 'react';
import { ArrowRight, BarChart3, CheckSquare, Layout, Shield, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <img src="/logo.png" alt="Supgest Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                        <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Supgest</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        A ferramenta definitiva para gestão da sua empresa
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
                        Transforme sua Gestão com o <span className="text-blue-600">Supgest</span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Centralize indicadores, planos de ação e acompanhe o progresso da sua empresa de maneira simples, visual e eficiente.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all transform hover:-translate-y-1"
                        >
                            Começar Gratuitamente
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-100 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Saiba Mais
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-10 rounded-full transform scale-110"></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-2">
                            <img
                                src="/dashboard-preview.png"
                                alt="Dashboard Preview"
                                className="w-full h-auto rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo o que você precisa</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            O Supgest fornece todas as ferramentas necessárias para você sair do operacional e focar na estratégia.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Target className="w-8 h-8 text-blue-600" />}
                            title="Metas Claras"
                            description="Defina objetivos mensuráveis e acompanhe os progressos."
                        />
                        <FeatureCard
                            icon={<Layout className="w-8 h-8 text-purple-600" />}
                            title="Planos de Ação"
                            description="Quebre grandes objetivos em tarefas que podem ser enviadas no seu WhatsApp."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-8 h-8 text-green-600" />}
                            title="Método de gestão"
                            description="O mesmo método utilizado pelas grandes empresas de maneira simples e eficiente."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Pronto para elevar o nível da sua gestão?</h2>
                    <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                        Junte-se a gestores que transformaram a maneira de acompanhar resultados.
                        Crie sua conta gratuita hoje mesmo.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                    >
                        Criar Conta Gratuita
                    </button>
                    <p className="mt-6 text-sm text-gray-500">
                        Não é necessário cartão de crédito • Plano gratuito disponível
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-1">
                        <img src="/logo.png" alt="Supgest Logo" className="w-10 h-10 object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <span className="text-gray-400 font-medium">Supgest © 2026</span>
                    </div>
                    <div className="flex gap-8 text-md text-green-500">
                        <a className="hover:text-gray-900 transition-colors">WhatsApp: (31) 97246-6747</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">
            {description}
        </p>
    </div>
);
