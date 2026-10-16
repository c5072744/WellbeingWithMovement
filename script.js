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

    result.replaceChildren();

    form.hidden = true;

    const heading = document.createElement("h2");
    heading.textContent = "Your Programme";
    result.append(heading);

    const greeting = document.createElement("p");
    greeting.textContent = `Hi, ${answers.firstName}.`;
    result.append(greeting);

    const diagnosisRecency = getDiagnosisRecency(answers.diagnosisDate);
    if (diagnosisRecency) {
        const recency = document.createElement("p");
        recency.textContent = recencyStatement[diagnosisRecency];
        result.append(recency);
    }

    answers.treatments.forEach(function(treatment) {
        const treatmentLine = document.createElement("p");
        treatmentLine.textContent = treatmentAdvice[treatment];
        result.append(treatmentLine);
    });

    const resource = document.createElement("p");
    const resourceLink = document.createElement("a");
    resourceLink.href = cancerAdvice[answers.cancer].link;
    resourceLink.textContent = cancerAdvice[answers.cancer].message;
    resource.append(resourceLink);
    result.append(resource);


    if (answers.hcpAdvice === "hcp_yes") {
        const noExerciseOpener = document.createElement("p");
        noExerciseOpener.textContent = noExercise.opener;
        result.append(noExerciseOpener);

        noExercise.blocks.forEach(function(block) {
            const blockHeading = document.createElement("h3");
            blockHeading.textContent = block.title;
            const blockParagraph = document.createElement("p");
            blockParagraph.textContent = block.content;

            result.append(blockHeading, blockParagraph);
        });
    } else {

        const opener = document.createElement("p");
        opener.textContent = `Here is your programme. ${programme.opener}`;
        result.append(opener);

        const exerciseHeading = document.createElement("h3");
        exerciseHeading.textContent = "Your Exercises";
        const exerciseList = document.createElement("ol");
        result.append(exerciseHeading, exerciseList);

        programme.exerciseList.forEach(function(item) {
            const exercise = exercises[item.id];
            const listItem = document.createElement("li");
            const exerciseName = document.createElement("h4")
            exerciseName.textContent = exercise.name;
            listItem.append(exerciseName);

            const dose = document.createElement("p");
            dose.textContent = `Number of times: ${item.dose}`;
            listItem.append(dose);

            exercise.images.forEach(function(imageFile) {
                const image = document.createElement("img");
                image.src = `images/${imageFile}`;
                image.alt = "";
                listItem.append(image);
            });

            const instructions = document.createElement("p");
            instructions.textContent = exercise.caption;
            listItem.append(instructions);

            exerciseList.append(listItem);
        });

        const programmeEnd = document.createElement("p");
        programmeEnd.textContent = `Do this circuit ${programme.circuitRepeats} more time(s). Also try for ${programme.cardioMins} of a type of cardio you enjoy, like walking or cycling. For your cardio, aim for a ${programme.rpe} out of 10 in terms of effort.`

        result.append(programmeEnd);
    }

    result.hidden = false;
    result.focus(); 
    
    console.log(answers, paLevel, programme);

})

function getPALevel(experience, confidence) {
    return difficultyMatrix[experience][confidence];
}

function getDiagnosisRecency(diagnosisDate) {
    if (!diagnosisDate) {
        return null;
    }

    const [diagnosisYear, diagnosisMonth] = diagnosisDate.split("-").map(Number);

    const monthsSinceDiagnosis = (today.getFullYear() - diagnosisYear) * 12 + (today.getMonth() + 1 - diagnosisMonth);

    if (monthsSinceDiagnosis <= 18) {
        return "recent";
    }

    return "notRecent";
}
