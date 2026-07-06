'use client';

import { useState } from 'react';
import { CITIES } from '../../lib/cities';

const UI = {
  en: {
    back: '← Back', title: 'Your birth chart reading',
    sub: 'Enter your birth details for a personal Vedic reading.',
    name: 'Name (optional)', date: 'Birth date', time: 'Birth time',
    unknown: "I don't know my birth time", place: 'Birth place', lang: 'Reading language',
    submit: 'Get my reading', loading: 'Reading the stars…',
    nak: 'Nakshatra', moon: 'Moon sign', sun: 'Sun sign', dasha: 'Current period',
    disclaimer: 'For guidance and entertainment only. Not medical, legal or financial advice.',
    err: 'Something went wrong. Please check your details and try again.', pick: 'Select your city',
  },
  si: {
    back: '← ආපසු', title: 'ඔබේ හඳහන් කියවීම',
    sub: 'පෞද්ගලික වෛදික කියවීමක් සඳහා ඔබේ උපන් තොරතුරු ඇතුළත් කරන්න.',
    name: 'නම (අත්‍යවශ්‍ය නොවේ)', date: 'උපන් දිනය', time: 'උපන් වේලාව',
    unknown: 'මගේ උපන් වේලාව නොදනී', place: 'උපන් ස්ථානය', lang: 'කියවීමේ භාෂාව',
    submit: 'මගේ කියවීම ලබාගන්න', loading: 'තරු කියවමින්…',
    nak: 'නැකත', moon: 'චන්ද්‍ර රාශිය', sun: 'රවි රාශිය', dasha: 'වත්මන් දශාව',
    disclaimer: 'මඟපෙන්වීම හා විනෝදය සඳහා පමණි. වෛද්‍ය, නීති හෝ මූල්‍ය උපදෙස් නොවේ.',
    err: 'යම් දෝෂයක් ඇතිවිය. ඔබේ තොරතුරු පරීක්ෂා කර නැවත උත්සාහ කරන්න.', pick: 'ඔබේ නගරය තෝරන්න',
  },
};

export default function Reading() {
  const [lang, setLang] = useState('si');
  const t = (k) => UI[lang][k];
  const [form, setForm] = useState({ name: '', date: '', time: '', timeKnown: true, cityIdx: '' });
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [outLang, setOutLang] = useState('si');

  async function onSubmit(e) {
    e.preventDefault();
    const city = CITIES[form.cityIdx];
    if (!form.date || !city) { setStatus('error'); return; }
    setStatus('loading'); setResult(null);
    try {
      const res = await fetch('/api/reading', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || null, date: form.date, time: form.time, timeKnown: form.timeKnown,
          place: city.name, lat: city.lat, lon: city.lon, lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { setResult(data); setOutLang(lang); setStatus('done'); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  const facts = result && result.facts;
  const reading = result && result.reading;

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
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>{t('name')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="row">
            <div className="field">
              <label>{t('date')}</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field">
              <label>{t('time')}</label>
              <input type="time" value={form.time} disabled={!form.timeKnown} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 400, color: 'var(--muted)', marginBottom: 14, fontSize: '.9rem' }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={!form.timeKnown} onChange={(e) => setForm({ ...form, timeKnown: !e.target.checked })} />
            {t('unknown')}
          </label>
          <div className="row">
            <div className="field">
              <label>{t('place')}</label>
              <select required value={form.cityIdx} onChange={(e) => setForm({ ...form, cityIdx: e.target.value })}>
                <option value="" disabled>{t('pick')}</option>
                {CITIES.map((c, i) => (<option key={i} value={i}>{c.name}</option>))}
              </select>
            </div>
            <div className="field">
              <label>{t('lang')}</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="si">සිංහල</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn" disabled={status === 'loading'}>
            {status === 'loading' ? t('loading') : t('submit')}
          </button>
          {status === 'error' && <div className="errnote">{t('err')}</div>}
        </form>
      </div>

      {status === 'done' && reading && (
        <div className="formwrap" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <div className="langs">
              <button type="button" className={outLang === 'si' ? 'active' : ''} onClick={() => setOutLang('si')}>සිං</button>
              <button type="button" className={outLang === 'en' ? 'active' : ''} onClick={() => setOutLang('en')}>EN</button>
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: 14 }}>
            {outLang === 'si' ? reading.headline_si : reading.headline_en}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[[t('nak'), facts.nakshatra], [t('moon'), facts.moon_rasi], [t('sun'), facts.sun_rasi], [t('dasha'), facts.dasha_current]]
              .map(([k, v], i) => (v ? <span key={i} className="tag" style={{ textTransform: 'none' }}>{k}: {v}</span> : null))}
          </div>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {outLang === 'si' ? reading.reading_si : reading.reading_en}
          </p>
          <div className="note" style={{ marginTop: 18 }}>{t('disclaimer')}</div>
        </div>
      )}
    </div>
  );
}
