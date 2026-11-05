const menu=document.querySelector('.menu');
const mobileNav=document.querySelector('#mobile-nav');
const toggles=[...document.querySelectorAll('.about-toggle')];
const closeTimers=new Map();
function cancelClose(button){clearTimeout(closeTimers.get(button));closeTimers.delete(button);}
function setDropdown(button,open){cancelClose(button);button.setAttribute('aria-expanded',String(open));document.getElementById(button.getAttribute('aria-controls')).hidden=!open;}
function closeDropdowns(){toggles.forEach(button=>setDropdown(button,false));}
function closeMenu(){menu.setAttribute('aria-expanded','false');mobileNav.hidden=true;menu.textContent='Menu';closeDropdowns();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobileNav.hidden=!open;menu.textContent=open?'Close':'Menu';if(!open)closeDropdowns();});
toggles.forEach(button=>{
 const dropdown=button.closest('.about-dropdown');
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';closeDropdowns();setDropdown(button,open);});
 button.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();closeDropdowns();setDropdown(button,true);dropdown.querySelector('.about-links a').focus();}});
 dropdown.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&window.matchMedia('(min-width:761px) and (hover:hover)').matches){closeDropdowns();setDropdown(button,true);}});
 dropdown.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){cancelClose(button);closeTimers.set(button,setTimeout(()=>{if(!dropdown.contains(document.activeElement))setDropdown(button,false);},220));}});
});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!event.target.closest('.about-dropdown'))closeDropdowns();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){const active=toggles.find(b=>b.getAttribute('aria-expanded')==='true');if(active){closeDropdowns();active.focus();}else if(!mobileNav.hidden){closeMenu();menu.focus();}}});
document.addEventListener('focusin',event=>{if(!event.target.closest('.about-dropdown'))closeDropdowns();});
window.matchMedia('(max-width:760px)').addEventListener('change',closeMenu);

// Contact form: delivery is enabled only once an endpoint is configured.
const conversationForm=document.querySelector('.conversation-form');
if(conversationForm){
 const panel=document.querySelector('.conversation-panel');
 const opener=document.querySelector('.conversation-open');
 const fallback=document.querySelector('.contact-email-fallback');
 const status=conversationForm.querySelector('.form-status');
 const send=conversationForm.querySelector('[type="submit"]');
 let sending=false;
 opener.hidden=false;fallback.hidden=true;
 function closeConversation(){panel.hidden=true;opener.setAttribute('aria-expanded','false');opener.focus();}
 opener.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;opener.setAttribute('aria-expanded',String(open));if(open)conversationForm.querySelector('input').focus();});
 conversationForm.querySelector('.form-close').addEventListener('click',closeConversation);
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();closeConversation();}});
 conversationForm.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;
  const endpoint=conversationForm.dataset.endpoint;
  if(!endpoint){status.textContent='This form is not accepting messages yet. Please email hello@maavglobal.com.';status.focus();return;}
  if(!conversationForm.reportValidity())return;
  sending=true;send.disabled=true;send.textContent='Sending…';conversationForm.setAttribute('aria-busy','true');status.textContent='';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch(endpoint,{method:'POST',body:new FormData(conversationForm),headers:{Accept:'application/json'},signal:controller.signal});
   if(!response.ok)throw new Error('Submission failed');
   conversationForm.reset();status.textContent='Thank you. Your message has been sent. We’ll be in touch.';
  }catch(error){status.textContent=error.name==='AbortError'?'We couldn’t confirm delivery. Please email hello@maavglobal.com before trying again.':'Your message could not be sent. Please try again or email hello@maavglobal.com.';}
  finally{clearTimeout(timeout);sending=false;send.disabled=false;send.textContent='Send message';conversationForm.removeAttribute('aria-busy');status.focus();}
 });
}
