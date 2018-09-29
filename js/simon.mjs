import { btnId } from './consts.mjs';

export const Simon = (function(){
   const btnIds= Object.values(btnId);
   const simon = [];
   const prevNumbers = []

   const winCount = 20;

   function randomIntFromInterval(min,max){
       return Math.floor(Math.random()*(max-min+1)+min);
   }

   function ThreeInARow(){
      for(let i=0; i<prevNumbers.length; i++){
         if(i === prevNumbers.length-1){
            // console.log('Trice');
            return prevNumbers[i];
         }
         if(prevNumbers[i] !== prevNumbers[i+1])
            return -1;
      }
   }


   let nextIndex = 0;
   function WordIterator(words){
      return {
         next: function(){
            return (nextIndex < words.length)? { value: words[nextIndex++], done: false} :
            {done: true} 
         }
      }   
   }

   function GetIndex(){
      let index = randomIntFromInterval(0,3);
      if(prevNumbers.length === 3){
         // check to se if all 3 are the same
         const n = ThreeInARow(); 
         while(index === n){
            index = randomIntFromInterval(0,3);
         }
         prevNumbers.shift();
      }
      prevNumbers.push(index);
      return index;
   }
   return {
      NewWord: function(){
         const index = GetIndex();
         simon.push(btnIds[index]);
      },
      Says(){
         const word = WordIterator(simon).next();
         return word;
      },
      GetLength(){
         return simon.length;
      },
      ResetIterator: function(){
         nextIndex = 0;
      },
      Wrong: function(clickedButtonId){
         const word = WordIterator(simon).next().value;
         return (word === clickedButtonId)? false: true;
      },
      ResetSimon: function(){
         simon.splice(0,simon.length);
      },
      Reset: function(){
         this.ResetSimon();
         this.ResetIterator();
      },
      GameOver: function(){
         return (simon.length===winCount)? true: false;
      }
   }
})();

