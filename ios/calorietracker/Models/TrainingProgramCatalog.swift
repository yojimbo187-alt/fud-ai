import Foundation

struct TrainingText: Hashable {
    let english: String
    let finnish: String

    var localized: String {
        Locale.autoupdatingCurrent.language.languageCode?.identifier.lowercased() == "fi" ? finnish : english
    }
}

struct RankedTrainingExercise: Identifiable, Hashable {
    let id: String
    let name: TrainingText
}

struct TrainingExerciseSlot: Identifiable, Hashable {
    let id: String
    let role: TrainingText
    let options: [RankedTrainingExercise]
    let minimumReps: Int
    let maximumReps: Int
    let loadIncrementKg: Double
    let primaryMuscles: [TrainingText]
    let secondaryMuscles: [TrainingText]

    var recommendedRestSeconds: Int {
        if minimumReps <= 6 { return 210 }
        if maximumReps >= 15 { return 105 }
        return 150
    }
}

struct TrainingDayDefinition: Identifiable, Hashable {
    let id: String
    let name: TrainingText
    let exercises: [TrainingExerciseSlot]
}

enum TrainingProgramCatalog {
    static let blockLength = 16

    static func workingSets(forWeek week: Int) -> Int { week.isMultiple(of: 4) ? 2 : 3 }

    static func targetRIR(forWeek week: Int) -> Int {
        if week.isMultiple(of: 4) { return 4 }
        return [3, 2, 1][(max(1, week) - 1) % 4]
    }

    static let scienceNote = TrainingText(
        english: "Ranked for hypertrophy using stability, progression potential, comfortable full or lengthened range of motion, and target-muscle loading. Large-muscle compound work appears first; isolation work follows. Individual comfort and performance still decide the best choice for you.",
        finnish: "Liikkeet on järjestetty lihaskasvua varten vakauden, nousujohteisuuden, miellyttävän täyden tai venytyspainotteisen liikeradan ja kohdelihaksen kuormituksen perusteella. Suurten lihasryhmien moninivelliikkeet tehdään ensin ja eristävät liikkeet niiden jälkeen. Oma tuntuma ja suorituskyky ratkaisevat silti sinulle parhaan vaihtoehdon."
    )

    private static let pushSource = day("push", "Push", "Työntävät", [
        slot("upper_chest", "Upper-chest press", "Ylärinnan punnerrus", 6, 10, 2.5, ["Chest", "Rinta"], ["Triceps", "Ojentajat", "Front delts", "Etuhartiat"], [
            ("Smith-machine incline press", "Smith-vinopenkki"), ("Plate-loaded incline press", "Levypainollinen vinopenkkikone"), ("Incline dumbbell press", "Käsipainovinopenkki"), ("Low-incline barbell press", "Loiva vinopenkki tangolla"), ("Single-arm cable press", "Yhden käden taljapunnerrus")]),
        slot("chest_isolation", "Chest isolation", "Rinnan eristävä liike", 10, 15, 1, ["Chest", "Rinta"], [], [
            ("Cable fly (lengthened bias)", "Taljaflyes venytyspainotteisesti"), ("Pec-deck fly", "Pec deck -flyes"), ("Bayesian cable fly", "Bayesian-taljaflyes"), ("Dumbbell fly (controlled)", "Hallittu käsipainoflyes"), ("Push-up on handles", "Punnerrus kahvoilla")]),
        slot("shoulder_press", "Shoulder press", "Olkapääpunnerrus", 6, 10, 2.5, ["Front delts", "Etuhartiat"], ["Triceps", "Ojentajat"], [
            ("Machine shoulder press", "Olkapääpunnerrus koneessa"), ("Smith shoulder press", "Smith-olkapääpunnerrus"), ("Seated dumbbell press", "Istuen käsipainopunnerrus"), ("High-incline machine press", "Jyrkkä vinopenkkipunnerrus koneessa"), ("Landmine press", "Landmine-punnerrus")]),
        slot("lateral_delts", "Lateral delts", "Sivuhartiat", 10, 20, 1, ["Side delts", "Sivuhartiat"], [], [
            ("Cable lateral raise", "Vipunosto sivulle taljassa"), ("Machine lateral raise", "Vipunosto sivulle koneessa"), ("Lean-away cable raise", "Nojaava taljavipunosto"), ("Dumbbell lateral raise", "Vipunosto sivulle käsipainoilla"), ("Incline bench lateral raise", "Vipunosto sivulle vinopenkillä")]),
        slot("triceps_long", "Triceps long head", "Ojentajan pitkä pää", 8, 15, 1, ["Triceps", "Ojentajat"], [], [
            ("Overhead cable extension", "Ojentajapunnerrus pään yli taljassa"), ("Single-arm overhead cable extension", "Yhden käden ojentajapunnerrus pään yli"), ("EZ-bar overhead extension", "EZ-tangon ojentajapunnerrus pään yli"), ("Dumbbell overhead extension", "Käsipainon ojentajapunnerrus pään yli"), ("Incline cable skull crusher", "Taljaskull crusher vinopenkillä")]),
        slot("triceps_pressdown", "Triceps pressdown", "Ojentajapunnerrus", 8, 15, 1, ["Triceps", "Ojentajat"], ["Chest", "Rinta"], [
            ("Cable pressdown", "Ojentajapunnerrus taljassa"), ("Single-arm cable pressdown", "Yhden käden ojentajapunnerrus taljassa"), ("V-bar pressdown", "V-kahvan ojentajapunnerrus"), ("Assisted dip", "Avustettu dippi"), ("Close-grip push-up", "Kapea punnerrus")])
    ])

    static let push = day("push", "Push", "Työntävät", [
        pushSource.exercises[0], pushSource.exercises[2], pushSource.exercises[1],
        pushSource.exercises[3], pushSource.exercises[4], pushSource.exercises[5]
    ])

    static let pull = day("pull", "Pull", "Vetävät", [
        slot("vertical_pull", "Vertical pull", "Pystysuuntainen veto", 6, 12, 2.5, ["Lats", "Leveät selkälihakset"], ["Biceps", "Hauikset"], [
            ("Neutral-grip pulldown", "Neutraali ylätalja"), ("Assisted neutral-grip pull-up", "Avustettu neutraali leuanveto"), ("Single-arm lat pulldown", "Yhden käden ylätalja"), ("Pronated pulldown", "Myötäotteinen ylätalja"), ("Chin-up", "Vastaoteleuanveto")]),
        slot("upper_back_row", "Upper-back row", "Yläselkäsoutu", 6, 12, 2.5, ["Upper back", "Yläselkä"], ["Biceps", "Hauikset", "Rear delts", "Takahartiat"], [
            ("Chest-supported wide row", "Rintatuettu leveä soutu"), ("Plate-loaded upper-back row", "Levypainollinen yläselkäsoutu"), ("Seal row", "Seal row"), ("Cable high row", "Korkea taljasoutu"), ("Wide-grip machine row", "Leveä soutu koneessa")]),
        slot("lat_row", "Lat-focused row", "Leveään selkälihakseen painottuva soutu", 8, 15, 2.5, ["Lats", "Leveät selkälihakset"], ["Biceps", "Hauikset"], [
            ("Single-arm cable lat row", "Yhden käden lat-soutu taljassa"), ("Chest-supported close row", "Rintatuettu kapea soutu"), ("Machine low row", "Matala soutu koneessa"), ("Dumbbell lat row", "Käsipainosoutu lat-painotuksella"), ("Straight-arm pulldown", "Suorin käsin ylätaljaveto")]),
        slot("rear_delts", "Rear delts", "Takahartiat", 10, 20, 1, ["Rear delts", "Takahartiat"], [], [
            ("Reverse pec deck", "Käänteinen pec deck"), ("Cable rear-delt fly", "Takahartiaflyes taljassa"), ("Chest-supported rear-delt row", "Rintatuettu takahartiasoutu"), ("Single-arm cable rear fly", "Yhden käden takahartiaflyes taljassa"), ("Bent-over dumbbell raise", "Kumartunut vipunosto käsipainoilla")]),
        slot("lengthened_biceps", "Lengthened biceps", "Hauis venytyspainotteisesti", 8, 15, 1, ["Biceps", "Hauikset"], [], [
            ("Bayesian cable curl", "Bayesian-taljahauiskääntö"), ("Incline dumbbell curl", "Hauiskääntö vinopenkillä"), ("Behind-body cable curl", "Taljahauiskääntö vartalon takaa"), ("Preacher curl", "Scott-hauiskääntö"), ("Alternating dumbbell curl", "Vuorottainen käsipainohauiskääntö")]),
        slot("neutral_curl", "Brachialis / neutral curl", "Brachialis / neutraali hauiskääntö", 8, 15, 1, ["Biceps", "Hauikset"], ["Forearms", "Kyynärvarret"], [
            ("Rope hammer curl", "Köysivasarakääntö"), ("Cross-body hammer curl", "Vasarakääntö vartalon poikki"), ("Machine neutral curl", "Neutraali hauiskääntö koneessa"), ("Dumbbell hammer curl", "Vasarakääntö käsipainoilla"), ("Reverse EZ-bar curl", "Käänteinen EZ-hauiskääntö")])
    ])

    static let legs = day("legs", "Legs", "Jalat", lowerSlots(primaryQuad: "Hack squat", calfFirst: "Standing calf raise", includeUnilateral: false))

    static let upper = day("upper", "Upper", "Ylävartalo", [
        slot("chest_press", "Chest press", "Rintapunnerrus", 6, 10, 2.5, ["Chest", "Rinta"], ["Triceps", "Ojentajat", "Front delts", "Etuhartiat"], [
            ("Plate-loaded chest press", "Levypainollinen rintapunnerrus"), ("Smith incline press", "Smith-vinopenkki"), ("Machine chest press", "Rintapunnerrus koneessa"), ("Incline dumbbell press", "Käsipainovinopenkki"), ("Barbell bench press", "Penkkipunnerrus tangolla")]),
        pull.exercises[1], pull.exercises[0], push.exercises[1], push.exercises[3],
        slot("upper_biceps", "Biceps", "Hauikset", 8, 15, 1, ["Biceps", "Hauikset"], [], [
            ("Bayesian cable curl", "Bayesian-taljahauiskääntö"), ("Preacher curl", "Scott-hauiskääntö"), ("Incline dumbbell curl", "Hauiskääntö vinopenkillä"), ("Cable curl", "Hauiskääntö taljassa"), ("EZ-bar curl", "EZ-tankohauiskääntö")]),
        slot("upper_triceps", "Triceps", "Ojentajat", 8, 15, 1, ["Triceps", "Ojentajat"], [], [
            ("Overhead cable extension", "Ojentajapunnerrus pään yli taljassa"), ("Single-arm overhead extension", "Yhden käden ojentajapunnerrus pään yli"), ("Cable pressdown", "Ojentajapunnerrus taljassa"), ("Machine dip", "Dippi koneessa"), ("EZ-bar skull crusher", "EZ-tangon skull crusher")])
    ])

    static let lower = day("lower", "Lower", "Alavartalo", lowerSlots(primaryQuad: "Pendulum squat", calfFirst: "Seated calf raise", includeUnilateral: true))

    static let pplul = [push, pull, legs, upper, lower]

    static func day(for program: TrainingProgram, index: Int) -> TrainingDayDefinition? {
        guard !pplul.isEmpty else { return nil }
        switch program {
        case .pushPullLegsUpperLower:
            return pplul.indices.contains(index) ? pplul[index] : nil
        case .upperLower:
            let days = [upper, lower, upper, lower]
            return days.indices.contains(index) ? days[index] : nil
        case .fullBody:
            let selections = [
                [push.exercises[0], pull.exercises[0], legs.exercises[0], legs.exercises[3], push.exercises[3], legs.exercises[5]],
                [upper.exercises[0], upper.exercises[1], lower.exercises[1], lower.exercises[2], upper.exercises[5], upper.exercises[6]],
                [push.exercises[2], pull.exercises[2], legs.exercises[2], legs.exercises[4], pull.exercises[3], lower.exercises[5]]
            ]
            guard selections.indices.contains(index) else { return nil }
            return TrainingDayDefinition(id: "full_\(index)", name: TrainingText(english: "Full Body \(["A", "B", "C"][index])", finnish: "Koko vartalo \(["A", "B", "C"][index])"), exercises: selections[index])
        case .activeRecovery:
            return index == 0
                ? day("mobility", "Mobility", "Liikkuvuus", Array(legs.exercises.prefix(3)))
                : day("technique", "Technique", "Tekniikka", [push.exercises[0], pull.exercises[0], legs.exercises[0]])
        }
    }

    private static func lowerSlots(primaryQuad: String, calfFirst: String, includeUnilateral: Bool) -> [TrainingExerciseSlot] {
        var result = [
            slot("quad_compound_\(primaryQuad)", "Quad compound", "Etureisien moninivelliike", 6, 10, 5, ["Quads", "Etureidet"], ["Glutes", "Pakarat"], primaryQuad == "Pendulum squat" ? [
                ("Pendulum squat", "Pendulum-kyykky"), ("Hack squat", "Hack-kyykky"), ("Smith squat (heels elevated)", "Smith-kyykky kantapäät korotettuna"), ("Belt squat", "Vyökyykky"), ("High-bar squat", "Korkea takakyykky")
            ] : [
                ("Hack squat", "Hack-kyykky"), ("Pendulum squat", "Pendulum-kyykky"), ("Smith squat (heels elevated)", "Smith-kyykky kantapäät korotettuna"), ("High-bar squat", "Korkea takakyykky"), ("Belt squat", "Vyökyykky")
            ]),
            slot("hip_hinge_\(includeUnilateral)", includeUnilateral ? "Hip hinge / glutes" : "Hip hinge", includeUnilateral ? "Lantionojennus / pakarat" : "Lantionojennus", 6, 10, 5, ["Hamstrings", "Takareidet", "Glutes", "Pakarat"], ["Spinal erectors", "Selänojentajat"], includeUnilateral ? [
                ("Romanian deadlift", "Romanialainen maastaveto"), ("Smith Romanian deadlift", "Romanialainen maastaveto Smithissä"), ("Hip thrust machine", "Lantionnosto koneessa"), ("Barbell hip thrust", "Lantionnosto tangolla"), ("45-degree back extension", "45 asteen selänojennus")
            ] : [
                ("Romanian deadlift", "Romanialainen maastaveto"), ("Smith Romanian deadlift", "Romanialainen maastaveto Smithissä"), ("45-degree back extension", "45 asteen selänojennus"), ("Good morning", "Good morning"), ("Cable pull-through", "Pull-through taljassa")
            ])
        ]
        if includeUnilateral {
            result.append(slot("unilateral_legs", "Unilateral legs", "Yhden jalan liike", 8, 15, 2.5, ["Quads", "Etureidet", "Glutes", "Pakarat"], [], [
                ("Bulgarian split squat", "Bulgarialainen askelkyykky"), ("Reverse lunge (Smith)", "Peruutusaskelkyykky Smithissä"), ("Step-up", "Korokkeelle nousu"), ("Single-leg press", "Yhden jalan jalkaprässi"), ("Walking lunge", "Kävelyaskelkyykky")]))
        } else {
            result.append(slot("leg_press", "Leg press pattern", "Jalkaprässiliike", 8, 15, 5, ["Quads", "Etureidet"], ["Glutes", "Pakarat"], [
                ("Leg press (deep ROM)", "Jalkaprässi syvällä liikeradalla"), ("Single-leg press", "Yhden jalan jalkaprässi"), ("Machine squat", "Kyykky koneessa"), ("Front squat", "Etukyykky"), ("Goblet squat (heels elevated)", "Goblet-kyykky kantapäät korotettuna")]))
        }
        result += [
            slot("knee_flexion_\(includeUnilateral)", "Knee flexion", "Polven koukistus", 8, 15, 2.5, ["Hamstrings", "Takareidet"], [], [
                ("Seated leg curl", "Reidenkoukistus istuen"), ("Lying leg curl", "Reidenkoukistus maaten"), ("Single-leg seated curl", "Yhden jalan reidenkoukistus istuen"), ("Nordic curl (assisted)", "Avustettu Nordic curl"), ("Stability-ball leg curl", "Reidenkoukistus jumppapallolla")]),
            slot("knee_extension_\(includeUnilateral)", "Knee extension", "Polven ojennus", 10, 20, 2.5, ["Quads", "Etureidet"], [], [
                ("Leg extension", "Reidenojennus"), ("Single-leg extension", "Yhden jalan reidenojennus"), ("Sissy squat (assisted)", "Avustettu sissy-kyykky"), ("Reverse Nordic curl", "Käänteinen Nordic curl"), ("Spanish squat", "Spanish squat")]),
            slot("calves_\(calfFirst)", "Calves", "Pohkeet", 8, 15, 2.5, ["Calves", "Pohkeet"], [], calfFirst == "Seated calf raise" ? [
                ("Seated calf raise", "Pohjenousu istuen"), ("Standing calf raise", "Pohjenousu seisten"), ("Leg-press calf raise", "Pohjenousu jalkaprässissä"), ("Smith standing calf raise", "Pohjenousu seisten Smithissä"), ("Single-leg calf raise", "Yhden jalan pohjenousu")
            ] : [
                ("Standing calf raise", "Pohjenousu seisten"), ("Leg-press calf raise", "Pohjenousu jalkaprässissä"), ("Smith standing calf raise", "Pohjenousu seisten Smithissä"), ("Seated calf raise", "Pohjenousu istuen"), ("Single-leg calf raise", "Yhden jalan pohjenousu")])
        ]
        return result
    }

    private static func day(_ id: String, _ en: String, _ fi: String, _ exercises: [TrainingExerciseSlot]) -> TrainingDayDefinition {
        TrainingDayDefinition(id: id, name: TrainingText(english: en, finnish: fi), exercises: exercises)
    }

    private static func slot(_ id: String, _ roleEN: String, _ roleFI: String, _ min: Int, _ max: Int, _ increment: Double, _ primary: [String], _ secondary: [String], _ options: [(String, String)]) -> TrainingExerciseSlot {
        func musclePairs(_ values: [String]) -> [TrainingText] {
            stride(from: 0, to: values.count, by: 2).map { TrainingText(english: values[$0], finnish: values[$0 + 1]) }
        }
        return TrainingExerciseSlot(
            id: id,
            role: TrainingText(english: roleEN, finnish: roleFI),
            options: options.enumerated().map { RankedTrainingExercise(id: "\(id).\($0.offset)", name: TrainingText(english: $0.element.0, finnish: $0.element.1)) },
            minimumReps: min,
            maximumReps: max,
            loadIncrementKg: increment,
            primaryMuscles: musclePairs(primary),
            secondaryMuscles: musclePairs(secondary)
        )
    }
}
