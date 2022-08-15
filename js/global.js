var total_no_of_question = 0;
var current_question_no = 0;

var toi_profile = '';

if (sessionStorage.getItem('toi_profile') != null) {
    toi_profile = sessionStorage.getItem('toi_profile');
}



$(document).on('click', '.trigger-nav', function() {
    $(this).toggleClass('active');

    if($(this).hasClass('active')){
        $('.mob-nav-wrapper').addClass('active');
        $('body').css('position','fixed');
    }
    else{
        $('.mob-nav-wrapper').removeClass('active');
        $('body').css('position','');
    }
    
});

$(document).on('click', '.item-trigger', function() {
    $('.mob-nav-item > .item-content').removeClass('active');
    $(this).parents('.mob-nav-item').find('.item-content').toggleClass('active');
});

function generateQuestions(){
    $.getJSON('json/questions.json', function(data) {  
        total_no_of_question = data.question.length;
        current_question_no = 1;
        console.log(data.question.length);
        var arr_str = [];
        $.each(data.question, function(i, val) {

            var q_id = val.key;
            var is_active = i == 0 ? "active" : '';
            arr_str.push('<div class="question-item '+is_active+'" data-id="'+ q_id +'">');
                arr_str.push('<div class="row mt-4">');
                    arr_str.push('<div class="col-8">');
                    arr_str.push('Questions');
                    arr_str.push('<p class="text-question">'+ val.question +'</p>');
                    arr_str.push('</div>');
                    arr_str.push('<div class="col-4 text-end d-flex align-items-center justify-content-end">');
                    arr_str.push('<img src="images/questions/q'+ q_id +'_buddy.svg" class="img-fluid">');
                    arr_str.push('</div>');
                arr_str.push('</div> ');
                arr_str.push('<hr />');
                arr_str.push('<div class="row mt-4">');
                    arr_str.push('<div class="col">');
                    arr_str.push('<ul class="questions-answers-selection">');
                    $.each(val.answers, function(a_i, a_val) {
                        arr_str.push('<li>');
                        arr_str.push('<div class="form-check">');
                            arr_str.push('<input class="form-check-input trigger-answer" type="radio" name="q'+q_id+'_answer" id="q'+q_id+'_a'+a_i+'" data-qid="'+q_id+'" data-score="'+ a_val.score +'">');
                            arr_str.push('<label class="form-check-label" for="q'+q_id+'_a'+a_i+'">');
                            arr_str.push(a_val.value);
                            arr_str.push('</label>');
                        arr_str.push('</div>');
                        arr_str.push('</li>');
                    });
                    arr_str.push('</ul>');
                    arr_str.push('</div>');
                arr_str.push('</div>');
            arr_str.push('</div>');

        });

        $('.question-wrapper').html(arr_str.join('\n'));
        
        $('.total_no_of_question').html(total_no_of_question);
        $('.current_question_no').html(current_question_no);
    });

    $('.question_kv > img').attr('src','images/questions/q1_banner.png');
    $('.question_kv > source').attr('srcset','images/questions/q1_banner-mob.png');

}


$(document).on('change', '.trigger-answer', function() {
    
    var cur_q_id = current_question_no;
    var next_q_id = cur_q_id + 1;
    current_question_no = next_q_id;

    if(current_question_no > total_no_of_question ){
        sessionStorage.setItem('toi_profile','ultra_concervative');
        window.location.href = "results.html";
        return false;
    }

    $(this).parents('.question-item').removeClass('active');
    $('.question-item[data-id=' + next_q_id + ']').addClass('active');
    
    $('.total_no_of_question').html(total_no_of_question);
    $('.current_question_no').html(current_question_no);
    $('.question_kv > img').attr('src','images/questions/q' + next_q_id + '_banner.png');
    $('.question_kv > source').attr('srcset','images/questions/q' + next_q_id + '_banner-mob.png');
  
});




var initTimer;

function timer(){

    var currentTImer = $('.timer-wrapper').html();
    if(currentTImer.length > 0){
        $('.timer-wrapper').html(currentTImer.slice(0, currentTImer.length - 1));
    }
    else{
        clearInterval(initTimer);
        window.location.href = "results.html";
        return false;
    }

    
}