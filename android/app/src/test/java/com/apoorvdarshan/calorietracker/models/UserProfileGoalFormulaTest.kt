package com.apoorvdarshan.calorietracker.models

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class UserProfileGoalFormulaTest {
    @Test
    fun knownBodyFatAlwaysUsesKatchEvenWithLegacyFalsePreference() {
        val base = UserProfile(weightKg = 80.0, heightCm = 180.0, bodyFatPercentage = 0.20)

        assertTrue(base.copy(useBodyFatInBMR = null).usesBodyFatForBMR)
        assertTrue(base.copy(useBodyFatInBMR = true).usesBodyFatForBMR)
        assertTrue(base.copy(useBodyFatInBMR = false).usesBodyFatForBMR)
        assertEquals(
            370.0 + 21.6 * 0.8 * 80.0,
            base.copy(useBodyFatInBMR = false).bmr,
            0.001
        )
    }

    @Test
    fun proteinActivityRatesAreFullBodyweightEquivalents() {
        val withBodyFat = UserProfile(
            weightKg = 100.0,
            bodyFatPercentage = 0.30,
            activityLevel = ActivityLevel.MODERATE,
            goal = WeightGoal.LOSE
        )
        val withoutBodyFat = withBodyFat.copy(bodyFatPercentage = null)

        assertEquals(195, withBodyFat.proteinGoal)
        assertEquals(withoutBodyFat.proteinGoal, withBodyFat.proteinGoal)
    }

    @Test
    fun selectedTrainingProgramChangesTargets() {
        val recovery = UserProfile(trainingProgramId = TrainingProgram.ACTIVE_RECOVERY.name)
        val fiveDay = recovery.copy(trainingProgramId = TrainingProgram.PUSH_PULL_LEGS_UPPER_LOWER.name)

        assertTrue(fiveDay.tdee > recovery.tdee)
        assertTrue(fiveDay.dailyCalories > recovery.dailyCalories)
        assertTrue(fiveDay.proteinGoal > recovery.proteinGoal)
        assertTrue(fiveDay.goalInputSignature != recovery.goalInputSignature)
    }

    @Test
    fun weeklyCalorieAdjustmentUses7700KcalPerKilogram() {
        assertEquals(-550, UserProfile(goal = WeightGoal.LOSE, weeklyChangeKg = 0.5).calorieAdjustment)
        assertEquals(550, UserProfile(goal = WeightGoal.GAIN, weeklyChangeKg = 0.5).calorieAdjustment)
    }
}
