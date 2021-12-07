const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");

let currentQuestion = {};
let acceptingAnswers = true;
let questionCounter = 0;
let max_questions = 7;
let availableQuestions = [];
let questions = [];
let score_points = 0;
let score = 0;
let level = localStorage.getItem("level");

startGame = () => {
    if (level == "easy") {
        questions = [
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, com que frequência é exibido o nome \"Maria de Fátima da Silva\"?",
                choice1: "18 vezes",
                choice2: "21 vezes",
                choice3: "23 vezes",
                choice4: "25 vezes",
                choice5: "32 vezes",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, quantos funcionários estavam ativos em função do cargo?",
                choice1: "62.829 funcionários",
                choice2: "76.204 funcionários",
                choice3: "99.793 funcionários",
                choice4: "102.108 funcionários",
                choice5: "121.247 funcionários",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, qual foi o valor máximo, em reais, do abatimento em função do \"teto\" constitucional?",
                choice1: "R$ 40.428,69",
                choice2: "R$ 41.278,20",
                choice3: "R$ 43.108,02",
                choice4: "R$ 45.921,30",
                choice5: "R$ 47.104,89",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, qual é a média do salário líquido, em reais, de todos os funcionários em função do cargo?",
                choice1: "R$ 1.234,06",
                choice2: "R$ 1.520,00",
                choice3: "R$ 1.772,69",
                choice4: "R$ 2.972,02",
                choice5: "R$ 4.522,30",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, quantos policiais militares pertenciam à Polícia Militar do Estado do Ceará (PMCE)?",
                choice1: "28.483 policiais militares",
                choice2: "32.015 policiais militares",
                choice3: "34.902 policiais militares",
                choice4: "38.101 policiais militares",
                choice5: "40.008 policiais militares",
                answer: 2
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, qual orgão/entidade possui o maior número de funcionários em função do cargo?",
                choice1: "CGE - Controladoria e Ouvidoria Geral do Estado",
                choice2: "SESA - Secretaria da Saúde do Estado do Ceará",
                choice3: "PMCE - Polícia Militar do Estado do Ceará",
                choice4: "SEDUC - Secretaria de Educação do Estado do Ceará",
                choice5: "SUPSEC - Sistema Único de Previdência do Estado do Ceará",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, qual a diferença (em números) de funcionários ativos entre fevereiro e janeiro?",
                choice1: "1.281 funcionários",
                choice2: "1.530 funcionários",
                choice3: "1.879 funcionários",
                choice4: "2.004 funcionários",
                choice5: "2.328 funcionários",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, quantos funcionários aposentaram-se em função do cargo?",
                choice1: "28.004 funcionários",
                choice2: "34.221 funcionários",
                choice3: "38.914 funcionários",
                choice4: "44.690 funcionários",
                choice5: "47.004 funcionários",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos de março de 2020, qual foi o maior salário bruto, em reais?",
                choice1: "R$ 76.009,29",
                choice2: "R$ 85.299,00",
                choice3: "R$ 115.238,69",
                choice4: "R$ 146.015,75",
                choice5: "R$ 156.755,80",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos de março de 2020, qual é o valor, em reais, da soma do salário bruto de todos os funcionários?",
                choice1: "R$ 748.184.313,30",
                choice2: "R$ 780.532.170,03",
                choice3: "R$ 825.084.443,09",
                choice4: "R$ 848.982.010,00",
                choice5: "R$ 910.586.825,08",
                answer: 1
            }
        ]

        score_points = 12;
        max_questions = 10;
    }
    else if (level == "middle") {
        questions = [
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, em que mês teve o maior número de funcionários aposentados em função do cargo?",
                choice1: "Março",
                choice2: "Abril",
                choice3: "Maio",
                choice4: "Junho",
                choice5: "Julho",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos de maio de 2020, qual cargo/função/emprego teve o maior número de funcionários cadastrados?",
                choice1: "Motorista",
                choice2: "Advogado(a)",
                choice3: "Professor(a)",
                choice4: "Coodernador(a)",
                choice5: "Administrador(a)",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, em que mês teve o maior número de funcionários ativos em função do cargo?",
                choice1: "Fevereiro",
                choice2: "Abril",
                choice3: "Junho",
                choice4: "Novembro",
                choice5: "Dezembro",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, em que mês teve o menor número de funcionários ativos em função do cargo?",
                choice1: "Janeiro",
                choice2: "Março",
                choice3: "Abril",
                choice4: "Julho",
                choice5: "Novembro",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020 (de janeiro à dezembro), qual é a quantidade total de funcionários ativos em função do cargo?",
                choice1: "1.000.205 funcionários",
                choice2: "1.205.721 funcionários",
                choice3: "1.420.942 funcionários",
                choice4: "1.807.291 funcionários",
                choice5: "2.219.802 funcionários",
                answer: 2
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, quantos funcionários estavam ativos em função do cargo?",
                choice1: "62.829 funcionários",
                choice2: "76.204 funcionários",
                choice3: "99.793 funcionários",
                choice4: "102.108 funcionários",
                choice5: "121.247 funcionários",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, qual foi o valor máximo, em reais, do abatimento em função do \"teto\" constitucional?",
                choice1: "R$ 40.428,69",
                choice2: "R$ 41.278,20",
                choice3: "R$ 43.108,02",
                choice4: "R$ 45.921,30",
                choice5: "R$ 47.104,89",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, qual é a média do salário líquido, em reais, de todos os funcionários em função do cargo?",
                choice1: "R$ 1.234,06",
                choice2: "R$ 1.520,00",
                choice3: "R$ 1.772,69",
                choice4: "R$ 2.972,02",
                choice5: "R$ 4.522,30",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, com que frequência é exibido o nome \"Maria de Fátima da Silva\"?",
                choice1: "18 vezes",
                choice2: "21 vezes",
                choice3: "23 vezes",
                choice4: "25 vezes",
                choice5: "32 vezes",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, quantos policiais militares pertenciam à Polícia Militar do Estado do Ceará (PMCE)?",
                choice1: "28.483 policiais militares",
                choice2: "32.015 policiais militares",
                choice3: "34.902 policiais militares",
                choice4: "38.101 policiais militares",
                choice5: "40.008 policiais militares",
                answer: 2
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, qual orgão/entidade possui o maior número de funcionários em função do cargo?",
                choice1: "CGE - Controladoria e Ouvidoria Geral do Estado",
                choice2: "SESA - Secretaria da Saúde do Estado do Ceará",
                choice3: "PMCE - Polícia Militar do Estado do Ceará",
                choice4: "SEDUC - Secretaria de Educação do Estado do Ceará",
                choice5: "SUPSEC - Sistema Único de Previdência do Estado do Ceará",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, qual a diferença (em números) de funcionários ativos entre fevereiro e janeiro?",
                choice1: "1.281 funcionários",
                choice2: "1.530 funcionários",
                choice3: "1.879 funcionários",
                choice4: "2.004 funcionários",
                choice5: "2.328 funcionários",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, quantos funcionários aposentaram-se em função do cargo?",
                choice1: "28.004 funcionários",
                choice2: "34.221 funcionários",
                choice3: "38.914 funcionários",
                choice4: "44.690 funcionários",
                choice5: "47.004 funcionários",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos de março de 2020, qual foi o maior salário bruto, em reais?",
                choice1: "R$ 76.009,29",
                choice2: "R$ 85.299,00",
                choice3: "R$ 115.238,69",
                choice4: "R$ 146.015,75",
                choice5: "R$ 156.755,80",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos de março de 2020, qual é o valor, em reais, da soma do salário bruto de todos os funcionários?",
                choice1: "R$ 748.184.313,30",
                choice2: "R$ 780.532.170,03",
                choice3: "R$ 825.084.443,09",
                choice4: "R$ 848.982.010,00",
                choice5: "R$ 910.586.825,08",
                answer: 1
            }
        ]

        score_points = 8;
        max_questions = 15;
    }
    else if (level == "hard") {
        questions = [
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020 (de janeiro à dezembro), qual é a média de funcionários aposentados em função do cargo?",
                choice1: "41.012,09 aposentados",
                choice2: "47.983,91 aposentados",
                choice3: "53.414,82 aposentados",
                choice4: "59.018,82 aposentados",
                choice5: "64.888,03 aposentados",
                answer: 2
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020 (de janeiro à dezembro), qual é a mediana de funcionários pensionistas em função do cargo?",
                choice1: "10.142 pensionistas",
                choice2: "15.601 pensionistas",
                choice3: "19.046 pensionistas",
                choice4: "25.082 pensionistas",
                choice5: "31.091 pensionistas",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020 (de janeiro à dezembro), qual é a moda de funcionários estagiários em função do cargo?",
                choice1: "Amodal",
                choice2: "Bimodal",
                choice3: "309",
                choice4: "636",
                choice5: "742",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, qual é o valor, em reais, da soma do salário bruto de todos os funcionários em função do cargo?",
                choice1: "R$ 1.507.010.342,48 ",
                choice2: "R$ 3.000.012.931,69 ",
                choice3: "R$ 5.585.021.722,09 ",
                choice4: "R$ 7.036.202.011,03 ",
                choice5: "R$ 9.185.339.176,20 ",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, qual é o valor, em reais, da soma do salário líquido de todos os funcionários em função do cargo?",
                choice1: "R$ 1.729.026.002,03",
                choice2: "R$ 3.680.238.029,91",
                choice3: "R$ 6.317.564.741,40",
                choice4: "R$ 9.015.209.993,58",
                choice5: "R$ 9.977.821.080,21",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, quantos funcionários estavam ativos em função do cargo?",
                choice1: "62.829 funcionários",
                choice2: "76.204 funcionários",
                choice3: "99.793 funcionários",
                choice4: "102.108 funcionários",
                choice5: "121.247 funcionários",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, qual foi o valor máximo, em reais, do abatimento em função do \"teto\" constitucional?",
                choice1: "R$ 40.428,69",
                choice2: "R$ 41.278,20",
                choice3: "R$ 43.108,02",
                choice4: "R$ 45.921,30",
                choice5: "R$ 47.104,89",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, qual é a média do salário líquido, em reais, de todos os funcionários em função do cargo?",
                choice1: "R$ 1.234,06",
                choice2: "R$ 1.520,00",
                choice3: "R$ 1.772,69",
                choice4: "R$ 2.972,02",
                choice5: "R$ 4.522,30",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, quantos policiais militares pertenciam à Polícia Militar do Estado do Ceará (PMCE)?",
                choice1: "28.483 policiais militares",
                choice2: "32.015 policiais militares",
                choice3: "34.902 policiais militares",
                choice4: "38.101 policiais militares",
                choice5: "40.008 policiais militares",
                answer: 2
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, qual orgão/entidade possui o maior número de funcionários em função do cargo?",
                choice1: "CGE - Controladoria e Ouvidoria Geral do Estado",
                choice2: "SESA - Secretaria da Saúde do Estado do Ceará",
                choice3: "PMCE - Polícia Militar do Estado do Ceará",
                choice4: "SEDUC - Secretaria de Educação do Estado do Ceará",
                choice5: "SUPSEC - Sistema Único de Previdência do Estado do Ceará",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos de janeiro de 2020, com que frequência é exibido o nome \"Maria de Fátima da Silva\"?",
                choice1: "18 vezes",
                choice2: "21 vezes",
                choice3: "23 vezes",
                choice4: "25 vezes",
                choice5: "32 vezes",
                answer: 4
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, qual a diferença (em números) de funcionários ativos entre fevereiro e janeiro?",
                choice1: "1.281 funcionários",
                choice2: "1.530 funcionários",
                choice3: "1.879 funcionários",
                choice4: "2.004 funcionários",
                choice5: "2.328 funcionários",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de fevereiro de 2020, quantos funcionários aposentaram-se em função do cargo?",
                choice1: "28.004 funcionários",
                choice2: "34.221 funcionários",
                choice3: "38.914 funcionários",
                choice4: "44.690 funcionários",
                choice5: "47.004 funcionários",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos de março de 2020, qual foi o maior salário bruto, em reais?",
                choice1: "R$ 76.009,29",
                choice2: "R$ 85.299,00",
                choice3: "R$ 115.238,69",
                choice4: "R$ 146.015,75",
                choice5: "R$ 156.755,80",
                answer: 5
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, em que mês teve o maior número de funcionários ativos em função do cargo?",
                choice1: "Fevereiro",
                choice2: "Abril",
                choice3: "Junho",
                choice4: "Novembro",
                choice5: "Dezembro",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos de março de 2020, qual é o valor, em reais, da soma do salário bruto de todos os funcionários?",
                choice1: "R$ 748.184.313,30",
                choice2: "R$ 780.532.170,03",
                choice3: "R$ 825.084.443,09",
                choice4: "R$ 848.982.010,00",
                choice5: "R$ 910.586.825,08",
                answer: 1
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020 (de janeiro à dezembro), qual é a quantidade total de funcionários ativos em função do cargo?",
                choice1: "1.000.205 funcionários",
                choice2: "1.205.721 funcionários",
                choice3: "1.420.942 funcionários",
                choice4: "1.807.291 funcionários",
                choice5: "2.219.802 funcionários",
                answer: 2
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, em que mês teve o menor número de funcionários ativos em função do cargo?",
                choice1: "Janeiro",
                choice2: "Março",
                choice3: "Abril",
                choice4: "Julho",
                choice5: "Novembro",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos de maio de 2020, qual cargo/função/emprego teve o maior número de funcionários cadastrados?",
                choice1: "Motorista",
                choice2: "Advogado(a)",
                choice3: "Professor(a)",
                choice4: "Coodernador(a)",
                choice5: "Administrador(a)",
                answer: 3
            },
            {
                question: "De acordo com as informações de servidores públicos do ano de 2020, em que mês teve o maior número de funcionários aposentados em função do cargo?",
                choice1: "Março",
                choice2: "Abril",
                choice3: "Maio",
                choice4: "Junho",
                choice5: "Julho",
                answer: 5
            }
        ]

        score_points = 6;
        max_questions = 20;
    }
    else {
        window.location.href = "../level/index.html";
    }
    
    localStorage.setItem("level", "");
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > max_questions) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("../done/index.html");
    }

    questionCounter++;

    progressText.innerText = `Questão ${questionCounter} de ${max_questions}`;
    progressBarFull.style.width = `${Math.floor((questionCounter / max_questions) * 100)}%`;

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;
  
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionsIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers)
            return;

        acceptingAnswers = false;

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        let classToApply = (selectedAnswer == currentQuestion.answer) ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(score_points);
            document.getElementById("success").play();
        }
        else {
            document.getElementById("error").volume = 0.8;
            document.getElementById("error").play();
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

function musicPlay() {
    document.getElementById("song").volume = 0.4;
    document.getElementById("song").play();
    document.removeEventListener("click", musicPlay);
}

document.addEventListener("click", musicPlay);
startGame();

/*
 *   Para que serve tantos códigos se a vida não é programada,
 *   e as melhores coisas não tem lógica? (҂◡_◡)
 *   @lucapwn
 */
