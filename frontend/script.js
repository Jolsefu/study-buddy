const quiz_string = `Someone who violates computer or Internet security maliciously or for illegal personal gain|Black hat hacker
An individual who causes problems, steals data, and corrupts systems|Cracker
An employee or contractor who attempts to gain financially and/or disrupt a company’s information systems and business operations|Malicious insider
An individual who captures trade secrets and attempts to gain an unfair competitive advantage|Industrial spy
Someone who attacks a computer system or network for financial gain|Cybercriminal
An individual who hacks computers or websites in an attempt to promote a political ideology|Hacktivist 
Someone who attempts to destroy the infrastructure components of governments, financial institutions, and other corporations, utilities, and emergency response units|Cyberterrorist
is malware that stops you from using your computer or accessing your data until you meet certain demands, such as paying a ransom or sending photos to the attacker.|ransomware
is a piece of programming code, usually disguised as something else, that causes a computer to behave in an unexpected and usually undesirable manner.|virus
is a harmful program that resides in the active memory of the computer and duplicates itself.|worms
is a seemingly harmless program in which malicious code is hidden.|trojan horse
is a sophisticated threat that combines the features of a virus, worm, Trojan horse, and other malicious code into a single payload.|blended threat
is the use of email systems to send unsolicited email to large numbers of people.|spam
is one in which a malicious hacker takes over computers via the Internet and causes them to flood a target site with demands for data and other small tasks.|DDOS
is a set of programs that enables its user to gain administrator-level access to a computer without the end user’s consent or knowledge.|rootkit
is a network attack in which an intruder gains access to a network and stays there—undetected—with the intention of stealing data over a long period of time (weeks or even months).|APT
is the act of fraudulently using email to try to get the recipient to reveal personal data.|phishing
is a variation of phishing in which the phisher sends fraudulent emails to a certain organization’s employees.|spear phishing
is another variation of phishing that involves the use of texting. In a smishing scam, people receive a legitimate-looking text message telling them to call a specific phone number or log on to a website.|Smishing
is similar to smishing except that the victims receive a voice-mail message telling them to call a phone number or access a website.|Vishing
involves the deployment of malware that secretly steals data in the computer systems of organizations, such as government agencies, military contractors, political organizations, and manufacturing firms.|Cyberespionage
is the intimidation of government or civilian population by using information technology to disable critical national infrastructure (for example, energy, transportation, financial, law enforcement, and emergency response) to achieve political, religious, or ideological goals.|Cyberterrorism`;

let quiz = [];
let current_number = 0;
let check_count = 0;
let total_count = 0;

let corrections = [];

let answered_numbers = [];

let current = 0;
let max;

document.addEventListener('DOMContentLoaded', read_quiz_string)

function read_quiz_string() {
    quiz_string.split(/\r?\n/).forEach(line => {
        const question_answer = line.trim().split('|');

        quiz.push(question_answer);
    })

    start_quiz();
}

function shuffle(array) {
    let current_index = array.length, random_index;
  
    while (current_index > 0) {  
      random_index = Math.floor(Math.random() * current_index);
      current_index--;
  
      [array[current_index], array[random_index]] = [array[random_index], array[current_index]];
    }

    return array;
}

function start_quiz() {
    quiz = shuffle(quiz);

    const form_container = document.getElementById('form-container');

    form_container.innerHTML = '';

    const question_answer_div = document.createElement('div');
    question_answer_div.id = 'question-answer';
    form_container.appendChild(question_answer_div);

    const answer_div = document.createElement('div');
    answer_div.className = 'mt-2';

    const answer_button = document.createElement('button');
    answer_button.id = 'answer-button';
    answer_button.className = 'btn btn-dark border';
    answer_button.innerHTML = 'Answer';

    answer_button.addEventListener('click', () => {      
        checker();

        if (current_number == quiz.length) {
            result();
        } else {
            load_quiz();
        }
    })

    answer_div.appendChild(answer_button);

    form_container.appendChild(answer_button);

    load_quiz();
}

function load_quiz() {
    const question_answer = document.getElementById('question-answer');

    const current_quiz = quiz[current_number];

    current = 0;
    max = (current_quiz.length - 1);

    question_answer.innerHTML = '';

    // Questions and answer box/es
    const answer_div = document.createElement('div');

    const label = document.createElement('label');
    label.for = 'answer_area';
    label.className = 'form-label my-2';

    const question = document.createElement('h5');
    question.innerHTML = current_quiz[0];

    label.appendChild(question);

    // Question number
    const question_details_div = document.createElement('div');

    const question_details = document.createElement('h2');
    question_details.className = 'text-info-emphasis font-weight-bold';

    let question_type;
    if (current_quiz.length > 2) {
        question_type = 'Enumeration';
    } else {
        question_type = 'Identification';
    }

    question_details.innerHTML = question_type;

    const question_number = document.createElement('h2');
    question_number.className = 'text-info font-weight-bold';
    question_number.innerHTML = `Question ${current_number + 1}`;

    question_details_div.appendChild(question_details);
    question_details_div.appendChild(question_number);

    // Append elements to its div
    answer_div.appendChild(question_details_div);
    answer_div.appendChild(label);

    for (i = 0; i < (current_quiz.length - 1); i++) {
        const answer_area = document.createElement('textarea');

        answer_area.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                document.getElementById('answer-button').click();
            }

            if (event.key === 'ArrowUp') {
                if (current == 0) {
                    current = (max - 1);
                } else {
                    current--;
                }
                document.getElementById(`answer-area-${current}`).focus();
            } else if (event.key === 'ArrowDown') {
                if (current == (max - 1)) {
                    current = 0;
                } else {
                    current++;
                }
                document.getElementById(`answer-area-${current}`).focus();
            }
        })

        answer_area.id = `answer-area-${i}`;
        answer_area.className = 'form-control mb-2';
        answer_area.rows = '2';

        answer_div.appendChild(answer_area);
    }

    question_answer.appendChild(answer_div);

    document.getElementById('answer-area-0').focus();

    current_number++;
}

function checker() {
    const answer = quiz[(current_number - 1)].slice(1);
    const lowered_answer = answer.map(element => {
        return element.toLowerCase();
    })
    let answer_corrections = [];
    let answered_list = [];

    for (let i = 0; i < answer.length; i++) {
        const answered = document.getElementById(`answer-area-${i}`).value.trim().toLowerCase();

        if (lowered_answer.includes(answered) && !(answered_list.includes(answered))) {
            answered_list.push(answered);

            check_count++;
        } else {
            answer_corrections.push(answer[i]);
        }
    }

    const wrong_answers = answer.filter(x => !answered_list.includes(x.toLowerCase()));

    if (answer_corrections.length) {
        corrections.push([answer_corrections.length > 1 ? 'Enumeration' : 'Identification', (current_number), quiz[(current_number - 1)], wrong_answers]);
    }

    total_count += answer.length;
}

function result() {
    const result_div = document.createElement('div');

    const check_span = document.createElement('span');
    check_span.className = 'text-success';
    check_span.innerHTML = check_count;

    const check_div = document.createElement('div');
    const check = document.createElement('h4');
    check.innerHTML = 'Total Check/s:' + ' ' + check_span.outerHTML;
    check_div.appendChild(check);

    const wrong_span = document.createElement('span');
    wrong_span.className = 'text-danger';
    wrong_span.innerHTML = (total_count - check_count);

    const wrong_div = document.createElement('div');
    const wrong = document.createElement('h4');
    wrong.innerHTML = 'Total Wrong/s:' + ' ' + wrong_span.outerHTML;
    wrong_div.appendChild(wrong);

    const total_span = document.createElement('span');
    total_span.className = 'text-info';
    total_span.innerHTML = total_count;

    const total_div = document.createElement('div');
    const total = document.createElement('h4');
    total.innerHTML = 'Total:' + ' ' + total_span.outerHTML;
    total_div.appendChild(total);

    result_div.appendChild(check_div);
    result_div.appendChild(wrong_div);
    result_div.appendChild(total_div);

    const form_container = document.getElementById('form-container');
    form_container.innerHTML = '';

    form_container.appendChild(result_div);

    const correction_container = document.createElement('div');
    correction_container.id = 'correction-container';
    correction_container.className = 'small-container container p-2 mt-2';

    document.getElementById('body').appendChild(correction_container);

    const h4 = document.createElement('h4');
    h4.className = 'text-center';

    if (corrections.length) {
        h4.innerHTML = 'Corrections:';

        correction_container.appendChild(h4);

        show_correction();
    } else {
        h4.innerHTML = 'You got a perfect score!';

        correction_container.appendChild(h4);
    }
}

function show_correction() {
    console.log(corrections);

    corrections.forEach(correction => {
        const span = document.createElement('span');
        span.className = 'text-primary-emphasis';
        span.innerHTML = `Question ${correction[1]}`;

        const question_details = document.createElement('h5');
        question_details.innerHTML = correction[0] + ' - ' + span.outerHTML;

        const question_details_div = document.createElement('div');
        question_details_div.className = 'my-1';
        question_details_div.appendChild(question_details);

        const question = document.createElement('h6');
        question.innerHTML = correction[2][0];

        const question_div = document.createElement('div');
        question_div.appendChild(question);

        const answer_div = document.createElement('div');

        const h5 = document.createElement('h5');

        const wrong_span = document.createElement('span');
        wrong_span.className = 'text-danger';

        if (correction[2].slice(1).length > 1) {
            const info_span = document.createElement('span');
            info_span.className = 'text-info-emphasis';

            correction[2].slice(1).forEach(answer => {                
                if (correction[3].includes(answer)) {
                    wrong_span.innerHTML = answer + ', ';
                    h5.innerHTML += wrong_span.outerHTML;
                } else {                
                    info_span.innerHTML = answer + ', ';
                    h5.innerHTML += info_span.outerHTML;
                }
            })
            const h5_last = h5.lastElementChild;
            h5_last.innerHTML = h5_last.innerHTML.trim().replace(/.$/, '.');
        } else {
            wrong_span.innerHTML = correction[2][1];

            h5.innerHTML = wrong_span.outerHTML;
        }
        answer_div.appendChild(h5);

        const correction_div = document.createElement('div');
        correction_div.className = 'bd-callout bd-callout-info container p-2 mt-4';

        correction_div.appendChild(question_details_div);
        correction_div.appendChild(answer_div);
        correction_div.appendChild(question_div);

        document.getElementById('correction-container').appendChild(correction_div);
    })
}
