// LandingPageBSC.tsx
import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "258XXXXXXXXX";

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type Status = {
  loading: boolean;
  success: string | null;
  error: string | null;
};

type CardDetail = {
  title: string;
  desc: string;
  extra?: string;
};

export default function LandingPageBSC() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "Consultoria Empresarial",
    message: "",
  });
  const [status, setStatus] = useState<Status>({
    loading: false,
    success: null,
    error: null,
  });
  const [darkMode, setDarkMode] = useState(false);

  const [selectedCardDetail, setSelectedCardDetail] = useState<CardDetail | null>(null);
  const [selectedCardForm, setSelectedCardForm] = useState(false);

  const services: CardDetail[] = [
    { title: "Consultoria Estratégica", desc: "Planos práticos para crescimento, otimização e execução." },
    { title: "Legalização de Empresas", desc: "Acompanhamento completo para registro, licenças e cumprimento legal." },
    { title: "Gestão Financeira", desc: "Fluxo de caixa, controle de custos e acesso a crédito." },
    { title: "Formação e Capacitação", desc: "Cursos práticos em HST, gestão interna e liderança." },
    { title: "Planos de Negócio e CVs", desc: "Elaboração de planos que convencem investidores e CVs que destacam talentos." },
    { title: "Intermediação de Crédito", desc: "Conexão com instituições financeiras para financiamento." },
  ];

  const cases: CardDetail[] = [
    { title: "Startup X", desc: "Ajudámos a estruturar o plano de negócio e captar investimento inicial." },
    { title: "Cooperativa Y", desc: "Implantação de gestão financeira e formação técnica para 30 colaboradores." },
    { title: "ONG Z", desc: "Legalização e parceria para projetos de impacto local." },
  ];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nome é obrigatório.";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      errs.email = "Email inválido.";
    if (!form.phone.trim()) errs.phone = "Telefone/WhatsApp é necessário.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ loading: false, success: null, error: null });
    const errs = validate();
    if (Object.keys(errs).length)
      return setStatus({
        loading: false,
        success: null,
        error: Object.values(errs).join(" "),
      });

    setStatus({ loading: true, success: null, error: null });
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        message: form.message,
        source: "landing_bsc",
        status: "new",
      });

      if (error) throw error;

      setStatus({ loading: false, success: "Obrigado! Seu pedido foi enviado.", error: null });
      setForm({ name: "", email: "", phone: "", service: "Consultoria Empresarial", message: "" });
      setSelectedCardForm(false);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: null, error: "Não foi possível enviar. Experimente contactar via WhatsApp." });
    }
  }

  const whatsappText = encodeURIComponent(
    `Olá BSC! Quero informações sobre: ${form.service} — Nome: ${form.name || "_"}`
  );
  const whatsappLink = `https://wa.me/<258873041010>${WHATSAPP_NUMBER}?text=${whatsappText}`;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans transition-colors duration-500">

        {/* NAV */}
        <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm sticky top-0 z-30 shadow-md transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-lg">B</div>
              <div>
                <div className="text-sm font-semibold">BSC</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Consultoria • Legalização • Formação</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#services" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Serviços</a>
              <a href="#cases" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Casos</a>
              <a href="#contact" className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition-opacity">Fale Conosco</a>
            </nav>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl shadow hover:opacity-90 transition-opacity"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-16">

          {/* HERO */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700">
                Transformamos<br>ideias</br> em negócios sustentáveis e de impacto — com olhar humano.
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                A BSC apoia PMEs, startups, empreendedores, funcionários públicos e organizações com consultoria estratégica, legalização, gestão financeira e formação prática.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="relative p-0">
                  {/* Luz animada */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 animate-slide-light blur-xl opacity-50"></div>
                  <a
                    href="#contact"
                    className="relative px-6 py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-medium shadow hover:opacity-90 transition-opacity"
                  >
                    Quero ser contactado
                  </a>
                </div>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="px-6 py-3 border border-orange-500 rounded-2xl font-medium hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">Falar no WhatsApp</a>
              </div>
            </div>

            {/* FORM */}
            <div className="md:col-span-5 bg-gradient-to-br from-white dark:from-gray-800 to-gray-100 dark:to-gray-900 p-8 md:p-10 rounded-3xl shadow-2xl transition-colors duration-500">
              <h3 className="text-lg font-semibold">Solicite uma avaliação gratuita</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Preencha os dados e um consultor entrará em contacto.</p>
              <form id="contact" onSubmit={handleSubmit} className="mt-4 space-y-4">
                {["name","email","phone"].map(field => (
                  <div key={field}>
                    <label className="text-xs font-medium capitalize">{field === "phone" ? "Telefone / WhatsApp" : field}</label>
                    <input
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={form[field as keyof FormData]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300"
                      placeholder={field === "name" ? "Seu nome" : field === "email" ? "seu@exemplo.com" : "+258 8XX XXX XXX"}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium">Serviço de Interesse</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 transition-colors duration-300"
                  >
                    {services.map(s => <option key={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium">Mensagem (opcional)</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
                    placeholder="Diga-nos rapidamente sobre o seu projeto..."
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-semibold shadow hover:opacity-90 transition-opacity"
                  >
                    {status.loading ? "Enviando..." : "Solicitar Avaliação"}
                  </button>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="px-4 py-2 border border-orange-500 rounded-2xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">WhatsApp</a>
                </div>
                {status.success && <div className="mt-2 p-3 rounded-xl bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 font-semibold">{status.success}</div>}
                {status.error && <div className="mt-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-semibold">{status.error}</div>}
              </form>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="space-y-8">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700">Nossos Serviços</h2>
            <p className="text-gray-600 dark:text-gray-300">Soluções práticas e adaptadas para cada tipo de organização.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div
                  key={i}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105"
                >
                  <div className="h-12 w-12 rounded-md bg-gradient-to-tr from-orange-200 via-orange-300 to-orange-500 flex items-center justify-center font-bold text-orange-700">{s.title[0]}</div>
                  <h3 className="mt-4 font-semibold text-orange-600">{s.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{s.desc}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => { setForm(prev => ({ ...prev, service: s.title })); setSelectedCardForm(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-medium shadow hover:opacity-90 transition-opacity"
                    >
                      Solicitar este serviço
                    </button>
                    <button
                      onClick={() => setSelectedCardDetail(s)}
                      className="px-4 py-2 border border-orange-500 rounded-2xl text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Ver mais
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CASES */}
          <section id="cases" className="space-y-8">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700">Casos de Sucesso</h2>
            <p className="text-gray-600 dark:text-gray-300">Pequenas histórias de impacto a partir de intervenções práticas.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cases.map((c, i) => (
                <div
                  key={i}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105"
                >
                  <div className="text-sm text-gray-400 dark:text-gray-500">Caso real</div>
                  <h3 className="mt-2 font-semibold text-orange-600">{c.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{c.desc}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => { setForm(prev => ({ ...prev, service: "" })); setSelectedCardForm(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-medium shadow hover:opacity-90 transition-opacity"
                    >
                      Solicitar Avaliação
                    </button>
                    <button
                      onClick={() => setSelectedCardDetail(c)}
                      className="px-4 py-2 border border-orange-500 rounded-2xl text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Ver estudo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-gray-300 dark:border-gray-700 pt-8 pb-16 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:justify-between gap-6">
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-50">BSC</div>
              <div className="text-sm mt-2">Consultoria, Legalização & Formação adaptada ao contexto Moçambique.</div>
              <div className="mt-4 flex gap-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline text-orange-500 dark:text-orange-400">WhatsApp</a>
                <a href="#" className="underline">LinkedIn</a>
                <a href="#" className="underline">Facebook</a>
              </div>
            </div>
            <div className="text-sm mt-4 md:mt-0">
              <div>Endereço: Av. Exemplo, Cidade — Maputo</div>
              <div className="mt-2">Email: contacto@bsc.example</div>
              <div className="mt-2">Telefone: +258 8XX XXX XXX</div>
            </div>
          </div>
          <div className="mt-6 text-xs text-center">© {new Date().getFullYear()} BSC. Todos os direitos reservados.</div>
        </footer>

        {/* MODAL DETALHES */}
        {selectedCardDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative">
              <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-lg font-bold" onClick={() => setSelectedCardDetail(null)}>×</button>
              <h3 className="text-xl font-bold text-orange-600">{selectedCardDetail.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{selectedCardDetail.desc}</p>
              {selectedCardDetail.extra && <p className="mt-2 text-gray-500 dark:text-gray-400">{selectedCardDetail.extra}</p>}
            </div>
          </div>
        )}

        {/* MODAL FORMULÁRIO */}
        {selectedCardForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative">
              <button className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-lg font-bold" onClick={() => setSelectedCardForm(false)}>×</button>
              <h3 className="text-lg font-semibold">Solicite uma avaliação gratuita</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Preencha os dados e um consultor entrará em contacto.</p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {["name","email","phone"].map(field => (
                  <div key={field}>
                    <label className="text-xs font-medium capitalize">{field === "phone" ? "Telefone / WhatsApp" : field}</label>
                    <input
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={form[field as keyof FormData]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium">Serviço de Interesse</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 transition-colors duration-300"
                  >
                    {services.map(s => <option key={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium">Mensagem (opcional)</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status.loading}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-semibold shadow hover:opacity-90 transition-opacity w-full"
                >
                  {status.loading ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
