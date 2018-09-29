import { UI } from './ui.mjs';
import { cls, UISelectors } from './consts.mjs';
import { Simon } from  './simon.mjs';
import { Sound } from './sound.mjs';

const app = (function(){

   let gameOn = false;
   let running = false;
   let strictMode = false;
   let buttonsLocked = true;

   let currentGameBtnId = -1;

   function LoadEvents(){
      document.querySelector(UISelectors.controls).addEventListener('click',(e)=>{
         if(e.target.parentElement.className === cls.on_ofBtn || e.target.className === cls.on_ofBtn){
            OnOf();
         } else if(gameOn && e.target.classList.contains(cls.cBtn)){
            HandleCbtnClick(e.target);
         }
      });
      document.querySelector(UISelectors.gameButtons).addEventListener('mousedown',(e)=>{
         if(!buttonsLocked && e.target.className === cls.gameBtn){
            currentGameBtnId = parseInt(e.target.dataset.id);
            UI.ActivateButton(currentGameBtnId);
            const wrong = Simon.Wrong(currentGameBtnId);
            if(wrong){
               ClearAnswerInterval();
               ResetBtnClicks();
               LockGameButtons();
               const id = currentGameBtnId;
               ResetCurrentGameBtnId();
               UI.SetCount('!!');
               UI.FlashCount();
               Sound.PlayMistakeSound(()=>{
                  UI.DeactivateButton(id);
                  HandleMistake();
               });
            } else
               Sound.PlayNote(currentGameBtnId);
         }
      });
      document.addEventListener('mouseup',()=>{
         if(currentGameBtnId !== -1){
            UI.DeactivateButton(currentGameBtnId);
            Sound.StopNote();
            ResetCurrentGameBtnId();
            HandleGameBtnClick();
         }
      });
      
   }

   function OnOf(){
      // Call UI METHOD
      // DO LOGIC
      gameOn = !gameOn;
      UI.OnOfToggle(gameOn);
      UI.CountToggle(gameOn);
      if(gameOn === false){
         TurnOf();
      }
   }

   function TurnOf(){
      ResetGame();
      running = false;
      if(strictMode)
         ToggleStrictMode();
   }

   function HandleCbtnClick(el_cbtn){
      // see which cbtn was clicked and handle logic
      const startBtn = (el_cbtn.classList.contains(cls.startBtn))? true: false;
      if(startBtn){
         StartGame();
      } else {
         ToggleStrictMode();
      }
   }

   function StartGame(){
      if(running){
         ResetGame();
      } else
         running = true;
      HandleGame();
   }

   function ResetGame(){
      clearTimeout(lighUpTimeout);
      clearTimeout(betweenSimonSaysTimeout);
      clearTimeout(gameOverTimeOut);
      clearTimeout(gameDelayTimeOut);
      clearTimeout(mistakeTimeout);
      ClearAnswerInterval();
      UI.DeactivateAllButtons();
      UI.StopFlashCount();
      UI.ResetCount();
      if(Sound.IsPlaying){
         Sound.StopNote();
      }
      Simon.Reset();
      ResetBtnClicks();
      ResetGameOverIterator();
      LockGameButtons();
   }

   function ToggleStrictMode(){
      if(running)
         return;
      console.log('StrictMode');
      UI.StrictModeToggle();
      strictMode = !strictMode;
   }

   function LockGameButtons(){
      buttonsLocked = true;
      UI.ToggleGameBtnsLock(buttonsLocked);
   }

   function UnlockGameButtons(){
      buttonsLocked = false;
      UI.ToggleGameBtnsLock(buttonsLocked);
   }

   function ResetBtnClicks(){
      btnClicks = 0;
   }

   function ResetCurrentGameBtnId(){
      currentGameBtnId = -1;
   }
 
   let handleGameDelay = 800;
   let gameDelayTimeOut;
   function HandleGame(){
      gameDelayTimeOut = setTimeout(() => {
         Simon.NewWord();
         UI.SetCount(Simon.GetLength());
         console.log('Simon Says');
         SimonSays();
      }, handleGameDelay);
   }

   const TIMETOANSWER = 3000;
   let timeToAnswer = TIMETOANSWER;
   let answerInterval;
   const answerTicks = 500;
   function SimonSays(){
      const word = Simon.Says();
      if(!word.done){
         console.log(word.value);
         HandleGameBtn(word.value,SimonSays);
      }
      else{
         Simon.ResetIterator();
         UnlockGameButtons();

         answerInterval = setInterval(()=>{
            timeToAnswer -= answerTicks;
            if(timeToAnswer === 0){
               console.log('Time\'s up');
               TimesUp();
            }
         },500);
      }
   }

   function TimesUp(){
      UI.SetCount('!!');
      UI.FlashCount();
      ClearAnswerInterval();
      // play mistake sound
      UI.DeactivateAllButtons();
      ResetCurrentGameBtnId();
      ResetBtnClicks();
      LockGameButtons();
      if(Sound.IsPlaying()){
         Sound.StopNote(()=>{
            Sound.PlayMistakeSound(HandleMistake);
         });
      }else{
         Sound.PlayMistakeSound(HandleMistake);
      }
   }

   let mistakeTimeout;
   function HandleMistake(){  
      let fToCall;
      if(strictMode){
         Simon.Reset();
         UI.ResetCount();
         fToCall = HandleGame;
      } else{
         Simon.ResetIterator();
         UI.SetCount(Simon.GetLength());
         fToCall = SimonSays;
      }
      mistakeTimeout = setTimeout(() => {
         fToCall();
      }, 2000);
   }

   let btnClicks = 0;
   let gameOverTimeOut;
   function HandleGameBtnClick(){
      btnClicks ++;
      ResetTimeToAnswer();
      if(btnClicks === Simon.GetLength()){
         HandleCorrect();
      }
   }

   function HandleCorrect(){
      LockGameButtons();
      ResetBtnClicks();
      ClearAnswerInterval();
      if (Simon.GameOver()) {
         GameOver();
         return;
      } else {
         Simon.ResetIterator();
         HandleGame();
      }
   }

   function ClearAnswerInterval(){
      clearInterval(answerInterval);
      ResetTimeToAnswer();
   }

   function ResetTimeToAnswer(){
      timeToAnswer = TIMETOANSWER;
   }


   const lighUpDurations = [750, 600, 450, 300];
   function GetLightUpDuration(){
      const count = Simon.GetLength();
      if(count <= 5){
         return lighUpDurations[0];
      } else if (count <= 10){
         return lighUpDurations[1];
      }else if(count <= 15){
         return lighUpDurations[2];
      } else if(count <= 20){
         return lighUpDurations[3];
      }
   }

   const timeBetweenSimonSays = 300;

   let lighUpTimeout;
   let betweenSimonSaysTimeout;

   function HandleGameBtn(id,callback){
      // Activate the button
      UI.ActivateButton(id);
      Sound.PlayNote(id);
      // After btnLightUpDuration
      const lightUpDuration = GetLightUpDuration();
      lighUpTimeout = setTimeout(() => {
         // Deactivate the button
         UI.DeactivateButton(id);
         Sound.StopNote();
         if(callback)
            // After timeBetweenSimonSays call the callback function
            // Which is SimonSays function that will tell the next simon word
            betweenSimonSaysTimeout = setTimeout(() => {
               callback(); 
            }, timeBetweenSimonSays);
      }, lightUpDuration);
   }

   let iterator = 0;
   function ResetGameOverIterator(){
      iterator = 0;
   }

   function GameOverEffect(){
      if(iterator > 3){
         UI.ResetCount();
         HandleGame();
         ResetGameOverIterator();
         return;
      }
      HandleGameBtn(iterator,GameOverEffect);
      iterator++;
   }

   function GameOver(){
      Simon.Reset();
      UI.SetCount('**');
         gameOverTimeOut = setTimeout(() => {
            GameOverEffect();
         }, 500);
   }

   //public
   return {
      Init: function(){
         LoadEvents();
      }
   }
})();

app.Init();










