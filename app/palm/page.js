'use client';

import { useState } from 'react';

const UI = {
  en: { back: '← Back', title: 'Palm reading', sub: 'Upload a clear photo of your palm for a fun reading.', choose: 'Choose palm photo', submit: 'Read my palm', loading: 'Reading your palm…', retake: 'Please retake', err: 'Something went wrong. Please try again.', disc: 'Just for fun ✨ Palmistry is entertainment, not prediction, and not medical, financial or legal advice.' },
  si: { back: '← ආපසු', title: 'හස්ත රේඛා කියවීම', sub: 'විනෝදජනක කියවීමක් සඳහා ඔබේ අත්ලේ පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න.', choose: 'අත්ලේ ඡායාරූපය තෝරන්න', submit: 'මගේ අත්ල කියවන්න', loading: 'අත්ල කියවමින්…', retake: 'නැවත ගන්න', err: 'දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.', disc: 'විනෝදය සඳහා පමණි ✨ හස්ත රේඛා යනු විනෝදයක් මිස අනාවැකියක් හෝ වෛද්‍ය, මූල්‍ය හෝ නීති උපදෙස් නොවේ.' },
};

function resize(file, max = 1024, q = 0.85) {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
      else if (h > max) { w = Math.round(w * max / h); h = max; }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      res(c.toDataURL('image/jpeg', q));
    };
    img.onerror = rej;
    img.src = url;
  });
}

export default function Palm() {
  const [lang, setLang] = useState('si');
  const t = (k) => UI[lang][k];
  const [preview, setPreview] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [out, setOut] = useState(null);
  const [outLang, setOutLang] = useState('si');

  async function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try { const du = await resize(f); setDataUrl(du); setPreview(du); setOut(null); setStatus('idle'); }
    catch { setStatus('error'); }
  }

  async function submit(e) {
    e.preventDefault();
    if (!dataUrl) { setStatus('error'); return; }
    setStatus('loading'); setOut(null);
    try {
      const r = await fetch('/api/palm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: dataUrl, lang }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setOut(d.out); setOutLang(lang); setStatus('done'); } else setStatus('error');
    } catch { setStatus('error'); }
  }

  const good = out && out.is_palm && out.quality_ok;

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
      <p className="sub" style={{ margin: '0 0 18px' }}>{t('sub')}</p>

      <div className="formwrap">
        <form onSubmit={submit}>
          <div className="field">
            <label className="btn sm" style={{ display: 'inline-block', cursor: 'pointer' }}>
              {t('choose')}
              <input type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />
            </label>
          </div>
          {preview && <img src={preview} alt="palm" style={{ maxWidth: '100%', borderRadius: 12, margin: '10px 0', border: '1px solid var(--line)' }} />}
          <button type="submit" className="btn" disabled={status === 'loading' || !dataUrl}>{status === 'loading' ? t('loading') : t('submit')}</button>
          {status === 'error' && <div className="errnote">{t('err')}</div>}
        </form>
      </div>

      {status === 'done' && out && (good ? (
        <div className="formwrap" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <div className="langs">
              <button type="button" className={outLang === 'si' ? 'active' : ''} onClick={() => setOutLang('si')}>සිං</button>
              <button type="button" className={outLang === 'en' ? 'active' : ''} onClick={() => setOutLang('en')}>EN</button>
            </div>
          </div>
          <h2 style={{ fontSize: '1.4rem', textAlign: 'left', marginBottom: 12 }}>{outLang === 'si' ? out.headline_si : out.headline_en}</h2>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{outLang === 'si' ? out.reading_si : out.reading_en}</p>
          <div className="note" style={{ marginTop: 16 }}>{t('disc')}</div>
        </div>
      ) : (
        <div className="formwrap" style={{ marginTop: 20 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--gold-soft)', marginBottom: 8 }}>{t('retake')}</div>
          <p style={{ lineHeight: 1.7 }}>{outLang === 'si' ? (out.retake_si || out.retake_en) : (out.retake_en || out.retake_si)}</p>
        </div>
      ))}
    </div>
  );
}
