package com.example.be.controller;

import com.example.be.dto.Mesh;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AutodeskController {
    @GetMapping("/mesh")
    public ResponseEntity<?> getItems() throws Exception {
        List<Mesh> meshList = new ArrayList<>();
        meshList.add(new Mesh("9", "#4db733"));
        meshList.add(new Mesh("18", "#b79533"));
        return ResponseEntity.ok(meshList);
    }
}
