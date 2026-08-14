package com.test.qoldanqolga.dto.reference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleSpecOptionsDto {
    @Builder.Default
    private List<VehicleSpecOptionDto> bodyType = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> transmission = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> fuelType = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> driveType = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> exteriorColor = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> seats = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> steering = new ArrayList<>();
    @Builder.Default
    private List<VehicleSpecOptionDto> ownersCount = new ArrayList<>();
}
