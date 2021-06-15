var mealName=document.getElementById('meal-name');
var randomMealBodyContainer=document.createElement('div');
var addedFavMeals=document.getElementById('added-fav-meals');
var randomMealContainer=document.getElementById('random-meal-container');
var modal=document.getElementById('modal')

var arrayList=[];
var likedList=[];
window.onload=function(){
   randomMealGenerator('chicken');
   showTopData();
}
var divEle;
async function showTopData(){

   for(var i=0;i<window.localStorage.length;i++){
      var keyNumber=Number(localStorage.key(i));
      var mealId=localStorage.getItem(keyNumber);
      likedList.push(keyNumber);
      arrayList.push(mealId);
      console.log(mealId)
     generateData(mealId,keyNumber);
     console.log('data loaded');
   }
   console.log(arrayList)
}

async function generateData(value){

   var divEle=document.createElement('div');
   var fetchedData=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`);
   var resp=await fetchedData.json();
   console.log(resp.meals);
   divEle.innerHTML=`
   <div class="fav-meal-details" id='${value}' onclick='deleteItem(${value})'>
      <img src='${resp.meals[0].strMealThumb}' />
      <h6>${resp.meals[0].strMeal}</h6>
   </div>`
   addedFavMeals.appendChild(divEle);
}

function getData(){
   if(mealName.value===''){
      alert('please enter the meal name')
   }
  else
  {
     if(mealName.value!=='' && localStorage.length<=0){
         randomMealGenerator(mealName.value);
         randomMealBodyContainer.innerHTML=''
         mealName.value=''
     }
     else{
      alert('please clear viewing all your fav')
     }
  }
}
function randomMealGenerator(value){
  
   fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      // Do something with the response
      showData(data.meals);
    })
    .catch((error) => {
      alert('no such type of food found')
    });
}

function showData(d){
      for(var i=0;i<d.length;i++){
         divElement=document.createElement('div');
         divElement.innerHTML=`
         <div class='random-meal-details'>
            <h3>Random Meal</h3>
            <img src=${d[i].strMealThumb}>
            <div class='random-meal-inner-details' >
               <span>${d[i].strMeal}</span>
               <button class='active'  ><i class='fas fa-heart' value=${d[i].idMeal}></i></button>
            </div>
         </div>`;
         randomMealBodyContainer.appendChild(divElement);
         randomMealContainer.appendChild(randomMealBodyContainer);
         document.getElementsByClassName('active')[i].addEventListener('click',(e)=>{
                  e.target.classList.toggle('non-active')
                  addToFav(e.target.attributes.value.value)
         })
      }
         showLikedStatus(arrayList);
}  

 function showLikedStatus(arrayList){
  for(let i=0;i<arrayList.length;i++){
      likedPost=$(`[value=${arrayList[i]}]`);
      likedPost[0].classList.toggle('non-active')
  }
}

async function addToFav(idMeal){
  
      if(arrayList.indexOf(idMeal)>=0){
         var dele=document.getElementById(idMeal);
         dele.parentElement.remove();
         indexNub=arrayList.indexOf(idMeal);
         arrayList.splice(indexedDB,1);
         localStorage.removeItem(idMeal);
      }
      else
      {
         arrayList.push(idMeal);
         console.log(arrayList)
         var divEle=document.createElement('div');
         var fetchedData=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
         var resp=await fetchedData.json();
         divEle.innerHTML=`
         <div class="fav-meal-details" id=${idMeal}  onclick='deleteItem(${idMeal})'>
            <img  src='${resp.meals[0].strMealThumb}'/>
            <h6>${resp.meals[0].strMeal}</h6>
         </div>`
      addedFavMeals.appendChild(divEle);
      addToLocalStorage(idMeal,idMeal)
      }
}
async function deleteItem(value){
   var dele=document.getElementById(value);
   replace=$(`[value=${value}]`);
   replace[0].classList.toggle('non-active');
   dele.parentElement.remove();
   indexNub=arrayList.indexOf(value);
   arrayList.splice(indexedDB,1);
   console.log(arrayList);
   localStorage.removeItem(value);
   var fetchedData=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`);
   var resp=await fetchedData.json();
   console.log(resp.meals[0]);
   modal.style.transition='2s ease-in-out';
   modal.innerHTML=`
      <p class='space' style="font-size: 40px;cursor: pointer;" onclick="removeModal()">&Cross;</p>
      <img class='space' src='${resp.meals[0].strMealThumb}'>
      <p class='space'>${resp.meals[0].strInstructions}</p>
      <h3 class='space'>Ingedients</h3>
      <ul class='space'>
         <li>${resp.meals[0].strIngredient1}</li>
         <li>${resp.meals[0].strIngredient2}</li>
         <li>${resp.meals[0].strIngredient3}</li>
         <li>${resp.meals[0].strIngredient4}</li>
         <li>${resp.meals[0].strIngredient5}</li>
         <li>${resp.meals[0].strIngredient6}</li>
      </ul>
      <h3 class='space'>youtube link</h3>
      <a  href=${resp.meals[0].strYoutube} class='youtube-link'><i class="fas fa-external-link-alt"></i></a>
   `
   modal.style.display='block';
   document.getElementsByTagName('body')[0].style.overflowY='hidden'
}
function removeModal(){
  modal.style.display='none'
  document.getElementsByTagName('body')[0].style.overflowY='visible'

}
function addToLocalStorage(idMeal,idMeal){
   localStorage.setItem(idMeal,idMeal);
}

