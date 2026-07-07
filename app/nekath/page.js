'use client';

import { useState } from 'react';
import { CITIES } from '../../lib/cities';

const UI = {
  en: { back: '← Back', title: 'Nekath — auspicious times', sub: 'Find auspicious periods for a chosen day.', date: 'Date', city: 'Place', pick: 'Select city', submit: 'Find nekath', loading: 'Finding…', none: 'No periods returned for this day.', err: 'Something went wrong. Please try again.', disc: 'For guidance only.' },
  si: { back: '← ආපසු', title: 'නැකත් — සුබ මොහොත', sub: 'තෝරාගත් දිනයකට සුබ මොහොත සොයන්න.', date: 'දිනය', city: 'ස්ථානය', pick: 'නගරය තෝරන්න', submit: 'නැකත් සොයන්න', loading: 'සොයමින්…', none: 'මෙම දිනයට මොහොත් නොමැත.', err: 'දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.', disc: 'මඟපෙන්වීම සඳහා පමණි.' },
};

function fmt(s) {
  try { return new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Colombo' }); }
  catch { return s; }
}

export default function Nekath() {
  const [lang, setLang] = useState('si');
  const t = (k) => UI[lang][k];
  const [date, setDate] = useState('');
  const [cityIdx, setCityIdx] = useState('');
  const [status, setStatus] = useState('idle');
  const [rows, setRows] = useState([]);

  async function submit(e) {
    e.preventDefault();
    const c = CITIES[cityIdx];
    if (!date || !c) { setStatus('error'); return; }
    setStatus('loading'); setRows([]);
    try {
      const r = await fetch('/api/nekath', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, lat: c.lat, lon: c.lon }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setRows(d.muhurat || []); setStatus('done'); } else setStatus('error');
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
          <div className="row">
            <div className="field"><label>{t('date')}</label><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="field">
              <label>{t('city')}</label>
              <select required value={cityIdx} onChange={(e) => setCityIdx(e.target.value)}>
                <option value="" disabled>{t('pick')}</option>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn" disabled={status === 'loading'}>{status === 'loading' ? t('loading') : t('submit')}</button>
          {status === 'error' && <div className="errnote">{t('err')}</div>}
        </form>
      </div>

      {status === 'done' && (
        <div style={{ marginTop: 20 }}>
          {rows.length === 0 ? <p className="sub">{t('none')}</p> : rows.map((m, i) => (
            <div key={i} className="formwrap" style={{ marginBottom: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--gold-soft)' }}>{m.name}</div>
                <span className="tag" style={{ textTransform: 'none' }}>{m.type}</span>
              </div>
              <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: '.95rem' }}>
                {(m.period || []).map((p, j) => <div key={j}>{fmt(p.start)} – {fmt(p.end)}</div>)}
              </div>
            </div>
          ))}
          <div className="note">{t('disc')}</div>
        </div>
      )}
    </div>
  );
}
