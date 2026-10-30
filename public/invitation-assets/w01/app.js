const cover = document.querySelector('#cover');
const invitation = document.querySelector('#invitation');
const configuration = window.__INVITATION_CONFIGURATION__;
const customer = configuration.content;
const isDemo = configuration.demo;
const coupleNames = isDemo ? 'Amaya and Kasun' : `${customer.partnerOne} and ${customer.partnerTwo}`;
const params = new URLSearchParams(location.search);
const guest = configuration.guest || params.get('to');
if (guest) document.querySelector('#cover-guest').textContent = guest.slice(0, 100);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let sceneTimers = [];
let isPlaying = false;
function cancelScenes() { sceneTimers.forEach(clearTimeout); sceneTimers = []; }
function setScene(scene) {
  cover.dataset.scene = scene;
  document.querySelectorAll('.scene').forEach(el => {
    const active = el.classList.contains(`${scene}-scene`);
    el.setAttribute('aria-hidden', String(!active)); el.inert = !active;
  });
  document.querySelector('.sealed-content').inert = scene !== 'sealed';
  document.querySelectorAll('.scene-progress i').forEach((el, index) => el.classList.toggle('active', index === ['photo', 'date', 'crest'].indexOf(scene)));
  document.querySelector('#scene-status').textContent = ({sealed:'Touch the seal to open your invitation.',photo:`${coupleNames} are getting married.`,date:isDemo ? 'Save the date. 18 September 2027. Colombo, Sri Lanka.' : `Save the date. ${configuration.displayDate || ''}. ${customer.venue || ''}.`,crest:'We can’t wait to celebrate with you. Explore our wedding below.'})[scene];
}
function openDetails() {
  cancelScenes(); isPlaying = false;
  invitation.inert = false; cover.classList.add('opened');
  document.querySelector('.monogram').focus({ preventScroll: true });
  sceneTimers.push(setTimeout(() => { cover.hidden = true; }, reducedMotion.matches ? 0 : 1000));
  stopMusic();
}
document.querySelector('#open-invitation').addEventListener('click', () => {
  if (isPlaying) return;
  isPlaying = true;
  document.querySelector('#skip-intro').focus({ preventScroll: true });
  setScene(reducedMotion.matches ? 'crest' : 'photo');
  if (!reducedMotion.matches) {
    sceneTimers.push(setTimeout(() => setScene('date'), 6500));
    sceneTimers.push(setTimeout(() => setScene('crest'), 12000));
  }
});
document.querySelector('#view-invitation').addEventListener('click', openDetails);
document.querySelector('#skip-intro').addEventListener('click', openDetails);
document.querySelector('#replay').addEventListener('click', () => {
  cancelScenes(); isPlaying = false;
  scrollTo({ top: 0, behavior: 'instant' });
  cover.hidden = false; cover.classList.remove('opened');
  invitation.inert = true; setScene('sealed');
  document.querySelector('#open-invitation').focus();
});
setScene('sealed');
// A quiet original ambient melody, played only when the guest switches sound on.
let audioContext; let musicTimer; let musicEnabled = false; let masterGain;
function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null; musicEnabled = false;
  if (masterGain && audioContext) masterGain.gain.setTargetAtTime(0, audioContext.currentTime, .2);
  const button = document.querySelector('#sound-toggle'); button.textContent = 'Sound off ♫'; button.setAttribute('aria-pressed', 'false');
}
async function startMusic() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    masterGain ||= audioContext.createGain(); masterGain.connect(audioContext.destination);
    masterGain.gain.setTargetAtTime(.12, audioContext.currentTime, .3);
    musicEnabled = true;
    let step = 0; const notes = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];
    function playNote() {
      if (!musicEnabled || document.hidden) return;
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = notes[step++ % notes.length];
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(.5, now + .025); gain.gain.exponentialRampToValueAtTime(.001, now + 2.6);
      oscillator.connect(gain); gain.connect(masterGain); oscillator.start(now); oscillator.stop(now + 2.7);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }
    playNote(); musicTimer = setInterval(playNote, 850);
    document.querySelector('#sound-toggle').textContent = 'Sound on ♫'; document.querySelector('#sound-toggle').setAttribute('aria-pressed', 'true');
  } catch { document.querySelector('#sound-toggle').textContent = 'Sound unavailable'; }
}
document.querySelector('#sound-toggle').addEventListener('click', () => musicEnabled ? stopMusic() : startMusic());
document.addEventListener('visibilitychange', () => { if (document.hidden) stopMusic(); });
const weddingDate = new Date(isDemo ? '2027-09-18T16:00:00+05:30' : customer.weddingAt);
function tick() {
  const left = Number.isFinite(weddingDate.getTime()) ? Math.max(0, Math.floor((weddingDate - Date.now()) / 1000)) : 0;
  const values = [Math.floor(left / 86400), Math.floor(left / 3600) % 24, Math.floor(left / 60) % 60, left % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => document.getElementById(id).textContent = String(values[i]).padStart(2, '0'));
  if (!left) document.querySelector('#countdown-note').textContent = 'Our forever has begun.';
}
tick(); setInterval(tick, 1000);
const form = document.querySelector('#rsvp-form');
const status = document.querySelector('#rsvp-status');
const storageKey = 'amaya-kasun-demo-rsvp';
function updateParty() { const no = form.elements.attending.value === 'no'; document.querySelector('#party-field').hidden = no; form.elements.guests.disabled = no; }
form.addEventListener('change', updateParty);
try {
  const previous = isDemo ? JSON.parse(localStorage.getItem(storageKey)) : null;
  if (previous && typeof previous.name === 'string') {
    form.elements.name.value = previous.name;
    form.elements.attending.value = previous.attending === 'no' ? 'no' : 'yes';
    form.elements.guests.value = String(previous.guests || 1);
    form.elements.message.value = previous.message || '';
    status.textContent = 'Your sample response is saved on this device. You can update it below.';
  }
} catch { /* The demo remains usable if browser storage is unavailable. */ }
if (guest && !form.elements.name.value) form.elements.name.value = guest.slice(0, 100);
updateParty();
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  if (!name) { form.elements.name.setCustomValidity('Please enter your name.'); form.elements.name.reportValidity(); return; }
  const data = { name, attending: form.elements.attending.value, guests: form.elements.attending.value === 'yes' ? Number(form.elements.guests.value) : 0, message: form.elements.message.value.trim() };
  if (!isDemo) {
    const number = String(customer.rsvpPhone || '').replace(/\D/g,'');
    if (!/^[1-9]\d{6,14}$/.test(number)) { status.textContent='Please contact the couple directly to RSVP.'; return; }
    const reply=`RSVP for ${customer.partnerOne} & ${customer.partnerTwo}: ${data.name} ${data.attending === 'yes' ? `joyfully accepts (${data.guests} guests)` : 'regretfully declines'}.${data.message ? ` ${data.message}` : ''}`;
    const link=document.createElement('a');link.href=`https://wa.me/${number}?text=${encodeURIComponent(reply)}`;link.target='_blank';link.rel='noopener noreferrer';link.className='text-link';link.textContent='Open WhatsApp to send your reply ↗';
    status.replaceChildren(document.createTextNode('Your reply is ready. Please send it in WhatsApp. '),link);
    link.click();return;
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    status.textContent = data.attending === 'yes' ? `Thank you, ${name}! Your sample response for ${data.guests} ${data.guests === 1 ? 'guest' : 'guests'} is saved on this device. No message was sent.` : `Thank you, ${name}. Your sample reply is saved on this device. No message was sent.`;
  } catch { status.textContent = `Thank you, ${name}! Your sample reply was received on this page, but your browser could not save it. No message was sent.`; }
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
document.querySelector('#share-invite').addEventListener('click', async () => {
  const shareStatus = document.querySelector('#share-status');
  try {
    if (navigator.share) await navigator.share({ title: isDemo ? 'Amaya & Kasun — You’re invited' : `${customer.partnerOne} & ${customer.partnerTwo} — You’re invited`, text: 'Join us for a beautiful new beginning.', url: configuration.url });
    else { await navigator.clipboard.writeText(configuration.url); shareStatus.textContent = 'Invitation link copied. Paste it into your WhatsApp message.'; }
  } catch (error) { if (error.name !== 'AbortError') shareStatus.textContent = 'Copy the link from your address bar to share this invitation.'; }
});
document.querySelector('#download-card').addEventListener('click', async () => {
  try {
    await document.fonts.ready;
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const flowers = new Image(); flowers.src = 'assets/calla-lilies.jpg'; await flowers.decode();
    ctx.fillStyle = '#36382c'; ctx.fillRect(0, 0, 1080, 1350);
    const cropHeight = flowers.width * 1350 / 1080;
    ctx.drawImage(flowers, 0, (flowers.height - cropHeight) / 2, flowers.width, cropHeight, 0, 0, 1080, 1350);
    ctx.fillStyle = '#22261988'; ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = '#ded2ad'; ctx.lineWidth = 2; ctx.strokeRect(46, 46, 988, 1258); ctx.strokeRect(58, 58, 964, 1234);
    ctx.beginPath(); ctx.ellipse(540, 655, 385, 520, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#eee5ce';
    ctx.font = '20px "DM Sans", sans-serif'; ctx.fillText('TOGETHER WITH OUR FAMILIES', 540, 310);
    ctx.fillStyle = '#eee5ce'; ctx.font = '140px "Great Vibes", cursive'; ctx.fillText(isDemo ? 'Amaya' : customer.partnerOne, 540, 510, 850);
    ctx.fillStyle = '#d1c5a7'; ctx.font = 'italic 84px "Cormorant Garamond", Georgia'; ctx.fillText('&', 540, 610);
    ctx.fillStyle = '#eee5ce'; ctx.font = '140px "Great Vibes", cursive'; ctx.fillText(isDemo ? 'Kasun' : customer.partnerTwo, 540, 740, 850);
    ctx.font = 'italic 35px "Cormorant Garamond", Georgia'; ctx.fillText('invite you to celebrate their wedding', 540, 830);
    ctx.fillStyle = '#eee5ce'; ctx.font = '23px "DM Sans", sans-serif'; ctx.fillText(isDemo ? '18 SEPTEMBER 2027 · 4:00 PM' : `${configuration.displayDate} · ${configuration.displayTime}`.toUpperCase(), 540, 940, 920);
    ctx.font = '21px "DM Sans", sans-serif'; ctx.fillText(isDemo ? 'THE KINGSBURY · COLOMBO' : `${customer.venue} · ${customer.address}`.toUpperCase(), 540, 990, 920);
    ctx.font = 'italic 30px "Cormorant Garamond", Georgia'; ctx.fillText('A beautiful beginning. Better with you.', 540, 1100);
    if (isDemo) { ctx.font = '15px "DM Sans", sans-serif'; ctx.fillText('SAMPLE INVITATION', 540, 1240); }
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Image export unavailable');
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'wedding-invitation.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    document.querySelector('#share-status').textContent = 'Your card is ready. Attach the downloaded image in WhatsApp and paste the invitation link in your message.';
  } catch { document.querySelector('#share-status').textContent = 'The card could not be downloaded in this browser. Please try again in a regular browser.'; }
});
