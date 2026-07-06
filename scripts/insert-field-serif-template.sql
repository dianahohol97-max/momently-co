-- Field & Serif template row for Momently
-- Run in Supabase SQL editor of the Momently project.
-- Idempotent: removes a previous row with the same slug first.

delete from templates where slug = 'field-serif';

insert into templates
  (name, slug, description, category, price_uah, price_usd,
   is_premium, is_active, display_order, config_json)
values
  ('Field & Serif', 'field-serif',
   'Фото-editorial еталон: повноекранне фото пари, білий серіф, глиняний типоблок, арка, робоча RSVP.',
   'elegant', 599, 15, false, true, 0,
   jsonb_build_object(
     'colors', jsonb_build_object(
       'primary', '#B7674B', 'secondary', '#23241F', 'accent', '#E6DFD2',
       'background', '#FAF7F1', 'surface', '#FFFFFF', 'text', '#23241F',
       'textMuted', '#6E685B', 'border', '#E6DFD2'),
     'typography', jsonb_build_object(
       'headingFont', 'Playfair Display', 'bodyFont', 'Golos Text', 'accentFont', 'Bad Script'),
     'editorCss', $fscss$@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Bad+Script&family=Golos+Text:wght@400;500&display=swap');
:root{
  --cream:#FAF7F1;
  --ink:#23241F;
  --clay:#B7674B;
  --stone:#E6DFD2;
  --scrim-top:rgba(20,22,18,.35);
  --scrim-bot:rgba(20,22,18,.45);
  --ease:cubic-bezier(.16,1,.3,1);
  --serif:'Playfair Display',Georgia,serif;
  --script:'Bad Script',cursive;
  --sans:'Golos Text',system-ui,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--cream);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.8;-webkit-font-smoothing:antialiased}
::selection{background:var(--clay);color:#fff}
:focus-visible{outline:2px solid var(--clay);outline-offset:3px}
img{display:block;max-width:100%}
.wrap{max-width:1200px;margin:0 auto;padding:0 clamp(20px,5vw,56px)}
.caps{font-size:11px;letter-spacing:.32em;text-transform:uppercase;font-weight:500}

/* topbar */
.topbar{
  position:fixed;inset:0 0 auto 0;z-index:80;
  display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
  padding:18px clamp(18px,4vw,44px);gap:16px;
  color:#fff;transition:background .5s var(--ease),color .5s var(--ease),box-shadow .5s var(--ease);
}
.topbar .links{display:flex;gap:clamp(14px,2.6vw,30px)}
.topbar a{color:inherit;text-decoration:none}
.topbar .links a{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;opacity:.92}
.topbar .mono{font-family:var(--serif);font-size:17px;letter-spacing:.14em;text-align:center;white-space:nowrap}
.topbar .rsvp-btn{
  justify-self:end;background:#fff;color:var(--ink);
  font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;
  padding:13px 26px;transition:opacity .3s;
}
.topbar .rsvp-btn:hover{opacity:.85}
.topbar.on{background:var(--cream);color:var(--ink);box-shadow:0 1px 0 var(--stone)}
.topbar.on .rsvp-btn{background:var(--ink);color:var(--cream)}
@media (max-width:820px){
  .topbar{grid-template-columns:auto 1fr auto}
  .topbar .links{display:none}
  .topbar .mono{text-align:left}
}

/* hero */
.hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;color:#fff}
.hero .bg{position:absolute;inset:0;background:#3A4438}
.hero .bg img{width:100%;height:100%;object-fit:cover;transform:scale(1.07);animation:heroZoom 3.2s var(--ease) forwards}
@keyframes heroZoom{to{transform:scale(1)}}
.hero .veil{position:absolute;inset:0;background:linear-gradient(to bottom,var(--scrim-top),rgba(20,22,18,.12) 40%,var(--scrim-bot))}
.hero .inner{position:relative;padding:110px 20px 90px}
.hero .script{font-family:var(--script);font-size:clamp(22px,3.4vw,30px);letter-spacing:.04em;opacity:.95}
.hero h1{font-family:var(--serif);font-weight:500;font-size:max(52px,10.6vw);line-height:1.04;white-space:nowrap;margin:14px 0 20px;text-shadow:0 2px 30px rgba(0,0,0,.18)}
.hero h1 .amp{font-style:italic;font-weight:400}
.hero .date{font-size:clamp(13px,1.6vw,16px);letter-spacing:.5em;text-transform:uppercase;font-weight:500}
.hero .count{margin-top:16px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;opacity:.85}
.hero .down{position:absolute;bottom:30px;left:50%;width:1px;height:52px;background:#fff;opacity:.6;transform-origin:top;animation:drop 2.6s var(--ease) infinite}
@keyframes drop{0%{transform:translateX(-50%) scaleY(0)}55%{transform:translateX(-50%) scaleY(1)}100%{transform:translateX(-50%) scaleY(1);opacity:0}}

/* buttons */
.btn{display:inline-block;font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:.3em;text-transform:uppercase;padding:18px 40px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;text-decoration:none;transition:background .4s var(--ease),color .4s var(--ease)}
.btn-ink{border-color:var(--ink);color:var(--ink)}
.btn-ink:hover{background:var(--ink);color:var(--cream)}
.btn-solid{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.btn-solid:hover{background:var(--clay);border-color:var(--clay)}

/* davis row moment */
.big-names{padding:clamp(80px,13vh,140px) 0 clamp(60px,9vh,100px);text-align:center;overflow:hidden}
.big-names .caps{color:var(--clay);display:block;margin-bottom:18px}
.big-names .wrap{max-width:none}
.big-names h2{font-family:var(--serif);font-weight:500;color:var(--clay);font-size:max(44px,9.6vw);line-height:1;white-space:nowrap;letter-spacing:.01em}
.big-names h2 .amp{font-style:italic;font-weight:400}
@media (max-width:640px){.big-names h2{white-space:normal;line-height:1.12}.hero h1{white-space:normal}}

/* story */
.story{padding:clamp(30px,6vh,70px) 0 clamp(90px,13vh,140px)}
.story .grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,84px);align-items:center}
.arch{width:min(100%,440px);margin:0 auto;aspect-ratio:3/4.1;overflow:hidden;border-radius:999px 999px 0 0;background:var(--stone)}
.arch img{width:100%;height:100%;object-fit:cover}
.story .lbl{font-size:13px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:var(--ink)}
.story .lbl em{font-family:var(--script);font-style:normal;text-transform:none;letter-spacing:.02em;font-size:30px;color:var(--clay);margin-left:8px;vertical-align:-4px}
.story h3{font-family:var(--serif);font-weight:500;font-size:clamp(30px,3.6vw,44px);line-height:1.22;margin:18px 0 22px}
.story p{color:rgba(35,36,31,.8);max-width:52ch}
.mile{display:flex;gap:clamp(24px,4vw,48px);margin-top:34px}
.mile b{display:block;font-family:var(--serif);font-weight:500;font-size:30px;line-height:1;color:var(--clay)}
.mile small{display:block;margin-top:6px;font-size:13px;color:rgba(35,36,31,.65)}
@media (max-width:860px){.story .grid{grid-template-columns:1fr}}

/* photo trio */
.trio{padding:0 0 clamp(90px,13vh,140px)}
.trio .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.6vw,18px)}
.trio figure{aspect-ratio:4/5;overflow:hidden;background:var(--stone)}
.trio img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
.trio figure:hover img{transform:scale(1.04)}
@media (max-width:640px){.trio .grid{grid-template-columns:1fr 1fr}.trio figure:last-child{display:none}}

/* schedule */
.day{background:#fff;border-top:1px solid var(--stone);border-bottom:1px solid var(--stone);padding:clamp(90px,13vh,140px) 0}
.day .caps{display:block;text-align:center;color:var(--clay);margin-bottom:10px}
.day h3{font-family:var(--serif);font-weight:500;font-size:clamp(32px,4.4vw,50px);text-align:center;margin-bottom:clamp(40px,6vh,60px)}
.day-list{max-width:680px;margin:0 auto}
.day-row{display:flex;align-items:baseline;gap:clamp(24px,5vw,60px);padding:22px 0;border-top:1px solid var(--stone)}
.day-row:last-child{border-bottom:1px solid var(--stone)}
.day-row .t{font-family:var(--serif);font-weight:500;font-size:clamp(24px,3.4vw,34px);min-width:3em;color:var(--ink)}
.day-row .e{font-size:16px;color:rgba(35,36,31,.85)}

/* details */
.details{padding:clamp(90px,13vh,140px) 0}
.details .grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,84px);max-width:1000px;margin:0 auto}
.details .caps{color:var(--clay)}
.details h3{font-family:var(--serif);font-weight:500;font-size:clamp(30px,4vw,46px);margin:12px 0 10px}
.details p{color:rgba(35,36,31,.8)}
.link-u{display:inline-block;margin-top:20px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--ink);padding-bottom:5px;transition:color .3s,border-color .3s}
.link-u:hover{color:var(--clay);border-color:var(--clay)}
.sw{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:24px;max-width:360px}
.sw i{display:block;height:84px}
.sw small{display:block;margin-top:7px;font-size:12px;color:rgba(35,36,31,.65)}
@media (max-width:820px){.details .grid{grid-template-columns:1fr}}

/* faq */
.faq-sec{padding:0 0 clamp(90px,13vh,140px)}
.faq-sec .caps{display:block;text-align:center;color:var(--clay);margin-bottom:10px}
.faq-sec h3{font-family:var(--serif);font-weight:500;font-size:clamp(32px,4.4vw,50px);text-align:center;margin-bottom:clamp(34px,5vh,50px)}
.faq{max-width:660px;margin:0 auto}
.faq details{border-top:1px solid var(--stone)}
.faq details:last-child{border-bottom:1px solid var(--stone)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 0;font-family:var(--serif);font-weight:500;font-size:clamp(18px,2.4vw,22px)}
.faq summary::-webkit-details-marker{display:none}
.faq .pl{position:relative;width:14px;height:14px;flex:none;transition:transform .4s var(--ease)}
.faq .pl::before,.faq .pl::after{content:"";position:absolute;background:var(--ink)}
.faq .pl::before{left:0;top:6px;width:14px;height:1px}
.faq .pl::after{left:6px;top:0;width:1px;height:14px}
.faq details[open] .pl{transform:rotate(45deg)}
.faq .a{padding:0 0 24px;color:rgba(35,36,31,.8);max-width:56ch}

/* rsvp on photo */
.rsvp-band{position:relative;padding:clamp(80px,12vh,130px) 20px;overflow:hidden}
.rsvp-band .bg{position:absolute;inset:0;background:#2C332C}
.rsvp-band .bg img{width:100%;height:100%;object-fit:cover}
.rsvp-band .veil{position:absolute;inset:0;background:rgba(22,26,21,.5)}
.card{position:relative;background:var(--cream);max-width:640px;margin:0 auto;padding:clamp(40px,6vw,68px) clamp(24px,6vw,60px)}
.card .caps{display:block;text-align:center;color:var(--clay);margin-bottom:8px}
.card h2{font-family:var(--serif);font-weight:500;font-size:clamp(32px,4.6vw,48px);text-align:center;line-height:1.12}
.card .dl{text-align:center;margin:12px 0 clamp(30px,4vh,42px);font-size:14px;color:rgba(35,36,31,.7)}
label.f{display:block;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:rgba(35,36,31,.6);margin:24px 0 2px}
input.f,select.f{width:100%;background:transparent;border:0;border-bottom:1px solid rgba(35,36,31,.3);border-radius:0;padding:12px 2px;font:inherit;color:var(--ink);transition:border-color .35s}
input.f:focus,select.f:focus{outline:none;border-bottom-color:var(--clay)}
input.f::placeholder{color:rgba(35,36,31,.35)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.chips{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
.chip{font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:.26em;text-transform:uppercase;padding:14px 24px;border:1px solid rgba(35,36,31,.35);background:transparent;color:var(--ink);cursor:pointer;transition:all .3s var(--ease)}
.chip.on{background:var(--ink);border-color:var(--ink);color:var(--cream)}
.send{margin-top:38px;text-align:center}
.note{margin-top:14px;text-align:center;font-size:13px;color:rgba(35,36,31,.55)}
#rsvp-done{display:none;text-align:center}
#rsvp-done .big{font-family:var(--serif);font-weight:500;font-size:clamp(26px,3.6vw,36px);line-height:1.2}
#rsvp-done p{margin-top:10px;color:rgba(35,36,31,.75)}
#rsvp-done .link-u{margin-top:24px}

/* footer */
footer{background:var(--ink);color:var(--cream);text-align:center;padding:64px 20px 54px}
footer .script{font-family:var(--script);font-size:26px;color:#D9C9BE}
footer .names{font-family:var(--serif);font-weight:500;font-size:22px;letter-spacing:.06em;margin-top:8px}
footer .cred{margin-top:26px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:rgba(250,247,241,.5)}
footer .cred a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(250,247,241,.35);padding-bottom:3px}

/* reveal */
.rv{opacity:0;transform:translateY(26px);transition:opacity .9s var(--ease),transform .9s var(--ease);transition-delay:var(--d,0s)}
.rv.in{opacity:1;transform:none}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .rv{opacity:1;transform:none;transition:none}
  .hero .bg img{animation:none;transform:none}
  .hero .down{animation:none}
}$fscss$,
     'editorHtml', $fshtml$<div class="topbar" id="topbar">
  <div class="links">
    <a href="#story">Історія</a>
    <a href="#day">Розклад</a>
    <a href="#place">Деталі</a>
    <a href="#faq">Питання</a>
  </div>
  <a class="mono" href="#top">С &amp; М · 10.10.26</a>
  <a class="rsvp-btn" href="#rsvp">RSVP</a>
</div>

<header class="hero" id="top">
  <div class="bg"><img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=2000&q=80" alt="Соломія та Марко на пагорбі" onerror="this.style.display='none'"></div>
  <div class="veil"></div>
  <div class="inner">
    <p class="script rv">ми одружуємось</p>
    <h1 class="rv" style="--d:.1s">Соломія <span class="amp">&amp;</span> Марко</h1>
    <p class="date rv" style="--d:.2s">10 . 10 . 26 &nbsp;·&nbsp; Львів</p>
    <p class="count rv" style="--d:.3s">до події <span id="dcount">96</span> днів</p>
  </div>
  <span class="down" aria-hidden="true"></span>
</header>

<section class="big-names">
  <div class="wrap">
    <span class="caps rv">запрошують на святкування свого весілля</span>
    <h2 class="rv" style="--d:.1s">Соломія <span class="amp">та</span> Марко</h2>
  </div>
</section>

<section class="story" id="story">
  <div class="wrap grid">
    <div class="arch rv">
      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80" alt="Наречені з букетом" loading="lazy" onerror="this.style.display='none'">
    </div>
    <div>
      <p class="lbl rv">наша <em>історія</em></p>
      <h3 class="rv" style="--d:.08s">Сім років, два міста і один собака по тому — ми збираємо всіх, кого любимо.</h3>
      <p class="rv" style="--d:.16s">Все почалося з випадкової кави на Вірменській. Потім були Київ і Львів, переїзди й повернення, пес Барні та тиха обіцянка в горах. Тепер ми хочемо сказати «так» уголос — і щоб ви були поруч.</p>
      <div class="mile rv" style="--d:.24s">
        <span><b>2019</b><small>кава на Вірменській</small></span>
        <span><b>2024</b><small>заручини в Карпатах</small></span>
        <span><b>2026</b><small>кажемо «так»</small></span>
      </div>
    </div>
  </div>
</section>

<section class="trio">
  <div class="wrap grid">
    <figure class="rv"><img src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?auto=format&fit=crop&w=1000&q=80" alt="У полі" loading="lazy" onerror="this.style.display='none'"></figure>
    <figure class="rv" style="--d:.1s"><img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80" alt="Руки з обручками" loading="lazy" onerror="this.style.display='none'"></figure>
    <figure class="rv" style="--d:.2s"><img src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80" alt="Разом" loading="lazy" onerror="this.style.display='none'"></figure>
  </div>
</section>

<section class="day" id="day">
  <div class="wrap">
    <span class="caps rv">10 жовтня 2026</span>
    <h3 class="rv" style="--d:.06s">Розклад дня</h3>
    <div class="day-list">
      <div class="day-row rv"><span class="t">15:30</span><span class="e">Збір гостей і вітальні напої</span></div>
      <div class="day-row rv" style="--d:.05s"><span class="t">16:00</span><span class="e">Церемонія в саду</span></div>
      <div class="day-row rv" style="--d:.1s"><span class="t">17:00</span><span class="e">Фуршет, ігристе та фотопрогулянка</span></div>
      <div class="day-row rv" style="--d:.15s"><span class="t">19:00</span><span class="e">Святкова вечеря і тости</span></div>
      <div class="day-row rv" style="--d:.2s"><span class="t">22:00</span><span class="e">Перший танець і танцпол до ночі</span></div>
    </div>
  </div>
</section>

<section class="details" id="place">
  <div class="wrap grid">
    <div class="rv">
      <span class="caps">Локація</span>
      <h3>Едем Резорт</h3>
      <p>с. Стрілки, Львівська область. О 14:45 від Оперного театру вирушить трансфер для гостей. Для тих, хто своїм авто, — паркінг на території.</p>
      <a class="link-u" href="https://maps.google.com/?q=Edem+Resort+Lviv+region" target="_blank" rel="noopener">Прокласти маршрут</a>
    </div>
    <div class="rv" style="--d:.12s">
      <span class="caps">Дрес-код</span>
      <h3>Garden formal</h3>
      <p>Приглушені відтінки природи — підказка в нашій палітрі:</p>
      <div class="sw">
        <span><i style="background:#7E8A72"></i><small>шавлія</small></span>
        <span><i style="background:#B7674B"></i><small>глина</small></span>
        <span><i style="background:#E5DFD2"></i><small>льон</small></span>
        <span><i style="background:#2E362D"></i><small>темний лист</small></span>
      </div>
    </div>
  </div>
</section>

<section class="faq-sec" id="faq">
  <div class="wrap">
    <span class="caps rv">Корисне</span>
    <h3 class="rv" style="--d:.06s">Часті питання</h3>
    <div class="faq rv" style="--d:.12s">
      <details>
        <summary>Чи можна прийти з дітьми?<span class="pl"></span></summary>
        <div class="a">Так, ми будемо раді малечі — на локації працюватиме дитяча кімната з аніматором протягом усього вечора.</div>
      </details>
      <details>
        <summary>Що подарувати?<span class="pl"></span></summary>
        <div class="a">Найкращий подарунок — ваша присутність. Якщо хочеться більшого, будемо вдячні за внесок у скарбничку нашої весільної подорожі.</div>
      </details>
      <details>
        <summary>Чи буде дощовий план?<span class="pl"></span></summary>
        <div class="a">Так. У разі негоди церемонія переїде під скляну оранжерею за двадцять кроків від саду — краса та сама, парасолі не знадобляться.</div>
      </details>
      <details>
        <summary>До котрої можна відповісти?<span class="pl"></span></summary>
        <div class="a">Просимо підтвердити присутність до 10 вересня 2026. Відповідь можна змінити, відкривши сайт ще раз.</div>
      </details>
    </div>
  </div>
</section>

<section class="rsvp-band" id="rsvp">
  <div class="bg"><img src="https://images.unsplash.com/photo-1563808599481-34a342e44508?auto=format&fit=crop&w=2000&q=80" alt="" loading="lazy" onerror="this.style.display='none'"></div>
  <div class="veil"></div>
  <div class="card">
    <span class="caps">rsvp</span>
    <h2>Будете з нами?</h2>
    <p class="dl">Дайте відповідь, будь ласка, до 10 вересня 2026.</p>

    <div id="rsvp-form">
      <label class="f" for="f-name">Ім’я та прізвище</label>
      <input class="f" id="f-name" type="text" autocomplete="name" placeholder="Оксана Коваль">

      <label class="f">Присутність</label>
      <div class="chips">
        <button type="button" class="chip on" id="att-yes">Так, буду</button>
        <button type="button" class="chip" id="att-no">На жаль, ні</button>
      </div>

      <div id="att-extra">
        <div class="two">
          <div>
            <label class="f" for="f-guests">Кількість гостей</label>
            <select class="f" id="f-guests"><option>1 гість</option><option>2 гості</option></select>
          </div>
          <div>
            <label class="f" for="f-menu">Меню</label>
            <select class="f" id="f-menu"><option>звичайне</option><option>вегетаріанське</option><option>дитяче</option></select>
          </div>
        </div>
        <label class="f" for="f-wish">Алергії або побажання</label>
        <input class="f" id="f-wish" type="text" placeholder="без горіхів">
        <label class="f" for="f-song">Пісня, під яку ви точно танцюєте</label>
        <input class="f" id="f-song" type="text" placeholder="ДахаБраха — Весна">
      </div>

      <div class="send"><button class="btn btn-solid" id="rsvp-go">Надіслати відповідь</button></div>
      <p class="note">Відповідь можна змінити до 10 вересня — відкрийте сайт ще раз.</p>
    </div>

    <div id="rsvp-done">
      <p class="big" id="done-title">Дякуємо!</p>
      <p id="done-sub">Вашу відповідь записано.</p>
      <a class="link-u" id="cal" target="_blank" rel="noopener"
         href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=%D0%92%D0%B5%D1%81%D1%96%D0%BB%D0%BB%D1%8F%20%D0%A1%D0%BE%D0%BB%D0%BE%D0%BC%D1%96%D1%97%20%D1%82%D0%B0%20%D0%9C%D0%B0%D1%80%D0%BA%D0%B0&dates=20261010T130000Z/20261010T210000Z&location=Edem%20Resort%2C%20Lviv%20region">Додати в календар</a>
    </div>
  </div>
</section>

<footer>
  <p class="script">з любов’ю,</p>
  <p class="names">Соломія та Марко</p>
  <p class="cred">створено на <a href="https://momently.co" target="_blank" rel="noopener">momently.co</a></p>
</footer>

<script>
(function(){
  var d = Math.max(0, Math.floor((new Date('2026-10-10T16:00:00+03:00') - Date.now())/86400000));
  var dc = document.getElementById('dcount'); if(dc) dc.textContent = d;

  var bar = document.getElementById('topbar');
  var hero = document.getElementById('top');
  new IntersectionObserver(function(es){
    bar.classList.toggle('on', !es[0].isIntersecting);
  }, {rootMargin:'-80px 0px 0px 0px'}).observe(hero);

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.14});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  var att = 'yes';
  var yes = document.getElementById('att-yes');
  var no  = document.getElementById('att-no');
  var extra = document.getElementById('att-extra');
  function paint(){
    yes.classList.toggle('on', att==='yes');
    no.classList.toggle('on', att==='no');
    extra.style.display = att==='yes' ? 'block' : 'none';
  }
  yes.onclick = function(){ att='yes'; paint(); };
  no.onclick  = function(){ att='no';  paint(); };
  paint();

  document.getElementById('rsvp-go').onclick = function(){
    var n = document.getElementById('f-name');
    if(!n.value.trim()){ n.style.borderBottomColor = '#A33B2B'; n.focus(); return; }
    var t1 = document.getElementById('done-title');
    var t2 = document.getElementById('done-sub');
    if(att === 'yes'){
      var g = document.getElementById('f-guests').value;
      var m = document.getElementById('f-menu').value;
      t1.textContent = 'Дякуємо, ' + n.value.trim() + '!';
      t2.textContent = 'Чекаємо на вас 10 жовтня · ' + g + ' · ' + m + ' меню.';
    } else {
      t1.textContent = 'Дякуємо за відповідь, ' + n.value.trim();
      t2.textContent = 'Шкода, що не побачимось — ви будете з нами подумки.';
      document.getElementById('cal').style.display = 'none';
    }
    document.getElementById('rsvp-form').style.display = 'none';
    document.getElementById('rsvp-done').style.display = 'block';
  };
})();
</script>$fshtml$
   ));
