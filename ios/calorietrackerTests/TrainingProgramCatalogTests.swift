import Testing
@testable import calorietracker

struct TrainingProgramCatalogTests {
    @Test func priorityProgramMatchesApprovedPplulRoster() {
        #expect(TrainingProgramCatalog.pplul.map(\.id) == ["push", "pull", "legs", "upper", "lower"])
        #expect(TrainingProgramCatalog.pplul.map { $0.exercises.count } == [6, 6, 6, 7, 6])
        #expect(TrainingProgramCatalog.push.exercises.first?.options.first?.name.english == "Smith-machine incline press")
        #expect(TrainingProgramCatalog.push.exercises[1].options.first?.name.english == "Machine shoulder press")
        #expect(TrainingProgramCatalog.lower.exercises.first?.options.first?.name.english == "Pendulum squat")
        #expect(TrainingProgramCatalog.pplul.flatMap(\.exercises).allSatisfy { $0.options.count == 5 })
    }

    @Test func fourWeekWaveDeloadsAndResets() {
        #expect((1...8).map { TrainingProgramCatalog.targetRIR(forWeek: $0) } == [3, 2, 1, 4, 3, 2, 1, 4])
        #expect((1...8).map { TrainingProgramCatalog.workingSets(forWeek: $0) } == [3, 3, 3, 2, 3, 3, 3, 2])
    }
}
