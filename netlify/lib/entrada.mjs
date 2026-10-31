// Página de entrada con contraseña, en la identidad de la presentación (sin dependencias externas).
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function loginPage({error=false,volver='/'}={}){
 return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Entrar · Conversaciones con una herida</title>
<style>
:root{--paper:#f6f0e8;--ink:#302b2a;--muted:#72635e;--blood:#c6323e;--night:#22171a;--line:#d9cdc5}
*{box-sizing:border-box}html,body{margin:0;height:100%}
body{display:grid;place-items:center;padding:24px;background:radial-gradient(80% 70% at 75% 25%,#f3d9cf 0,var(--paper) 55%,#efe6dc 100%);font:16px/1.5 "Avenir Next","Segoe UI",system-ui,sans-serif;color:var(--ink)}
main{width:min(420px,100%);padding:36px 32px 32px;border-radius:22px;background:#fffdfa;box-shadow:0 30px 60px -30px rgba(116,53,54,.45),inset 0 0 0 1px rgba(198,50,62,.08)}
.k{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--blood)}
.k::before{content:"";width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffd9cf,#e46a5a 55%,#c6323e);box-shadow:0 0 10px rgba(228,106,90,.7)}
h1{font:500 30px/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.01em;margin:14px 0 8px}
p{margin:0 0 22px;color:var(--muted)}
label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
input{width:100%;padding:13px 14px;border-radius:12px;border:1px solid var(--line);font:inherit;background:#fff}
input:focus{outline:2px solid rgba(198,50,62,.35);border-color:var(--blood)}
button{margin-top:16px;width:100%;padding:13px;border:0;border-radius:12px;background:var(--night);color:#fbefe3;font:inherit;font-weight:650;cursor:pointer}
.err{margin:14px 0 0;color:var(--blood);font-size:14px}
</style></head><body><main><span class="k">IV Jornadas Comisión Heridas Jerez</span><h1>Conversaciones con una herida</h1><p>Espacio de preparación: presentación, guion y notas.</p>
<form method="post" action="/entrar"><input type="hidden" name="volver" value="${esc(volver)}"><label for="clave">Contraseña</label><input id="clave" name="clave" type="password" autocomplete="current-password" required autofocus><button type="submit">Entrar</button>${error?'<p class="err" role="alert">La contraseña no es correcta.</p>':''}</form></main><script>document.querySelector('form').addEventListener('submit',e=>{const v=e.target.volver;v.value=v.value.split('#')[0]+location.hash;});</script></body></html>`;
}
