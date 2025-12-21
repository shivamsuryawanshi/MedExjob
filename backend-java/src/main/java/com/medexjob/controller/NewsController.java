package com.medexjob.controller;

import com.medexjob.entity.NewsUpdate;
import com.medexjob.repository.NewsUpdateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsUpdateRepository newsUpdateRepository;

    public NewsController(NewsUpdateRepository newsUpdateRepository) {
        this.newsUpdateRepository = newsUpdateRepository;
    }

    @PostConstruct
    public void seedData() {
        if (newsUpdateRepository.count() > 0) return;

        List<NewsUpdate> samples = Arrays.asList(
                new NewsUpdate("AIIMS Delhi opens senior resident positions in critical care", NewsUpdate.NewsType.GOVT, LocalDate.now().plusDays(5), true),
                new NewsUpdate("Fortis Bangalore hiring ICU nursing staff (night shift allowance)", NewsUpdate.NewsType.PRIVATE, LocalDate.now().plusDays(3), false),
                new NewsUpdate("NEET PG 2026 tentative schedule released", NewsUpdate.NewsType.EXAM, LocalDate.now().plusDays(12), true),
                new NewsUpdate("Rajasthan Health Services extends MO application deadline", NewsUpdate.NewsType.DEADLINE, LocalDate.now().plusDays(2), true),
                new NewsUpdate("Apollo Hospitals starts cardiology fellowship intake", NewsUpdate.NewsType.UPDATE, LocalDate.now().plusDays(7), false),
                new NewsUpdate("UP NHM announces 150 paramedical vacancies", NewsUpdate.NewsType.GOVT, LocalDate.now().plusDays(9), false),
                new NewsUpdate("Private multispecialty chain hiring 40 junior residents", NewsUpdate.NewsType.PRIVATE, LocalDate.now().plusDays(4), false),
                new NewsUpdate("AIIMS Rishikesh releases walk-in interview dates", NewsUpdate.NewsType.GOVT, LocalDate.now().plusDays(6), false),
                new NewsUpdate("JIPMER issues notice on document verification", NewsUpdate.NewsType.DEADLINE, LocalDate.now().plusDays(1), true),
                new NewsUpdate("NBEMS publishes exam city allocation FAQ", NewsUpdate.NewsType.EXAM, LocalDate.now().plusDays(8), false)
        );

        newsUpdateRepository.saveAll(samples);
    }

    @GetMapping("/pulse")
    public ResponseEntity<List<NewsUpdate>> getPulseUpdates() {
        List<NewsUpdate> updates = newsUpdateRepository.findTop10ByOrderByDateDescCreatedAtDesc();
        return ResponseEntity.ok(updates);
    }
}
