'use client';

import { useState } from 'react';
import { CITIES } from '../../lib/cities';

const UI = {
  en: { back: '← Back', title: 'Porondam — compatibility', sub: 'Check marriage compatibility between two horoscopes.', bride: 'Bride', groom: 'Groom', date: 'Birth date', time: 'Birth time', unknown: 'Time unknown', city: 'Birth place', pick: 'Select city', lang: 'Language', submit: 'Check compatibility', loading: 'Matching charts…', score: 'Guna Milan', err: 'Something went wrong. Check the details and try again.', disc: 'For guidance and entertainment only. Not a substitute for a full consultation.' },
  si: { back: '← ආපසු', title: 'පොරොන්දම් — ගැලපීම', sub: 'හඳහන් දෙකක් අතර විවාහ පොරොන්දම් පරීක්ෂා කරන්න.', bride: 'කන්‍යාව', groom: 'පිරිමියා', date: 'උපන් දිනය', time: 'උපන් වේලාව', unknown: 'වේලාව නොදනී', city: 'උපන් ස්ථානය', pick: 'නගරය තෝරන්න', lang: 'භාෂාව', submit: 'පොරොන්දම් බලන්න', loading: 'හඳහන් ගළපමින්…', score: 'ගුණ මිලාන', err: 'දෝෂයක් ඇතිවිය. විස්තර පරීක්ෂා කර නැවත උත්සාහ කරන්න.', disc: 'මඟපෙන්වීම හා විනෝදය සඳහා පමණි. සම්පූර්ණ උපදේශනයකට ආදේශකයක් නොවේ.' },
};

function Person({ t, label, v, set }) {
  return (
    <div className="formwrap" style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: 'var(--serif)', color: 'var(--gold-soft)', fontSize: '1.2rem', marginBottom: 10 }}>{label}</div>
      <div className="row">
        <div className="field"><label>{t('date')}</label><input type="date" required value={v.date} onChange={(e) => set({ ...v, date: e.target.value })} /></div>
        <div className="field"><label>{t('time')}</label><input type="time" value={v.time} disabled={!v.timeKnown} onChange={(e) => set({ ...v, time: e.target.value })} /></div>
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', fontWeight: 400, fontSize: '.85rem', marginBottom: 12 }}>
        <input type="checkbox" style={{ width: 'auto' }} checked={!v.timeKnown} onChange={(e) => set({ ...v, timeKnown: !e.target.checked })} />{t('unknown')}
      </label>
      <div className="field">
        <label>{t('city')}</label>
        <select required value={v.cityIdx} onChange={(e) => set({ ...v, cityIdx: e.target.value })}>
          <option value="" disabled>{t('pick')}</option>
          {CITIES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function Porondam() {
  const [lang, setLang] = useState('si');
  const t = (k) => UI[lang][k];
  const empty = { date: '', time: '', timeKnown: true, cityIdx: '' };
  const [bride, setBride] = useState({ ...empty });
  const [groom, setGroom] = useState({ ...empty });
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [outLang, setOutLang] = useState('si');

  async function submit(e) {
    e.preventDefault();
    const bc = CITIES[bride.cityIdx], gc = CITIES[groom.cityIdx];
    if (!bride.date || !groom.date || !bc || !gc) { setStatus('error'); return; }
    setStatus('loading'); setResult(null);
    try {
      const r = await fetch('/api/porondam', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          girl: { date: bride.date, time: bride.time, timeKnown: bride.timeKnown, lat: bc.lat, lon: bc.lon },
          boy: { date: groom.date, time: groom.time, timeKnown: groom.timeKnown, lat: gc.lat, lon: gc.lon },
          lang,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setResult(d); setOutLang(lang); setStatus('done'); } else setStatus('error');
    } catch { setStatus('error'); }
  }

  const f = result && result.facts;
  const it = result && result.interp;

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

      <form onSubmit={submit}>
        <Person t={t} label={t('bride')} v={bride} set={setBride} />
        <Person t={t} label={t('groom')} v={groom} set={setGroom} />
        <button type="submit" className="btn" style={{ width: '100%' }} disabled={status === 'loading'}>
          {status === 'loading' ? t('loading') : t('submit')}
        </button>
        {status === 'error' && <div className="errnote">{t('err')}</div>}
      </form>

      {status === 'done' && f && (
        <div className="formwrap" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--gold-soft)' }}>
              {t('score')}: {f.total != null ? `${f.total} / ${f.max}` : '—'}
            </div>
            <div className="langs">
              <button type="button" className={outLang === 'si' ? 'active' : ''} onClick={() => setOutLang('si')}>සිං</button>
              <button type="button" className={outLang === 'en' ? 'active' : ''} onClick={() => setOutLang('en')}>EN</button>
            </div>
          </div>
          {it ? (
            <>
              <h2 style={{ fontSize: '1.35rem', textAlign: 'left', marginBottom: 10 }}>{outLang === 'si' ? it.headline_si : it.headline_en}</h2>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{outLang === 'si' ? it.verdict_si : it.verdict_en}</p>
            </>
          ) : (
            <p style={{ lineHeight: 1.8 }}>{f.verdict || '—'}</p>
          )}
          <div className="note" style={{ marginTop: 16 }}>{t('disc')}</div>
        </div>
      )}
    </div>
  );
}
