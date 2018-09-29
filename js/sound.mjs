export const Sound = (function(){
   // values in Hz
   const notes = [330,350,370,390];
   
   let playing;
   const stopTime = 0.03;

   window.AudioContext = window.AudioContext || window.webkitAudioContext;
   const ctx = new AudioContext();
   const gainNode = ctx.createGain();
   let oscilator;
   let mistakeTimeout;
   const mistakeDuration = 800;
   
   function MistakeNote(){
      playing = true;
      gainNode.gain.value = 0.15;
      oscilator = ctx.createOscillator();
      oscilator.type = 'sawtooth';
      oscilator.frequency.value = 100;
      oscilator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscilator.start(0);
   }

   return {
      PlayNote: function(id){
         playing = true;
         gainNode.gain.value = 0.3;
         oscilator = ctx.createOscillator();
         oscilator.type = 'sine';
         oscilator.frequency.value = notes[id];
         oscilator.connect(gainNode);
         gainNode.connect(ctx.destination);
         oscilator.start(0);
      },
      IsPlaying: function(){
         return playing;
      },
      StopNote: function(callback){
         gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime); 

         gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + stopTime);
         oscilator.stop(ctx.currentTime + stopTime);
         setTimeout(() => {
            if(callback)
               callback();
               clearTimeout(mistakeTimeout)
            },(stopTime+0.01)*1000); // litle extra time after the finish
         playing = false;
      },
      PlayMistakeSound: function(callback){
         MistakeNote();
         mistakeTimeout = setTimeout(() => {
            this.StopNote(callback);
         }, mistakeDuration);
      }
   }
})();