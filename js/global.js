const report_url = 'https://u-forms.uob.com.sg/eservices/uobam/investor-type-quiz-contact.html';

var total_no_of_question = 0;
var current_question_no = 0;

var toi_profile = '';
var arr_per_q_score = [];

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
    $('.item-trigger').removeClass('active');
    $(this).addClass('active');
    $('.mob-nav-item > .item-content').removeClass('active');
    $(this).parents('.mob-nav-item').find('.item-content').toggleClass('active');
});

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function generateQuestions(){
    $.getJSON('json/questions.json', function(data) {  
        total_no_of_question = data.question.length;
        current_question_no = 1;
        //console.log(data.question.length);
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
                    arr_str.push('<div class="col-4 text-end d-flex align-items-center justify-content-end question-icon">');
                    arr_str.push('<img src="images/questions/q'+ q_id +'_buddy.png" class="img-fluid">');
                    arr_str.push('</div>');
                arr_str.push('</div> ');
                arr_str.push('<hr />');
                arr_str.push('<div class="row mt-4">');
                    arr_str.push('<div class="col">');
                    arr_str.push('<ul class="questions-answers-selection">');


                    const shuffled_answers = val.answers.sort(() => Math.random() - 0.5);
                    $.each(shuffled_answers, function(a_i, a_val) {
                        arr_str.push('<li>');
                        arr_str.push('<div class="form-check">');
                            arr_str.push('<input class="form-check-input " type="radio" name="q'+q_id+'_answer" id="q'+q_id+'_a'+a_i+'" data-qid="'+q_id+'" data-score="'+ a_val.score +'">');
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

var totalScore = 0;
var arr_answers = [];

$(document).on('click', '.trigger-next', function(e) {
    e.preventDefault();
    var cur_q_id = current_question_no;

    if(!$("input[name='q"+cur_q_id+"_answer']").is(':checked')){
        alert('Please select your answer.');
        return;
    }

    var selected_elem = $("input[name='q"+cur_q_id+"_answer']:checked");
    
    var cur_q_id = current_question_no;
    var next_q_id = cur_q_id + 1;
    current_question_no = next_q_id;
    
    
    arr_per_q_score[cur_q_id-1] = selected_elem.data('score');
    console.log(arr_per_q_score);
    totalScore = arr_per_q_score.reduce((partialSum, a) => partialSum + a, 0);


    console.log(totalScore);
    arr_answers.push(selected_elem.data('score'));
    if(current_question_no > total_no_of_question ){
        sessionStorage.setItem('answers',JSON.stringify(arr_per_q_score));
        sessionStorage.setItem('total_score',totalScore);
        window.location.href = "results.html";
        return false;
    }
   

    $("input[name='q"+cur_q_id+"_answer']").parents('.question-item').removeClass('active');
    $('.question-item[data-id=' + next_q_id + ']').addClass('active');
    
    $('.total_no_of_question').html(total_no_of_question);
    $('.current_question_no').html(current_question_no);
    $('.question_kv > img').attr('src','images/questions/q' + next_q_id + '_banner.png');
    $('.question_kv > source').attr('srcset','images/questions/q' + next_q_id + '_banner-mob.png');
  
    if(current_question_no < 2){
        $('.trigger-back').addClass('d-none');
    }
    else{
        $('.trigger-back').removeClass('d-none');
    }    
});


$(document).on('click', '.trigger-back', function(e) {
    e.preventDefault();
    var cur_q_id = current_question_no;
    var cur_q_id = current_question_no;
    var prev_q_id = cur_q_id - 1;
    current_question_no = prev_q_id;
    
    $("input[name='q"+cur_q_id+"_answer']").parents('.question-item').removeClass('active');

    $('.question-item[data-id=' + prev_q_id + ']').addClass('active');
    
    $('.total_no_of_question').html(total_no_of_question);
    $('.current_question_no').html(current_question_no);
    $('.question_kv > img').attr('src','images/questions/q' + prev_q_id + '_banner.png');
    $('.question_kv > source').attr('srcset','images/questions/q' + prev_q_id + '_banner-mob.png');
    if(current_question_no < 2){
        $('.trigger-back').addClass('d-none');
    }
    else{
        $('.trigger-back').removeClass('d-none');
    }
});




function getTypeOfInvestor(score){

    //?q1=5&q2=1&q3=1&q4=1&q5=5&q6=3&q7=3&q8=1&q9=5&q10=3&q11=4&score=32&type=friendly-follower
    var arr_answers = JSON.parse(sessionStorage.getItem('answers'));
    var total_score = JSON.parse(sessionStorage.getItem('total_score'));

    var type_of_investor = '';

    $.getJSON('json/questions.json', function(data) {  
        $.each(data.score, function(i, val) {
           
            if(score >= val.min && score <= val.max){
                console.log(val.min, val.max, score);
                $('.dynamic-image').html('<source media="(max-width: 650px)" srcset="images/results/' + val.image_filename + '-mob.png"><img src="images/results/' + val.image_filename + '.png" class="img-fluid" width="80%" />');
                $('.dynamic-type-name').html(val.title);
                $('.dynamic-description').html(val.description);
                console.log(val.description);
                type_of_investor = val.type;
                type_of_investor = type_of_investor.replace(/\s/g,"-").toLowerCase();

                var queryStr = '?score=' + total_score;
                var q_no = 1;
                queryStr = queryStr + '&qn=';
                $.each(arr_answers, function(i, val) {
                    if(q_no != 1)
                        queryStr = queryStr + '_';

                    queryStr = queryStr + q_no+'a' + val;
                    q_no++;
                });
            
                queryStr = queryStr + '&type=' + type_of_investor;
                // console.log(queryStr);
                $('.btn-send-report').attr('href',report_url+queryStr);
                $('.results-description-wrapper').removeClass('hide');
            }
        })
    })




}



// var initTimer;

// function timer(){

//     var currentTImer = $('.timer-wrapper').html();
//     if(currentTImer.length > 0){
//         $('.timer-wrapper').html(currentTImer.slice(0, currentTImer.length - 1));
//     }
//     else{
//         clearInterval(initTimer);
//         window.location.href = "results.html";
//         return false;
//     }

    
// }