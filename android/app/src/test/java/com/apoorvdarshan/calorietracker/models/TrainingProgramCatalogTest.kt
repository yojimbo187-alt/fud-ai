package com.apoorvdarshan.calorietracker.models

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TrainingProgramCatalogTest {
    @Test
    fun priorityProgramMatchesApprovedPplulRoster() {
        assertEquals(listOf("push", "pull", "legs", "upper", "lower"), TrainingProgramCatalog.pplul.map { it.id })
        assertEquals(listOf(6, 6, 6, 7, 6), TrainingProgramCatalog.pplul.map { it.exercises.size })
        assertEquals("Smith-machine incline press", TrainingProgramCatalog.push.exercises.first().options.first().name.english)
        assertEquals("Machine shoulder press", TrainingProgramCatalog.push.exercises[1].options.first().name.english)
        assertEquals("Pendulum squat", TrainingProgramCatalog.lower.exercises.first().options.first().name.english)
        assertTrue(TrainingProgramCatalog.pplul.flatMap { it.exercises }.all { it.options.size == 5 })
    }

    @Test
    fun fourWeekWaveDeloadsAndResets() {
        assertEquals(listOf(3, 2, 1, 4, 3, 2, 1, 4), (1..8).map(TrainingProgramCatalog::targetRir))
        assertEquals(listOf(3, 3, 3, 2, 3, 3, 3, 2), (1..8).map(TrainingProgramCatalog::workingSets))
    }
}
