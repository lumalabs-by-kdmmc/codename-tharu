'use client';

import { useState } from 'react';

const UI = {
  en: { back: '← Back', title: 'Dream meanings', sub: 'Tell us your dream and discover what it may signify.', ph: 'Describe your dream…', submit: 'Interpret my dream', loading: 'Interpreting…', err: 'Something went wrong. Please try again.', disc: 'For reflection and entertainment only. Not medical or psychological advice.' },
  si: { back: '← ආපසු', title: 'සිහින පලාපල', sub: 'ඔබේ සිහිනය කියන්න, එහි අර්ථය සොයාගන්න.', ph: 'ඔබේ සිහිනය විස්තර කරන්න…', submit: 'සිහිනය විග්‍රහ කරන්න', loading: 'විග්‍රහ කරමින්…', err: 'දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.', disc: 'මෙනෙහි කිරීම හා විනෝදය සඳහා පමණි. වෛද්‍ය හෝ මනෝවිද්‍යා උපදෙස් නොවේ.' },
};

export default function Dreams() {
  const [lang, setLang] = useState('si');
  const t = (k) => UI[lang][k];
  const [dream, setDream] = useState('');
  const [status, setStatus] = useState('idle');
  const [out, setOut] = useState(null);
  const [outLang, setOutLang] = useState('si');

  async function submit(e) {
    e.preventDefault();
    if (dream.trim().length < 3) { setStatus('error'); return; }
    setStatus('loading'); setOut(null);
    try {
      const r = await fetch('/api/dreams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dream, lang }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setOut(d.out); setOutLang(lang); setStatus('done'); } else setStatus('error');
    } catch { setStatus('error'); }
  }

  return (
    <div data-lang={lang} className="wrap" style={{ maxWidth: 640, padding: '36px 22px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <a href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.9rem' }}>{t('back')}</a>
        <div className="langs">
          <button type="button" className={lang === 'si' ? 'active' : ''} onClick={() => setLang('si')}>සිං</button>
          <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>
      <h1 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', textAlign: 'left', maxWidth: 'none', marginBottom: 6 }}>{t('title')}</h1>
      <p className="sub" style={{ margin: '0 0 22px' }}>{t('sub')}</p>

      <div className="formwrap">
        <form onSubmit={submit}>
          <div className="field">
            <textarea value={dream} onChange={(e) => setDream(e.target.value)} placeholder={t('ph')} rows={5}
              style={{ width: '100%', padding: '13px 15px', borderRadius: 11, border: '1px solid var(--line)', background: 'rgba(0,0,0,.3)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn" disabled={status === 'loading'}>{status === 'loading' ? t('loading') : t('submit')}</button>
          {status === 'error' && <div className="errnote">{t('err')}</div>}
        </form>
      </div>

      {status === 'done' && out && (
        <div className="formwrap" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <div className="langs">
              <button type="button" className={outLang === 'si' ? 'active' : ''} onClick={() => setOutLang('si')}>සිං</button>
              <button type="button" className={outLang === 'en' ? 'active' : ''} onClick={() => setOutLang('en')}>EN</button>
            </div>
          </div>
          <h2 style={{ fontSize: '1.4rem', textAlign: 'left', marginBottom: 12 }}>{outLang === 'si' ? out.headline_si : out.headline_en}</h2>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{outLang === 'si' ? out.meaning_si : out.meaning_en}</p>
          <div className="note" style={{ marginTop: 16 }}>{t('disc')}</div>
        </div>
      )}
    </div>
  );
}
