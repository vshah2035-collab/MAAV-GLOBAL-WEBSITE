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
