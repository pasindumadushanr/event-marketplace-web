// Content adapter only. The three original stylesheets and animation scenes are
// kept intact. Staff content is inserted as text, never as executable HTML.
(() => {
  let started = false;
  const text = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  function configure(config) {
    if (started || !config || !config.content) return;
    started = true;
    window.__INVITATION_CONFIGURATION__ = config;
    const c = config.content;
    if (!config.demo) {
      const one = String(c.partnerOne || 'Your name');
      const two = String(c.partnerTwo || 'Your partner');
      const firstInitial = Array.from(one)[0] || '';
      const secondInitial = Array.from(two)[0] || '';
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) return;
        node.textContent = node.textContent.replace(/Amaya|Kasun/g, name => name === 'Amaya' ? one : two);
      });
      document.title = `${one} & ${two} — You’re invited`;
      document.querySelectorAll('.monogram').forEach(element => {
        element.replaceChildren(document.createTextNode(firstInitial));
        const amp = document.createElement('span'); amp.textContent = '&';
        element.append(amp,document.createTextNode(secondInitial));
      });
      const initials = document.querySelector('.crest-initials');
      const lastInitial = document.createElement('span'); lastInitial.textContent = secondInitial;
      initials.replaceChildren(document.createTextNode(firstInitial),lastInitial);
      const date = new Date(c.weddingAt);
      const valid = Number.isFinite(date.getTime());
      const parts = valid ? new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Asia/Colombo'}).formatToParts(date) : [];
      const part = key => parts.find(p => p.type === key)?.value || '—';
      const day = valid ? date.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Colombo'}) : 'Wedding date';
      const monthYear = valid ? date.toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'Asia/Colombo'}).toUpperCase() : 'TO BE CONFIRMED';
      const time = valid ? date.toLocaleTimeString('en-GB',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Colombo'}) : '';
      const weekday = valid ? date.toLocaleDateString('en-GB',{weekday:'long',timeZone:'Asia/Colombo'}).toUpperCase() : '';
      config.displayDate = day; config.displayTime = time;
      text('.sealed-date',`${day.toUpperCase()} · ${c.address || c.venue || ''}`);
      document.querySelectorAll('.date-stack span').forEach((element,index) => element.textContent = [part('day'),part('month'),part('year').slice(-2)][index]);
      text('.date-place',c.address || c.venue || '');
      text('.date-scene > .micro:last-child',`${weekday} · ${time}`);
      text('.date-line > span',part('day'));
      const dateLine = document.querySelector('.date-line > div');
      const small = document.createElement('small'); small.textContent = `${weekday} · ${time}`;
      dateLine.replaceChildren(document.createTextNode(monthYear),document.createElement('br'),small);
      text('.photo-badge span',`${part('day')}.${part('month')}.${part('year').slice(-2)}`);
      text('.hero-description',c.welcome || '');
      document.querySelector('.hero-description').style.whiteSpace = 'pre-line';
      text('.intro > p',c.story || c.welcome || '');
      text('.hero-footnote',`${c.address || c.venue || ''} ✧ A CELEBRATION OF LOVE`);
      text('.venue-copy h3',c.venue || 'Your venue');
      text('.venue-copy > p',c.address || '');
      document.querySelector('.venue-copy > p').style.whiteSpace = 'pre-line';
      document.querySelectorAll('.couple-photo,.photo-arch img,.venue-image img').forEach(image => {
        image.src = c.couplePhoto || 'assets/couple.jpg'; image.alt = `${one} & ${two}`;
      });
      const directions = document.querySelector('.venue-copy a');
      if (/^https:\/\//.test(c.mapUrl || '')) directions.href = c.mapUrl;
      else directions.hidden = true;
      // Do not invent a dress code or additional event times for a customer.
      document.querySelector('.dress-code').hidden = true;
      document.querySelectorAll('.timeline article .eyebrow').forEach((el,i) => el.textContent = [`${time} · OUR WEDDING`,'WITH OUR FAVORITE PEOPLE','A DAY TO REMEMBER'][i]);
      const titles = ['A promise of forever','A beautiful new beginning','Memories to treasure'];
      const descriptions = ['Join us to celebrate this special chapter.','Nothing would mean more than having you beside us.','We look forward to sharing our day with you.'];
      document.querySelectorAll('.timeline article').forEach((el,i) => {el.querySelector('h3').textContent=titles[i];el.querySelector('p').textContent=descriptions[i];});
      text('.rsvp-intro > p','Your presence would make our day. Please let us know whether you can join us.');
      document.querySelector('.demo-label').hidden = true;
      text('.rsvp-intro .small-note','Your reply opens in WhatsApp. Please send the message there to confirm attendance.');
      const phone=String(c.rsvpPhone || '').replace(/\D/g,'');
      if (/^[1-9]\d{6,14}$/.test(phone)) {
        const link=document.createElement('a');link.className='text-link';link.textContent='RSVP on WhatsApp ↗';link.target='_blank';link.rel='noopener noreferrer';
        link.href=`https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I would like to RSVP for ${one} & ${two}'s wedding.`)}`;
        document.querySelector('.rsvp-intro').append(link);
      }
      text('#rsvp-form button[type="submit"]','Continue on WhatsApp ↗');
      text('.closing > p',`${day.toUpperCase()} ✧ ${c.venue || ''}`);
      text('footer span:last-child','Created with Nakathata.lk');
      if (config.preview) {
        document.querySelector('#share-invite').hidden = true;
        const note = document.createElement('p'); note.className='small-note';
        note.textContent='Private draft preview — not the published invitation.';
        document.querySelector('.rsvp-intro').append(note);
      }
      if (Array.isArray(c.gallery) && c.gallery.length) {
        const section = document.createElement('section'); section.className='section original-gallery';
        section.setAttribute('aria-label','Our photos');
        c.gallery.forEach((src,i) => {const image=document.createElement('img');image.src=src;image.alt=`Our photo ${i+1}`;image.loading='lazy';section.append(image);});
        document.querySelector('#rsvp').before(section);
        const style=document.createElement('style');style.textContent='.original-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.original-gallery img{width:100%;height:300px;object-fit:cover}@media(max-width:600px){.original-gallery{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.original-gallery img{height:220px}}';document.head.append(style);
      }
      if (!c.music) document.querySelector('#sound-toggle').hidden = true;
    }
    const script = document.createElement('script'); script.src='app.js';
    script.onload=() => {document.body.style.visibility='visible';document.body.dataset.invitationReady='true';};
    document.body.append(script);
  }
  window.addEventListener('message',event => {
    if (event.source !== parent || event.origin !== new URL(document.baseURI).origin || event.data?.type !== 'nakathata:invitation-content') return;
    configure(event.data);
  });
  parent.postMessage({type:'nakathata:invitation-ready'},new URL(document.baseURI).origin);
})();
