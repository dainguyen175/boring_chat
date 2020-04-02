function callFindUsers (element){
  if(element.which === 13 || element.type === "click"){
    let keyword= $("#input-find-users-contact").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
      
    if (!keyword.length){
      alertify.notify("Bạn chưa nhập nội dung tìm kiếm.", "error", 5);
      return false;
    }

    if (!regexKeyword.test(keyword)){
      alertify.notify("Lỗi từ khoá tìm kiếm, chi cho phép ký tự chữ cái và số, cho phép khoảng trống.", "error", 5);
      return false;
    }

    $.get(`/contact/find-users/${keyword}`, function(data) {
      $("#find-user ul").html(data);
      addContact(); // js/addContact.js
      removeRequestContactSent(); // js/removeRequestContactSent.js
    });
  };
};

$(document).ready(function() {
  $("#input-find-users-contact").bind("keypress", callFindUsers); 
  $("#btn-find-users-contact").bind("click", callFindUsers); 
})

