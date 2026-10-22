const menu = document.querySelector('.menu');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');mobileNav.hidden=true;menu.textContent='Menu'}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobileNav.hidden=!open;menu.textContent=open?'Close':'Menu'});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileNav.hidden){closeMenu();menu.focus()}});
