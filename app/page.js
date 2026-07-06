'use client';

import { useState } from 'react';

const T = {
  en: {
    ta_soon: 'தமிழ் பதிப்பு விரைவில் வரும் — Tamil version coming soon.',
    nav_join: 'Join waitlist',
    hero_title: 'Your stars, your palm, your dreams — guided by AI, rooted in Sri Lankan tradition.',
    hero_sub:
      'Authentic Vedic astrology (handahana), palm reading, porondam matching, dream meanings and nekath — all in one place, in your language.',
    hero_cta: 'Join the waitlist',
    hero_try: 'Try an early birth-chart reading →',
    hero_trust: 'Built for Sri Lanka · Sinhala, Tamil & English',
    feat_eyebrow: 'The experience',
    feat_title: "What you'll get",
    f1_tag: 'Core',
    f1_t: 'Your birth chart & future',
    f1_d: 'A personal Vedic handahana, plus an AI you can ask about love, career and life — grounded in your real chart.',
    f2_tag: 'Snap & share',
    f2_t: 'Palm reading',
    f2_d: 'Snap a photo of your palm and get an instant reading of your lines — clear, visual and fun to share.',
    f3_tag: 'Most loved',
    f3_t: 'Porondam matching',
    f3_d: "Check marriage compatibility between two charts, the way it's done in Sri Lanka.",
    f4_t: 'Dream meanings',
    f4_d: 'Tell us your dream and discover what it may signify (sihina palapala).',
    f5_t: 'Nekath (auspicious times)',
    f5_d: 'Know the right moments for new beginnings — journeys, work and ceremonies.',
    more_t: 'And more to come',
    more_d: 'Daily rashi, remedies and live astrologers — added over time.',
    why_eyebrow: 'Why us',
    why_title: 'Why Tharā',
    why_1: 'Rooted in authentic Sri Lankan Vedic tradition — not generic Western sun-signs.',
    why_2: 'In your language — Sinhala, Tamil and English.',
    why_3: 'Private and personal — your details stay yours.',
    join_eyebrow: 'Early access',
    form_title: 'Be the first to know',
    form_sub: "Join the waitlist and we'll invite you the moment we launch.",
    label_name: 'Name',
    label_email: 'Email',
    label_phone: 'Phone / WhatsApp (optional)',
    label_lang: 'Preferred language',
    label_interest: 'Most interested in',
    opt_si: 'Sinhala',
    opt_ta: 'Tamil',
    opt_en: 'English',
    opt_chart: 'Birth chart & future',
    opt_palm: 'Palm reading',
    opt_porondam: 'Porondam',
    opt_dreams: 'Dreams',
    opt_nekath: 'Nekath',
    ph_name: 'Your name',
    ph_email: 'you@example.com',
    ph_phone: '+94 7X XXX XXXX',
    btn_submit: 'Join the waitlist',
    submitting: 'Joining…',
    form_privacy: "We'll only use your details to invite you. No spam.",
    success_msg: "You're on the list! We'll be in touch soon.",
    err_msg: 'Something went wrong. Please try again.',
    footer_disclaimer:
      'For guidance and entertainment only. Not a substitute for professional medical, legal or financial advice.',
    footer_name_note: '“Tharā” is a working name.',
  },
  si: {
    ta_soon: 'தமிழ் பதிப்பு விரைவில் வரும் — Tamil version coming soon.',
    nav_join: 'ලැයිස්තුවට එක්වන්න',
    hero_title: 'ඔබේ තරු, ඔබේ අත්ල, ඔබේ සිහින — AI තාක්ෂණයෙන්, ශ්‍රී ලාංකික සම්ප්‍රදායට අනුව.',
    hero_sub:
      'සැබෑ වෛදික ජ්‍යෝතිෂය (හඳහන), හස්ත රේඛා, පොරොන්දම්, සිහින පලාපල සහ නැකත් — සියල්ල එකම තැනක, ඔබේ භාෂාවෙන්.',
    hero_cta: 'පොරොත්තු ලැයිස්තුවට එක්වන්න',
    hero_try: 'මුල්ම හඳහන් කියවීමක් ලබාගන්න →',
    hero_trust: 'ශ්‍රී ලංකාව සඳහා · සිංහල, දෙමළ සහ ඉංග්‍රීසි',
    feat_eyebrow: 'අත්දැකීම',
    feat_title: 'ඔබට ලැබෙන දේ',
    f1_tag: 'ප්‍රධාන',
    f1_t: 'ඔබේ හඳහන සහ අනාගතය',
    f1_d: 'පෞද්ගලික වෛදික හඳහනක්, සහ ඔබේ සැබෑ හඳහන මත පදනම්ව ආදරය, රැකියාව සහ ජීවිතය ගැන ඇසිය හැකි AI සහායකයෙක්.',
    f2_tag: 'ඡායාරූප',
    f2_t: 'හස්ත රේඛා කියවීම',
    f2_d: 'ඔබේ අත්ලේ ඡායාරූපයක් ගෙන ඔබේ රේඛා පිළිබඳ ක්ෂණික කියවීමක් ලබාගන්න.',
    f3_tag: 'වඩාත් ප්‍රියතම',
    f3_t: 'පොරොන්දම් ගැලපීම',
    f3_d: 'හඳහන් දෙකක් අතර විවාහ පොරොන්දම් ශ්‍රී ලාංකික ක්‍රමයට පරීක්ෂා කරන්න.',
    f4_t: 'සිහින පලාපල',
    f4_d: 'ඔබේ සිහිනය කියන්න, එහි අර්ථය සොයාගන්න.',
    f5_t: 'නැකත්',
    f5_d: 'නව ආරම්භ සඳහා සුබ මොහොත — ගමන්, කටයුතු සහ උත්සව.',
    more_t: 'තවත් බොහෝ දේ',
    more_d: 'දෛනික රාශි පලාපල, පිළියම් සහ සජීවී ජ්‍යෝතිෂඥයන් — කලින් කලට එකතු වේ.',
    why_eyebrow: 'ඇයි අපි',
    why_title: 'ඇයි තරු?',
    why_1: 'සැබෑ ශ්‍රී ලාංකික වෛදික සම්ප්‍රදාය මත පදනම්ව — සාමාන්‍ය බටහිර රාශි නොවේ.',
    why_2: 'ඔබේ භාෂාවෙන් — සිංහල, දෙමළ සහ ඉංග්‍රීසි.',
    why_3: 'පෞද්ගලික සහ ආරක්ෂිතයි — ඔබේ තොරතුරු ඔබටම.',
    join_eyebrow: 'මුල් ප්‍රවේශය',
    form_title: 'මුලින්ම දැනගන්න',
    form_sub: 'පොරොත්තු ලැයිස්තුවට එක්වන්න, අපි ආරම්භ කරන විට ඔබට දන්වන්නෙමු.',
    label_name: 'නම',
    label_email: 'විද්‍යුත් තැපෑල',
    label_phone: 'දුරකථන / WhatsApp (අත්‍යවශ්‍ය නොවේ)',
    label_lang: 'කැමති භාෂාව',
    label_interest: 'වැඩිපුරම කැමති',
    opt_si: 'සිංහල',
    opt_ta: 'දෙමළ',
    opt_en: 'ඉංග්‍රීසි',
    opt_chart: 'හඳහන සහ අනාගතය',
    opt_palm: 'හස්ත රේඛා',
    opt_porondam: 'පොරොන්දම්',
    opt_dreams: 'සිහින',
    opt_nekath: 'නැකත්',
    ph_name: 'ඔබේ නම',
    ph_email: 'you@example.com',
    ph_phone: '+94 7X XXX XXXX',
    btn_submit: 'ලැයිස්තුවට එක්වන්න',
    submitting: 'එක් වෙමින්…',
    form_privacy: 'ඔබට ආරාධනා කිරීමට පමණක් ඔබේ තොරතුරු භාවිතා කරමු. spam නැත.',
    success_msg: 'ඔබ දැන් ලැයිස්තුවේ! අපි ඉක්මනින් සම්බන්ධ වන්නෙමු.',
    err_msg: 'යම් දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.',
    footer_disclaimer:
      'මඟපෙන්වීම සහ විනෝදය සඳහා පමණි. වෘත්තීය වෛද්‍ය, නීති හෝ මූල්‍ය උපදෙස් සඳහා ආදේශකයක් නොවේ.',
    footer_name_note: '“තරු” යනු තාවකාලික නාමයකි.',
  },
};
T.ta = { ...T.en };

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සිං' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function Home() {
  const [lang, setLang] = useState('en');
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const s = (k) => (T[lang] && T[lang][k] !== undefined ? T[lang][k] : T.en[k]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.user_agent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) setStatus('done');
      else setStatus('error');
    } catch (_) {
      setStatus('error');
    }
  }

  return (
    <div data-lang={lang}>
      <div className="ta-banner">{s('ta_soon')}</div>

      <header>
        <div className="wrap bar">
          <div className="brand">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <radialGradient id="g" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f5e7c4" />
                  <stop offset="100%" stopColor="#c9962f" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="30" fill="none" stroke="url(#g)" strokeWidth="1.4" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#g)" strokeWidth="1" opacity="0.5" />
              <path d="M50 30 L54 46 L70 50 L54 54 L50 70 L46 54 L30 50 L46 46 Z" fill="url(#g)" />
            </svg>
            Tharā
          </div>
          <div className="nav-right">
            <div className="langs" role="group" aria-label="Language">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={lang === l.code ? 'active' : ''}
                  onClick={() => setLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <a href="#join" className="btn sm cta-sm">{s('nav_join')}</a>
          </div>
        </div>
      </header>

      <main>
        <section className="wrap hero">
          <svg className="emblem" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <radialGradient id="e" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#f5e7c4" />
                <stop offset="100%" stopColor="#c9962f" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="70" fill="none" stroke="url(#e)" strokeWidth="1.3" opacity="0.85" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="url(#e)" strokeWidth="1" opacity="0.4" />
            <g stroke="url(#e)" strokeWidth="1" opacity="0.6">
              <line x1="100" y1="30" x2="100" y2="170" />
              <line x1="30" y1="100" x2="170" y2="100" />
              <line x1="50" y1="50" x2="150" y2="150" />
              <line x1="150" y1="50" x2="50" y2="150" />
            </g>
            <path d="M100 60 L108 92 L140 100 L108 108 L100 140 L92 108 L60 100 L92 92 Z" fill="url(#e)" />
            <g fill="#f5e7c4">
              <circle cx="100" cy="30" r="2.4" />
              <circle cx="170" cy="100" r="2.4" />
              <circle cx="100" cy="170" r="2.4" />
              <circle cx="30" cy="100" r="2.4" />
            </g>
          </svg>
          <h1>{s('hero_title')}</h1>
          <p className="sub">{s('hero_sub')}</p>
          <a href="#join" className="btn">{s('hero_cta')}</a>
          <div style={{ marginTop: 14 }}>
            <a href="/reading" style={{ color: 'var(--gold-soft)', textDecoration: 'none', borderBottom: '1px solid var(--line)', paddingBottom: 2, fontSize: '.95rem' }}>{s('hero_try')}</a>
          </div>
          <div className="trust">{s('hero_trust')}</div>
        </section>

        <section className="wrap block">
          <div className="eyebrow">{s('feat_eyebrow')}</div>
          <h2>{s('feat_title')}</h2>
          <div className="grid">
            <div className="card">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" />
              </svg>
              <div className="tag">{s('f1_tag')}</div>
              <h3>{s('f1_t')}</h3>
              <p>{s('f1_d')}</p>
            </div>
            <div className="card">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 13V5a1.5 1.5 0 0 1 3 0v6m0-1V4a1.5 1.5 0 0 1 3 0v7m0-2a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7l-2-3a1.6 1.6 0 0 1 2.6-1.8L8 15" />
              </svg>
              <div className="tag">{s('f2_tag')}</div>
              <h3>{s('f2_t')}</h3>
              <p>{s('f2_d')}</p>
            </div>
            <div className="card">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5.5 6.5 5.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 5.5 23 9 21.5 12.5 19 16.65 12 21 12 21z" />
              </svg>
              <div className="tag">{s('f3_tag')}</div>
              <h3>{s('f3_t')}</h3>
              <p>{s('f3_d')}</p>
            </div>
            <div className="card">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
              <h3>{s('f4_t')}</h3>
              <p>{s('f4_d')}</p>
            </div>
            <div className="card">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
              </svg>
              <h3>{s('f5_t')}</h3>
              <p>{s('f5_d')}</p>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderStyle: 'dashed' }}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <h3>{s('more_t')}</h3>
              <p>{s('more_d')}</p>
            </div>
          </div>
        </section>

        <section className="wrap block">
          <div className="eyebrow">{s('why_eyebrow')}</div>
          <h2>{s('why_title')}</h2>
          <div className="why">
            <div><div className="star">✦</div><p>{s('why_1')}</p></div>
            <div><div className="star">✦</div><p>{s('why_2')}</p></div>
            <div><div className="star">✦</div><p>{s('why_3')}</p></div>
          </div>
        </section>

        <section className="wrap block" id="join">
          <div className="eyebrow">{s('join_eyebrow')}</div>
          <h2>{s('form_title')}</h2>
          <p className="sub" style={{ marginBottom: 0 }}>{s('form_sub')}</p>
          <div className="formwrap">
            {status === 'done' ? (
              <div className="success">
                <div className="big">🌟</div>
                <p>{s('success_msg')}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="field">
                  <label htmlFor="name">{s('label_name')}</label>
                  <input id="name" type="text" name="name" placeholder={s('ph_name')} />
                </div>
                <div className="row">
                  <div className="field">
                    <label htmlFor="email">{s('label_email')}</label>
                    <input id="email" type="email" name="email" placeholder={s('ph_email')} required />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">{s('label_phone')}</label>
                    <input id="phone" type="tel" name="phone" placeholder={s('ph_phone')} />
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <label htmlFor="language">{s('label_lang')}</label>
                    <select id="language" name="language" defaultValue="si">
                      <option value="si">{s('opt_si')}</option>
                      <option value="ta">{s('opt_ta')}</option>
                      <option value="en">{s('opt_en')}</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="interest">{s('label_interest')}</label>
                    <select id="interest" name="interest" defaultValue="chart">
                      <option value="chart">{s('opt_chart')}</option>
                      <option value="palm">{s('opt_palm')}</option>
                      <option value="porondam">{s('opt_porondam')}</option>
                      <option value="dreams">{s('opt_dreams')}</option>
                      <option value="nekath">{s('opt_nekath')}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn" disabled={status === 'submitting'}>
                  {status === 'submitting' ? s('submitting') : s('btn_submit')}
                </button>
                {status === 'error' && <div className="errnote">{s('err_msg')}</div>}
                <div className="note">{s('form_privacy')}</div>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="wrap">
        <p className="disc">{s('footer_disclaimer')}</p>
        <p>{s('footer_name_note')}</p>
        <p>© {new Date().getFullYear()} Tharā</p>
      </footer>
    </div>
  );
}
