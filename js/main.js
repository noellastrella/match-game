(()=>{
    var draggables = [];
    var draggablesClone = [];
    let attempts = 0;
    let correct = 0;
    let previous;
  
    let answerRow = document.querySelector("#answers");
    let answers;
    
    document.querySelector("#restartGame").addEventListener("click", e=>{
      if(!answerRow.classList.contains("hideAnswers")) {
        answerRow.classList.add("hideAnswers");
      } 
      
      resetState();
    });
    
    document.querySelector("#checkAnswers").addEventListener("click", e=>{
      let total = answers.length;    
      
      attempts++;
      correct = checkAnswers();
      
      updateScores();
      
      if(correct == total){
        if(answerRow.classList.contains("hideAnswers")) {
          answerRow.classList.remove("hideAnswers");
        } 
      }else{
        if(!answerRow.classList.contains("hideAnswers")) {
          answerRow.classList.add("hideAnswers");
        } 
      }
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
      createSet();
      shuffle();
      updateScores();
    }
  
    function shuffle(){
      attempts = 0;
      correct = 0;
      
      draggablesClone = [...draggables].map(e=>{
        return e.cloneNode(true);
      });
      
      draggablesClone = draggablesClone.map((e,i)=>{
        e.setAttribute('id', "answer-"+i);
        return e;
      })
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
      
      document.querySelectorAll("#guess .col").forEach((e,i)=>{
          e.appendChild(draggables[i])
      });
      
      document.querySelectorAll("#answers .col").forEach((e,i)=>{
          e.appendChild(draggablesClone[i])
      }); 
      
      answers = document.querySelectorAll("#answers .col .dragme");
      if(checkAnswers(answers)>0)resetState();
    }
  
    function checkAnswers(){    
      let matches = 0;
      console.log(answers)
      document.querySelectorAll("#guess .col .dragme").forEach((e,i)=>{
         if(e.dataset.val ==  answers[i].dataset.val) matches++;
      });
      
      return matches;
    }
    
    function createSet(){
      draggables = [];
      
      document.querySelectorAll("#guess .col").forEach((e,i)=>{
        e.innerHTML = "";
      })
      
      document.querySelectorAll("#answers .col").forEach((e,i)=>{
        e.innerHTML = "";
      })
      
      document.querySelectorAll("#guess .col").forEach((e,i)=>{
        draggables[i] = createNew(i);
      });
      
      updateScores();
    }
  
    function createNew(num){
      let randomColor = Math.floor(Math.random()*16777215).toString(16);
      let el = document.createElement("div");
  
      el.setAttribute('draggable', "true");
      el.setAttribute('id', "drag-"+num);
      el.setAttribute('data-val', num);
      el.classList.add("dragme");
      el.innerHTML ="Drag Me" + num;
      el.setAttribute("style", "background: #" + randomColor);  
      
      el.addEventListener("dragstart", dragStart);
      return el;
    }
    
    function dropped(e){
      let id = "#" + e.dataTransfer.getData("text/plain");
      let target = e.target;
      
      if(e.target.classList.contains("dragme")){
        target = e.target.parentNode;
      }
  
      target.appendChild(previous);
      previousCol.appendChild(target.children[0])
      
      e.stopPropagation();
    }
  
    function dragOver(e){
      e.preventDefault();
    }
  
    function dragEnter(e){
      e.preventDefault();  
    }
    
    function dragStart(e){
      e.dataTransfer.setData('text/plain', e.target.id);
      previous = e.target;
      previousCol = e.target.parentNode;
    }
    
    function updateScores(){
      document.querySelector("#attempts").innerText = attempts;
      document.querySelector("#correct").innerText = correct;
    }
    
    init();  
  })()