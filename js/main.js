(()=>{
    var draggables = [];
    var draggablesClone = [];
    let attempts = 0;
    let correct = 0;
    let bestScore = "n/a";
    let previous;
  
    let answerRow = document.querySelector("#answers");
    let answers;
    
    document.querySelector("#restartGame").addEventListener("click", e=>{
      !answerRow.classList.contains("hideAnswers") && answerRow.classList.add("hideAnswers");
      
      resetState();
    });
    
    document.querySelector("#checkAnswers").addEventListener("click", e=>{
      let total = answers.length;    
      
      attempts++;
      correct = checkAnswers();
      
      if(correct == total){
        console.log(bestScore=="n/a" || bestScore > correct)
        if(bestScore=="n/a" || bestScore > correct) bestScore = correct;
        if(answerRow.classList.contains("hideAnswers")) {
          answerRow.classList.remove("hideAnswers");
        } 
      }else{
        if(!answerRow.classList.contains("hideAnswers")) {
          answerRow.classList.add("hideAnswers");
        } 
      }
      
      updateScores();
    });
    
    function init(){
      document.querySelectorAll("#guess .col").forEach((e)=>{
        e.addEventListener("drop", dropped);
        e.addEventListener("dragover", dragOver);
        e.addEventListener("dragenter", dragEnter);
      })
      
      resetState();
    }
    
    function resetState(){
      attempts = 0;
      correct = 0;
  
      createSet();
      shuffle();
      updateScores();
    }
  
    function shuffle(){    
      draggablesClone = [...draggables].map(e=>{
        return e.cloneNode(true);
      });
      
      draggablesClone = draggablesClone.map((e,i)=>{
        e.setAttribute('id', "answer-"+i);
        e.classList.add('noDrag');
        return e;
      })
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
      
      document.querySelectorAll("#guess .col").forEach((e,i)=>e.appendChild(draggables[i]))
      document.querySelectorAll("#answers .col").forEach((e,i)=>e.appendChild(draggablesClone[i])); 
      
      answers = document.querySelectorAll("#answers .col .dragme");
      
      if(checkAnswers(answers)>0)resetState();
    }
  
    function checkAnswers(){    
      let matches = 0;
  
      document.querySelectorAll("#guess .col .dragme").forEach((e,i)=>{
        if(e.dataset.val ==  answers[i].dataset.val) matches++;
      });
      
      return matches;
    }
    
    function createSet(){
      draggables = [];
      
      document.querySelectorAll("#guess .col").forEach(e=>e.innerHTML = "")
      document.querySelectorAll("#answers .col").forEach(e=>e.innerHTML = "")
      document.querySelectorAll("#guess .col").forEach((e,i)=>draggables[i] = createNew(i));
      
      updateScores();
    }
  
    function createNew(num){
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        let el = document.createElement("div");
    
        el.setAttribute('draggable', "true");
        el.setAttribute('id', "drag-"+num);
        el.setAttribute('data-val', num);
        el.classList.add("dragme");
        //el.innerHTML ="Drag Me" + num;
        el.setAttribute("style", `background-image:
  url('data:image/svg+xml;utf8,<svg width="100px" height="100px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path fill="%23${randomColor}" d="M14,7.59V4a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V7.59A3.41,3.41,0,0,1,9,10H9a3.41,3.41,0,0,0-1,2.41V20a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V12.41A3.41,3.41,0,0,0,15,10h0A3.41,3.41,0,0,1,14,7.59Z" style=" stroke-width: 1;"></path><path d="M14,7.59V4a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V7.59A3.41,3.41,0,0,1,9,10H9a3.41,3.41,0,0,0-1,2.41V20a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V12.41A3.41,3.41,0,0,0,15,10h0A3.41,3.41,0,0,1,14,7.59Z" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: .75;"></path></svg>');`);  
        
        el.addEventListener("dragstart", dragStart);
        return el;
    }
    
    function dropped(e){
      let id = "#" + e.dataTransfer.getData("text/plain");
      let target = e.target;
      
      if(e.target.classList.contains("dragme")){
        target = e.target.parentNode;
      }
      
      console.log(target, previous)
  
      target.appendChild(previous);
      previousCol.appendChild(target.children[0])
      
      e.stopPropagation();
    }
  
    const dragOver = (e) =>{ e.preventDefault() }
    const dragEnter = (e) => { e.preventDefault() }
    
    function dragStart(e){
      e.dataTransfer.setData('text/plain', e.target.id);
      previous = e.target;
      previousCol = e.target.parentNode;
      
      console.log("PREV", previous, previousCol)
    }
    
    function updateScores(){
      document.querySelector("#attempts").innerText = attempts;
      document.querySelector("#correct").innerText = correct;
      document.querySelector("#bestScore").innerText = bestScore;
    }
    
    init();  
  })()