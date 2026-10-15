/* javascript file for Wellbeing with Movement form actions */

document.getElementById("js-warning").hidden = true;


const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const currentMonth = `${year}-${month}`;

document.getElementById("diag_date").setAttribute("max", currentMonth);

const result = document.getElementById("result");

/* adapted this method for setting max date to current month; 
reference https://www.tutorialspoint.com/article/how-to-set-an-html-date-picker-max-date-to-today */

const form = document.getElementById("form");

form.addEventListener("submit", function(event) {

    event.preventDefault();
    
    const formData = new FormData(form);

    const answers = {
        firstName: formData.get("fname") || "there",
        diagnosisDate: formData.get("diag_date"), 
        cancer: formData.get("cancer"),
        treatments: formData.getAll("treatments"),
        hcpAdvice: formData.get("hcp_advice"),
        paExperience: formData.get("PA_experience"),
        paConfidence: formData.get("PA_confidence"),
        postcode: formData.get("postcode")
    };

    const paLevel = getPALevel(answers.paExperience, answers.paConfidence);

    const programme = paLevels[paLevel];

    const resultPage = `Hi, ${answers.firstName}. Here is your programme. ${programme.opener}`;

    form.hidden = true;
    result.textContent = resultPage;
    result.hidden = false;
    result.focus(); 
    
    console.log(answers, paLevel, programme);

})

function getPALevel(experience, confidence) {
    return difficultyMatrix[experience][confidence];
}

