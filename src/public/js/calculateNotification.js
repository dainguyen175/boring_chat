function increaseNumberNotification(classname){
  let currentValue= +$(`.${classname}`).text();
  currentValue +=1;
  
  if(currentValue === 0) {
    $(`.${classname}`).css("display", "none").html("");
  }else{
    $(`.${classname}`).css("display", "block").html(currentValue)
  }
};

function decreaseNumberNotification(classname){
  let currentValue= +$(`.${classname}`).text();
  currentValue -=1;

  if(currentValue === 0) {
    $(`.${classname}`).css("display", "none").html("");
  }else{
    $(`.${classname}`).css("display", "block").html(currentValue)
  }
};
