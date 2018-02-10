
(function ($) {
    function redirect(name)
    {
        localStorage.setItem("usernameint",name);  
        var url = "https://jayanth86.github.io/tartanhacks2018/Website/index.html";
        $(location).attr('href',url);
        return false;
    }

    
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    

    $('.validate-form').on('submit',function(){
        event.preventDefault();
        name = "";
        var check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){

                showValidate(input[i]);
                check=false;
            }
            if(i == 1)  {
                name = input[i];
            }
        }

        if(check)   {
            redirect(name);
        }
        else    {
            return false;
        }

    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email' || $(input).attr('type') == 'name') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
            else    {
                return true;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
            else    {
                return true;
            }
        }
    }
    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);