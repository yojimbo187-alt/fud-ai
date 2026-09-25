package com.apoorvdarshan.calorietracker.models

import java.util.Locale

data class TrainingText(val english: String, val finnish: String) {
    fun localized(): String = if (Locale.getDefault().language.equals("fi", ignoreCase = true)) finnish else english
}

data class RankedTrainingExercise(val id: String, val name: TrainingText)

data class TrainingExerciseSlot(
    val id: String,
    val role: TrainingText,
    val options: List<RankedTrainingExercise>,
    val minimumReps: Int,
    val maximumReps: Int,
    val loadIncrementKg: Double,
    val primaryMuscles: List<TrainingText>,
    val secondaryMuscles: List<TrainingText>
) {
    val recommendedRestSeconds: Int
        get() = when {
            minimumReps <= 6 -> 210
            maximumReps >= 15 -> 105
            else -> 150
        }
}

data class TrainingDayDefinition(
    val id: String,
    val name: TrainingText,
    val exercises: List<TrainingExerciseSlot>
)

/**
 * The ranked PPLUL catalog shared conceptually with iOS. Rankings prioritize stable loading,
 * measurable progression, a comfortable full/lengthened ROM and target-muscle loading. They are
 * starting points rather than claims that one implement is universally superior.
 */
object TrainingProgramCatalog {
    const val BLOCK_LENGTH = 16

    fun workingSets(week: Int): Int = if (week % 4 == 0) 2 else 3

    fun targetRir(week: Int): Int = if (week % 4 == 0) 4 else listOf(3, 2, 1)[(week.coerceAtLeast(1) - 1) % 4]

    val scienceNote = TrainingText(
        "Ranked for hypertrophy using stability, progression potential, comfortable full or lengthened range of motion, and target-muscle loading. Large-muscle compound work appears first; isolation work follows. Individual comfort and performance still decide the best choice for you.",
        "Liikkeet on järjestetty lihaskasvua varten vakauden, nousujohteisuuden, miellyttävän täyden tai venytyspainotteisen liikeradan ja kohdelihaksen kuormituksen perusteella. Suurten lihasryhmien moninivelliikkeet tehdään ensin ja eristävät liikkeet niiden jälkeen. Oma tuntuma ja suorituskyky ratkaisevat silti sinulle parhaan vaihtoehdon."
    )

    private val pushSource = day("push", "Push", "Työntävät", listOf(
        slot("upper_chest", "Upper-chest press", "Ylärinnan punnerrus", 6, 10, 2.5, listOf("Chest" to "Rinta"), listOf("Triceps" to "Ojentajat", "Front delts" to "Etuhartiat"),
            listOf("Smith-machine incline press" to "Smith-vinopenkki", "Plate-loaded incline press" to "Levypainollinen vinopenkkikone", "Incline dumbbell press" to "Käsipainovinopenkki", "Low-incline barbell press" to "Loiva vinopenkki tangolla", "Single-arm cable press" to "Yhden käden taljapunnerrus")),
        slot("chest_isolation", "Chest isolation", "Rinnan eristävä liike", 10, 15, 1.0, listOf("Chest" to "Rinta"), emptyList(),
            listOf("Cable fly (lengthened bias)" to "Taljaflyes venytyspainotteisesti", "Pec-deck fly" to "Pec deck -flyes", "Bayesian cable fly" to "Bayesian-taljaflyes", "Dumbbell fly (controlled)" to "Hallittu käsipainoflyes", "Push-up on handles" to "Punnerrus kahvoilla")),
        slot("shoulder_press", "Shoulder press", "Olkapääpunnerrus", 6, 10, 2.5, listOf("Front delts" to "Etuhartiat"), listOf("Triceps" to "Ojentajat"),
            listOf("Machine shoulder press" to "Olkapääpunnerrus koneessa", "Smith shoulder press" to "Smith-olkapääpunnerrus", "Seated dumbbell press" to "Istuen käsipainopunnerrus", "High-incline machine press" to "Jyrkkä vinopenkkipunnerrus koneessa", "Landmine press" to "Landmine-punnerrus")),
        slot("lateral_delts", "Lateral delts", "Sivuhartiat", 10, 20, 1.0, listOf("Side delts" to "Sivuhartiat"), emptyList(),
            listOf("Cable lateral raise" to "Vipunosto sivulle taljassa", "Machine lateral raise" to "Vipunosto sivulle koneessa", "Lean-away cable raise" to "Nojaava taljavipunosto", "Dumbbell lateral raise" to "Vipunosto sivulle käsipainoilla", "Incline bench lateral raise" to "Vipunosto sivulle vinopenkillä")),
        slot("triceps_long", "Triceps long head", "Ojentajan pitkä pää", 8, 15, 1.0, listOf("Triceps" to "Ojentajat"), emptyList(),
            listOf("Overhead cable extension" to "Ojentajapunnerrus pään yli taljassa", "Single-arm overhead cable extension" to "Yhden käden ojentajapunnerrus pään yli", "EZ-bar overhead extension" to "EZ-tangon ojentajapunnerrus pään yli", "Dumbbell overhead extension" to "Käsipainon ojentajapunnerrus pään yli", "Incline cable skull crusher" to "Taljaskull crusher vinopenkillä")),
        slot("triceps_pressdown", "Triceps pressdown", "Ojentajapunnerrus", 8, 15, 1.0, listOf("Triceps" to "Ojentajat"), listOf("Chest" to "Rinta"),
            listOf("Cable pressdown" to "Ojentajapunnerrus taljassa", "Single-arm cable pressdown" to "Yhden käden ojentajapunnerrus taljassa", "V-bar pressdown" to "V-kahvan ojentajapunnerrus", "Assisted dip" to "Avustettu dippi", "Close-grip push-up" to "Kapea punnerrus"))
    ))

    val push = day("push", "Push", "Työntävät", listOf(
        pushSource.exercises[0], pushSource.exercises[2], pushSource.exercises[1],
        pushSource.exercises[3], pushSource.exercises[4], pushSource.exercises[5]
    ))

    val pull = day("pull", "Pull", "Vetävät", listOf(
        slot("vertical_pull", "Vertical pull", "Pystysuuntainen veto", 6, 12, 2.5, listOf("Lats" to "Leveät selkälihakset"), listOf("Biceps" to "Hauikset"),
            listOf("Neutral-grip pulldown" to "Neutraali ylätalja", "Assisted neutral-grip pull-up" to "Avustettu neutraali leuanveto", "Single-arm lat pulldown" to "Yhden käden ylätalja", "Pronated pulldown" to "Myötäotteinen ylätalja", "Chin-up" to "Vastaoteleuanveto")),
        slot("upper_back_row", "Upper-back row", "Yläselkäsoutu", 6, 12, 2.5, listOf("Upper back" to "Yläselkä"), listOf("Biceps" to "Hauikset", "Rear delts" to "Takahartiat"),
            listOf("Chest-supported wide row" to "Rintatuettu leveä soutu", "Plate-loaded upper-back row" to "Levypainollinen yläselkäsoutu", "Seal row" to "Seal row", "Cable high row" to "Korkea taljasoutu", "Wide-grip machine row" to "Leveä soutu koneessa")),
        slot("lat_row", "Lat-focused row", "Leveään selkälihakseen painottuva soutu", 8, 15, 2.5, listOf("Lats" to "Leveät selkälihakset"), listOf("Biceps" to "Hauikset"),
            listOf("Single-arm cable lat row" to "Yhden käden lat-soutu taljassa", "Chest-supported close row" to "Rintatuettu kapea soutu", "Machine low row" to "Matala soutu koneessa", "Dumbbell lat row" to "Käsipainosoutu lat-painotuksella", "Straight-arm pulldown" to "Suorin käsin ylätaljaveto")),
        slot("rear_delts", "Rear delts", "Takahartiat", 10, 20, 1.0, listOf("Rear delts" to "Takahartiat"), emptyList(),
            listOf("Reverse pec deck" to "Käänteinen pec deck", "Cable rear-delt fly" to "Takahartiaflyes taljassa", "Chest-supported rear-delt row" to "Rintatuettu takahartiasoutu", "Single-arm cable rear fly" to "Yhden käden takahartiaflyes taljassa", "Bent-over dumbbell raise" to "Kumartunut vipunosto käsipainoilla")),
        slot("lengthened_biceps", "Lengthened biceps", "Hauis venytyspainotteisesti", 8, 15, 1.0, listOf("Biceps" to "Hauikset"), emptyList(),
            listOf("Bayesian cable curl" to "Bayesian-taljahauiskääntö", "Incline dumbbell curl" to "Hauiskääntö vinopenkillä", "Behind-body cable curl" to "Taljahauiskääntö vartalon takaa", "Preacher curl" to "Scott-hauiskääntö", "Alternating dumbbell curl" to "Vuorottainen käsipainohauiskääntö")),
        slot("neutral_curl", "Brachialis / neutral curl", "Brachialis / neutraali hauiskääntö", 8, 15, 1.0, listOf("Biceps" to "Hauikset"), listOf("Forearms" to "Kyynärvarret"),
            listOf("Rope hammer curl" to "Köysivasarakääntö", "Cross-body hammer curl" to "Vasarakääntö vartalon poikki", "Machine neutral curl" to "Neutraali hauiskääntö koneessa", "Dumbbell hammer curl" to "Vasarakääntö käsipainoilla", "Reverse EZ-bar curl" to "Käänteinen EZ-hauiskääntö"))
    ))

    val legs = day("legs", "Legs", "Jalat", lowerSlots(primaryPendulum = false, includeUnilateral = false))

    val upper = day("upper", "Upper", "Ylävartalo", listOf(
        slot("chest_press", "Chest press", "Rintapunnerrus", 6, 10, 2.5, listOf("Chest" to "Rinta"), listOf("Triceps" to "Ojentajat", "Front delts" to "Etuhartiat"),
            listOf("Plate-loaded chest press" to "Levypainollinen rintapunnerrus", "Smith incline press" to "Smith-vinopenkki", "Machine chest press" to "Rintapunnerrus koneessa", "Incline dumbbell press" to "Käsipainovinopenkki", "Barbell bench press" to "Penkkipunnerrus tangolla")),
        pull.exercises[1], pull.exercises[0], push.exercises[1], push.exercises[3],
        slot("upper_biceps", "Biceps", "Hauikset", 8, 15, 1.0, listOf("Biceps" to "Hauikset"), emptyList(),
            listOf("Bayesian cable curl" to "Bayesian-taljahauiskääntö", "Preacher curl" to "Scott-hauiskääntö", "Incline dumbbell curl" to "Hauiskääntö vinopenkillä", "Cable curl" to "Hauiskääntö taljassa", "EZ-bar curl" to "EZ-tankohauiskääntö")),
        slot("upper_triceps", "Triceps", "Ojentajat", 8, 15, 1.0, listOf("Triceps" to "Ojentajat"), emptyList(),
            listOf("Overhead cable extension" to "Ojentajapunnerrus pään yli taljassa", "Single-arm overhead extension" to "Yhden käden ojentajapunnerrus pään yli", "Cable pressdown" to "Ojentajapunnerrus taljassa", "Machine dip" to "Dippi koneessa", "EZ-bar skull crusher" to "EZ-tangon skull crusher"))
    ))

    val lower = day("lower", "Lower", "Alavartalo", lowerSlots(primaryPendulum = true, includeUnilateral = true))
    val pplul = listOf(push, pull, legs, upper, lower)

    fun day(program: TrainingProgram, index: Int): TrainingDayDefinition? = when (program) {
        TrainingProgram.PUSH_PULL_LEGS_UPPER_LOWER -> pplul.getOrNull(index)
        TrainingProgram.UPPER_LOWER -> listOf(upper, lower, upper, lower).getOrNull(index)
        TrainingProgram.FULL_BODY -> listOf(
            listOf(push.exercises[0], pull.exercises[0], legs.exercises[0], legs.exercises[3], push.exercises[3], legs.exercises[5]),
            listOf(upper.exercises[0], upper.exercises[1], lower.exercises[1], lower.exercises[2], upper.exercises[5], upper.exercises[6]),
            listOf(push.exercises[2], pull.exercises[2], legs.exercises[2], legs.exercises[4], pull.exercises[3], lower.exercises[5])
        ).getOrNull(index)?.let { day("full_$index", "Full Body ${listOf("A", "B", "C")[index]}", "Koko vartalo ${listOf("A", "B", "C")[index]}", it) }
        TrainingProgram.ACTIVE_RECOVERY -> when (index) {
            0 -> day("mobility", "Mobility", "Liikkuvuus", legs.exercises.take(3))
            1 -> day("technique", "Technique", "Tekniikka", listOf(push.exercises[0], pull.exercises[0], legs.exercises[0]))
            else -> null
        }
    }

    private fun lowerSlots(primaryPendulum: Boolean, includeUnilateral: Boolean): List<TrainingExerciseSlot> {
        val result = mutableListOf(
            slot("quad_compound_$primaryPendulum", "Quad compound", "Etureisien moninivelliike", 6, 10, 5.0, listOf("Quads" to "Etureidet"), listOf("Glutes" to "Pakarat"),
                if (primaryPendulum) listOf("Pendulum squat" to "Pendulum-kyykky", "Hack squat" to "Hack-kyykky", "Smith squat (heels elevated)" to "Smith-kyykky kantapäät korotettuna", "Belt squat" to "Vyökyykky", "High-bar squat" to "Korkea takakyykky")
                else listOf("Hack squat" to "Hack-kyykky", "Pendulum squat" to "Pendulum-kyykky", "Smith squat (heels elevated)" to "Smith-kyykky kantapäät korotettuna", "High-bar squat" to "Korkea takakyykky", "Belt squat" to "Vyökyykky")),
            slot("hip_hinge_$includeUnilateral", if (includeUnilateral) "Hip hinge / glutes" else "Hip hinge", if (includeUnilateral) "Lantionojennus / pakarat" else "Lantionojennus", 6, 10, 5.0, listOf("Hamstrings" to "Takareidet", "Glutes" to "Pakarat"), listOf("Spinal erectors" to "Selänojentajat"),
                if (includeUnilateral) listOf("Romanian deadlift" to "Romanialainen maastaveto", "Smith Romanian deadlift" to "Romanialainen maastaveto Smithissä", "Hip thrust machine" to "Lantionnosto koneessa", "Barbell hip thrust" to "Lantionnosto tangolla", "45-degree back extension" to "45 asteen selänojennus")
                else listOf("Romanian deadlift" to "Romanialainen maastaveto", "Smith Romanian deadlift" to "Romanialainen maastaveto Smithissä", "45-degree back extension" to "45 asteen selänojennus", "Good morning" to "Good morning", "Cable pull-through" to "Pull-through taljassa"))
        )
        result += if (includeUnilateral) {
            slot("unilateral_legs", "Unilateral legs", "Yhden jalan liike", 8, 15, 2.5, listOf("Quads" to "Etureidet", "Glutes" to "Pakarat"), emptyList(),
                listOf("Bulgarian split squat" to "Bulgarialainen askelkyykky", "Reverse lunge (Smith)" to "Peruutusaskelkyykky Smithissä", "Step-up" to "Korokkeelle nousu", "Single-leg press" to "Yhden jalan jalkaprässi", "Walking lunge" to "Kävelyaskelkyykky"))
        } else {
            slot("leg_press", "Leg press pattern", "Jalkaprässiliike", 8, 15, 5.0, listOf("Quads" to "Etureidet"), listOf("Glutes" to "Pakarat"),
                listOf("Leg press (deep ROM)" to "Jalkaprässi syvällä liikeradalla", "Single-leg press" to "Yhden jalan jalkaprässi", "Machine squat" to "Kyykky koneessa", "Front squat" to "Etukyykky", "Goblet squat (heels elevated)" to "Goblet-kyykky kantapäät korotettuna"))
        }
        result += listOf(
            slot("knee_flexion_$includeUnilateral", "Knee flexion", "Polven koukistus", 8, 15, 2.5, listOf("Hamstrings" to "Takareidet"), emptyList(),
                listOf("Seated leg curl" to "Reidenkoukistus istuen", "Lying leg curl" to "Reidenkoukistus maaten", "Single-leg seated curl" to "Yhden jalan reidenkoukistus istuen", "Nordic curl (assisted)" to "Avustettu Nordic curl", "Stability-ball leg curl" to "Reidenkoukistus jumppapallolla")),
            slot("knee_extension_$includeUnilateral", "Knee extension", "Polven ojennus", 10, 20, 2.5, listOf("Quads" to "Etureidet"), emptyList(),
                listOf("Leg extension" to "Reidenojennus", "Single-leg extension" to "Yhden jalan reidenojennus", "Sissy squat (assisted)" to "Avustettu sissy-kyykky", "Reverse Nordic curl" to "Käänteinen Nordic curl", "Spanish squat" to "Spanish squat")),
            slot("calves_$primaryPendulum", "Calves", "Pohkeet", 8, 15, 2.5, listOf("Calves" to "Pohkeet"), emptyList(),
                if (primaryPendulum) listOf("Seated calf raise" to "Pohjenousu istuen", "Standing calf raise" to "Pohjenousu seisten", "Leg-press calf raise" to "Pohjenousu jalkaprässissä", "Smith standing calf raise" to "Pohjenousu seisten Smithissä", "Single-leg calf raise" to "Yhden jalan pohjenousu")
                else listOf("Standing calf raise" to "Pohjenousu seisten", "Leg-press calf raise" to "Pohjenousu jalkaprässissä", "Smith standing calf raise" to "Pohjenousu seisten Smithissä", "Seated calf raise" to "Pohjenousu istuen", "Single-leg calf raise" to "Yhden jalan pohjenousu"))
        )
        return result
    }

    private fun day(id: String, english: String, finnish: String, exercises: List<TrainingExerciseSlot>) =
        TrainingDayDefinition(id, TrainingText(english, finnish), exercises)

    private fun slot(
        id: String, roleEnglish: String, roleFinnish: String, minimumReps: Int, maximumReps: Int,
        increment: Double, primary: List<Pair<String, String>>, secondary: List<Pair<String, String>>,
        options: List<Pair<String, String>>
    ) = TrainingExerciseSlot(
        id, TrainingText(roleEnglish, roleFinnish),
        options.mapIndexed { index, pair -> RankedTrainingExercise("$id.$index", TrainingText(pair.first, pair.second)) },
        minimumReps, maximumReps, increment,
        primary.map { TrainingText(it.first, it.second) }, secondary.map { TrainingText(it.first, it.second) }
    )
}
