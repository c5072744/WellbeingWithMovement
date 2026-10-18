/* javascript file for Wellbeing with Movement form actions */

document.getElementById("js-warning").hidden = true;


const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const currentMonth = `${year}-${month}`;

document.getElementById("diag_date").setAttribute("max", currentMonth);
/* adapted this method for setting max date to current month; 
reference https://www.tutorialspoint.com/article/how-to-set-an-html-date-picker-max-date-to-today */

const result = document.getElementById("result");
const resultActions = document.getElementById("buttons");

const printButton = document.getElementById("print");
const restartButton = document.getElementById("restart");

const form = document.getElementById("form");

form.addEventListener("submit", async function(event) {

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

    const heading = document.createElement("h2");
    heading.textContent = "Your Programme";
    heading.setAttribute("tabindex", "-1");
    result.append(heading);

    const greeting = document.createElement("p");
    greeting.textContent = `Hi ${answers.firstName}.`;
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
            const exerciseName = document.createElement("h4");
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
        programmeEnd.textContent = `Do this circuit ${programme.circuitRepeats} more time(s). Also try for ${programme.cardioMins} minutes of a type of cardio you enjoy, like walking or cycling. For your cardio, aim for around a ${programme.rpe} out of 10 in terms of effort.`

        result.append(programmeEnd);
    }

    let weatherPromise = null;
    let weatherStatus = null;

    if (answers.postcode && answers.postcode.trim() !== "") {
    
        weatherPromise = getWeatherAdvice(answers.postcode);

        weatherStatus = document.createElement("p");
        weatherStatus.textContent = "Checking weather in your area..."
        weatherStatus.setAttribute("aria-live", "polite");
        weatherStatus.id = "weather_status"
        result.append(weatherStatus);
    }

    form.hidden = true;
    result.hidden = false;
    resultActions.hidden = false;
    heading.focus(); 

    if (weatherPromise) {

        const statement = await weatherPromise;

        weatherStatus.textContent = 
            statement || "Weather information isn't available right now.";
    }
})

printButton.addEventListener("click", function () {
    window.print();
});

restartButton.addEventListener("click", function () {
    form.reset();
    result.replaceChildren();
    result.hidden = true;
    resultActions.hidden = true;
    form.hidden = false;
    document.getElementById("formHeading").focus(); 
});

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

function getWeatherStatement(code) {
    for (const category of Object.values(weather)) {
        if (category.codes.includes(code)) {
            return category.content;
        }
    }

    return null;
}
async function getWeatherAdvice(postcode) {
    
    try {
    /*making sure the postcode is in a clean format*/
    const cleanPostcode = postcode
    .replace(/\s/g, "")
    .toUpperCase();

    /*sending cleaned postcode to api.postcodes.io*/
    const postcodeResponse = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`
    );

    if (!postcodeResponse.ok) {
        throw new Error("Postcode lookup failed.");
    }

    const postcodeData = await postcodeResponse.json();

    const longitude = postcodeData.result.longitude;
    const latitude = postcodeData.result.latitude;

    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`
    );

    if (!weatherResponse.ok) {
        throw new Error("Weather lookup failed.");
    }

    const weatherInfo = await weatherResponse.json();

    const weatherCodeInfo = weatherInfo.current.weather_code;
    return getWeatherStatement(weatherCodeInfo);
    } catch (error) {
        console.error("Weather information unavailable: ", error);
        return null;
    }
}

