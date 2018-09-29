import { cls, UISelectors } from './consts.mjs';
import { GameButton } from './game-button.mjs';
export const UI = (function(){

   const strictModeLamp = {
      on: false,
      onColor: 'red',
      offColor: 'darkred'
   }

   const countDisplay = {
      onOpacity: 1,
      offOpacity: 0.4
   }

   const gameBtns = [
      new GameButton('darkgreen','lightgreen'),
      new GameButton('darkred','red'),
      new GameButton('darkgoldenrod','yellow'),
      new GameButton('darkblue','blue')
   ]


   const el_toggle = document.querySelector(UISelectors.toggle);
   const el_strictIndicator = document.querySelector(UISelectors.strictIndicator);
   const el_count = document.querySelector(UISelectors.count)
   const el_gameButtonsContainer = document.querySelector(UISelectors.gameButtons);
   const el_gameBtns = Array.from(el_gameButtonsContainer.children);

   let flashTimeout;

   //public
   return{
      OnOfToggle: function(on){
         // Add and remove toggle class
         el_toggle.className = (on)? cls.toggle: '';
      },
      StrictModeToggle: function(){
         const color = (strictModeLamp.on)? strictModeLamp.offColor : strictModeLamp.onColor;
         el_strictIndicator.style.backgroundColor = color; 
         strictModeLamp.on = !strictModeLamp.on;
      },
      CountToggle: function(on){
         const textOpacity = (on)? countDisplay.onOpacity: countDisplay.offOpacity;
         el_count.style.opacity = textOpacity;
         countDisplay.on = !countDisplay.on;
      },
      ActivateButton: function(id){
         const button = gameBtns[id];
         const el_button = el_gameBtns[id];
         el_button.style.backgroundColor = button.lightColor;
      },
      DeactivateButton: function(id){
         const button = gameBtns[id];
         const el_button = el_gameBtns[id];
         el_button.style.backgroundColor = button.darkColor;
      },
      DeactivateAllButtons: function(){
         for(let i=0; i<el_gameBtns.length; i++){
            el_gameBtns[i].style.backgroundColor = gameBtns[i].darkColor;
         }
      },
      SetCount: function(value){
         el_count.textContent = value;
      },
      ResetCount: function(){
         el_count.textContent = '--';
      },
      FlashCount: function(callback){
         el_count.classList.add(cls.flash);
         const compStyle = window.getComputedStyle(el_count,null);
         const animDuration = parseFloat(compStyle.getPropertyValue('animation-duration'));
         console.log('ANimDuration', animDuration);
         const animItCount = parseInt(compStyle.getPropertyValue('animation-iteration-count'));
         console.log('AnimItCount',animItCount);
         flashTimeout = setTimeout(() => {
            console.log('End of animation');
            this.StopFlashCount();
            if(callback)
               callback();
         }, (animDuration*animItCount)*1000);
      },
      StopFlashCount: function(){
         clearTimeout(flashTimeout);
         el_count.classList.remove(cls.flash);
      },
      ToggleGameBtnsLock: function(locked){
         if(locked)
            el_gameButtonsContainer.classList.remove(cls.btnHvr);
         else
            el_gameButtonsContainer.classList.add(cls.btnHvr);
      }
   }
})();




