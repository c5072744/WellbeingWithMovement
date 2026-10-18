/* javascript file for Wellbeing with Movement form data */

const recencyStatement = {
    recent: "Since your diagnosis was not too long ago, you're likely still feeling a few side effects.", 
    notRecent: "Even though your diagnosis was a bit ago, you might still be feeling some side effects."
};

const cancerAdvice = {
    "breast": {
        message: "Find more information about breast cancer on the Macmillan site.",
        link: "https://www.macmillan.org.uk/cancer-information-and-support/breast-cancer"
    },
    "bowel": {
        message: "Find more information about bowel cancer on the Macmillan site.", 
        link: "https://www.macmillan.org.uk/cancer-information-and-support/bowel-cancer"
    },
    "lung": {
        message: "Find more information about lung cancer on the Macmillan site.",
        link: "https://www.macmillan.org.uk/cancer-information-and-support/lung-cancer"
    },
    "prostate": {
        message: "Find more information about prostate cancer on the Macmillan site.",
        link: "https://www.macmillan.org.uk/cancer-information-and-support/prostate-cancer"
    }
};

const treatmentAdvice = {
    surgery: "After surgery, it's common to have fatigue, pain, and limited mobility. Starting out slow and building up daily activity can help recovery and overall well-being.", 
    chemo: "Common chemotherapy side effects include fatigue, nausea, changes in sensation in your hands and feet. Staying hydrated and taking small sips of water during your day is important to help combat these side effects.", 
    rad: "Radiotherapy can cause fatigue, skin irritation, and pain or discomfort near the treatment area. Gentle flexibility and mobility activities can help keep muscles and joints from getting too stiff.", 
    it_ht: "Immunotherapy and hormonal therapy may lead to fatigue, joint pain, and changes in mood or appetite. Prioritising rest and doing low-impact activities like walking or gentle stretches are ways to be active without it being too stressful."
};

const noExercise = {
    opener: "Even though you aren't able to do exercise right now, you can still try to have less sedentary time which is also important for overall good health. These activities can help with overall physical and emotional health. Take a look at these breathing and mindfulness practices.", 
    blocks: [
        {title: "Breathing Rectangle", content: "Try to find something shaped like a rectangle. This could be a picture, TV, or a microwave. Follow the edges of the rectangle with your eyes, breathing in on the sides and slowly breathing out on the top and bottom."},
        {title: "Sitting Meditation", content: "Sit comfortably with your back straight, feet flat and hands in your lap. Breathing through the nose, follow each inhale and exhale. It's normal to get distracted by thoughts or sounds; acknowledge them, set them aside, and refocus on your breathing. Even one minute of focused breathing can bring a sense of calm and wellbeing."},
        {title: "Everyday Movement", content: "Even just reducing the amount of time you spend sitting is a good way to improve your health. Break up long bouts of sitting by standing up for 30 seconds every 30 minutes. Cooking, cleaning, and puttering around the house are all ways you can add bits of movement to your day."}
    ]
};

const difficultyMatrix = {
    no_exp: {
        no_conf: "beginner", 
        some_conf: "beginner", 
        very_conf: "beginner"
    }, 
    
    some_exp: {
        no_conf: "intermediate", 
        some_conf: "intermediate", 
        very_conf: "advanced"
    },
    
    lots_exp: {
        no_conf: "intermediate", 
        some_conf: "advanced", 
        very_conf: "advanced"
    }
};


const paLevels = {
    "beginner": {
        opener: "Good for you for starting something brand new! This is a great way to introduce yourself to being more physically active. This programme is quick and will help you get into a habit of being active. Once you are comfortable with it, you can add another circuit or session per week. Some of the information here aims to support you to be more physically active.",
        exerciseList: [
            {id: "E01", dose: "15"}, 
            {id: "E02", dose: "10 per side"}, 
            {id: "E03", dose: "12 with 1 sec hold"}, 
            {id: "E04", dose: "10"}, 
            {id: "E05", dose: "15"}
        ],
        circuitRepeats: 1,
        cardioMins: 15,
        rpe: "3"
    },

    "intermediate": {
        opener: "This is a great way to reintroduce or increase your levels of physical activity! This programme is quick and will help you get into a habit of being active. Once you are comfortable with it, you can add another circuit or session per week, or add some more cardio time.",
        exerciseList: [
            {id: "E06", dose: "10 per side"}, 
            {id: "E07", dose: "10 per side"}, 
            {id: "E03", dose: "12 with 3 sec hold"}, 
            {id: "E08", dose: "10"}, 
            {id: "E05", dose: "15"}
        ],
        circuitRepeats: 2,
        cardioMins: 20,
        rpe: "4"
    }, 
    
    "advanced": {
        opener: "Glad to hear you already have activity experience! This programme is quick and can be a nice change from your usual routine. Once you are comfortable with it, you can add another circuit or session per week, or add some more cardio time.",
        exerciseList: [
            {id: "E09", dose: "10 per side"}, 
            {id: "E10", dose: "10 per side"}, 
            {id: "E03", dose: "12 with 5 sec hold"}, 
            {id: "E11", dose: "10"}, 
            {id: "E12", dose: "15"}
        ],
        circuitRepeats: 3,
        cardioMins: 30,
        rpe: "4 to 5"
    }
};

const exercises = {
    E01: {
        name: "Sit to Stands", 
        images: [
            "sit-stands-1.jpg", 
            "sit-stands-2.jpg",  
            "sit-stands-3.jpg",
            "sit-stands-4.jpg"
        ], 
        caption: "Sit up straight on the edge of a chair, feet flat on the floor. Cross your arms over your chest and keep your back straight. Then lean slightly forward and stand up. With the same form, slowly lower to sit back down in the chair."
    },

    E02: {        
        name: "Alternate Leg Lowers", 
        images: [
            "alternating-leg-lowers-1.jpg", 
            "alternating-leg-lowers-2.jpg", 
            "alternating-leg-lowers-3.jpg", 
            "alternating-leg-lowers-4.jpg"
        ], 
        caption: "Lie on your back and lift your legs so knees and hips are both bent at 90 degrees. Draw your belly in and slowly lower one leg towards the floor, keeping that leg bent. Lift your leg and return to starting position. Repeat with the other leg."
    },
    
    E03: {        
        name: "Glute bridges", 
        images: [
            "bridge-1.jpg",
            "bridge-2.jpg"
        ], 
        caption: "Lie on your back with feet flat on the floor, knees bent. Draw your belly in and lift your hips towards the ceiling, squeezing your buttocks. Slowly lower back down to the floor."
    },
    
    E04: {        
        name: "Wall or Worktop Push-ups", 
        images: [
            "counter-push-up-1.jpg",
            "counter-push-up-2.jpg"
        ], 
        caption: "Stand facing a wall or worktop with both hands on the surface. Draw your belly in and slowly bend your elbows to lower towards the surface, keeping your body straight. Slowly push back to start position."
    },

    E05: {        
        name: "Calf Raises", 
        images: [
            "calf-raises-1.jpg",
            "calf-raises-2.jpg"
        ], 
        caption: "Stand up straight with feet about hip width apart. Push up onto your tiptoes, hold for one second, then slowly lower your heels back to the ground."
    },

    E06: {        
        name: "Lunges", 
        images: [
            "lunges-1.jpg",
            "lunges-2.jpg",
            "lunges-3.jpg",
            "lunges-4.jpg"
        ], 
        caption: "Stand up straight with feet about hip width apart. With one leg, take one big step forward bending both knees to lower your body towards the floor. Keep your back straight, then push back to a standing position. Repeat with the other leg."
    },

    E07: {        
        name: "Heel Touches", 
        images: [
            "heel-touches-1.jpg",
            "heel-touches-2.jpg"
        ], 
        caption: "Lie on your back with feet flat on the floor, knees bent. Draw your belly in and lift your shoulders and head off the ground. Then, try to touch your right hand to your right heel, bending at the side. Return to centre then repeat on the other side."
    },

    E08: {        
        name: "Kneeling Push-ups", 
        images: [
            "push-up-from-knees-1.jpg",
            "push-up-from-knees-2.jpg"
        ], 
        caption: "Lie face-down on the floor with your hands even with your chest, a bit more than shoulder width apart. Draw your belly in and push against the floor to raise up keeping knees on the ground. Slowly lower back down."
    },

    E09: {        
        name: "Step-ups", 
        images: [
            "step-ups-1.jpg",
            "step-ups-2.jpg",
            "step-ups-3.jpg",
            "step-ups-4.jpg"
        ], 
        caption: "Stand facing a staircase or a sturdy step. Step up onto the step one foot at a time then carefully step back to the floor leading with the same leg. Repeat on the other side."
    },

    E10: {        
        name: "All-fours Alternate Raises", 
        images: [
            "all-fours-1.jpg",
            "all-fours-2.jpg",
            "all-fours-3.jpg",
            "all-fours-4.jpg"
        ], 
        caption: "Start with hands and knees on the floor. Keep your back straight throughout the movement. Carefully lift one arm and the opposite leg off the floor at the same time. Slowly lower back to the floor. Repeat on the other side."
    },

    E11: {        
        name: "Push-ups", 
        images: [
            "push-up-from-toes-1.jpg",
            "push-up-from-toes-2.jpg"
        ], 
        caption: "Lie face-down on the floor with your hands even with your chest, a bit more than shoulder width apart. Draw your belly in and tuck your toes. Push against the floor to raise up staying on your toes. Slowly lower back down."
    },

    E12: {        
        name: "Squats", 
        images: [
            "full-squat-1.jpg",
            "full-squat-2.jpg"
        ], 
        caption: "Stand up straight with feet slightly wider than hip width apart. Keep your back straight and bend at the hips and knees like you're going to sit down. Lower down as far as you're comfortable, then return to standing."
    }
};

const weather = {
    "good": {
        codes: [0,1,2,3], 
        content: "Looks like a good day to be outside in your region, if you're able."
    },
    "okay": {
        codes: [45,48,51,53,55,61,80],
        content: "Looks like a decent day to be outside in your region, if you're able. Bring a coat or brolly!"
    },
    "bad": {
        codes: [56,57,63,65,66,67,71,73,75,77,81,82,85,86,95,96,97,99],
        content: "Weather in your region shows you might want to plan for inside activities today."
    }
}