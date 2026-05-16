package com.mediconnect.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class PdfService {

    public String extractTextFromPdf(MultipartFile file) {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text = stripper.getText(document);

            log.info("Extracted {} characters from PDF",
                    text.length());

            if (text.length() > 5000) {
                text = text.substring(0, 5000)
                        + "... [truncated]";
            }

            return text;

        } catch (Exception e) {

            log.error("Failed to extract PDF text: {}",
                    e.getMessage());

            throw new RuntimeException(
                    "Could not read PDF file."
            );
        }
    }
}