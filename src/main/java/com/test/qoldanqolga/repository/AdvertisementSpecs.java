package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.dto.ad.AdListParams;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.util.SellerStatusUtil;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class AdvertisementSpecs {

    private AdvertisementSpecs() {
    }

    public static Specification<Advertisement> withFilters(
            String status,
            List<String> categories,
            AdListParams params,
            String excludeAdId
    ) {
        return (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            AdListParams p = params != null ? params : new AdListParams();

            predicates.add(cb.equal(root.get("status"), status != null && !status.isBlank() ? status : "ACTIVE"));

            if (excludeAdId != null && !excludeAdId.isBlank()) {
                predicates.add(cb.notEqual(root.get("id"), excludeAdId));
            }

            if (categories != null && !categories.isEmpty()) {
                predicates.add(root.get("category").in(categories));
            } else if (p.getCategory() != null && !p.getCategory().isBlank()) {
                predicates.add(cb.equal(root.get("category"), p.getCategory()));
            }

            if (p.getRegion() != null && !p.getRegion().isBlank()) {
                predicates.add(cb.equal(root.get("region"), p.getRegion()));
            }

            if (p.getQuery() != null && !p.getQuery().isBlank()) {
                String pattern = "%" + p.getQuery().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (p.getSellerType() != null && !p.getSellerType().isEmpty()) {
                var userJoin = root.join("user", JoinType.LEFT);
                List<Predicate> sellerPredicates = new ArrayList<>();
                for (String st : p.getSellerType()) {
                    if (st == null || st.isBlank()) continue;
                    if (SellerStatusUtil.isStoreFilter(st)) {
                        sellerPredicates.add(cb.or(
                                cb.equal(userJoin.get("storeVerified"), true),
                                cb.equal(cb.upper(root.get("sellerType")), "BUSINESS"),
                                cb.equal(cb.upper(root.get("sellerType")), "STORE")
                        ));
                    } else if ("PRIVATE".equalsIgnoreCase(st.trim())) {
                        sellerPredicates.add(cb.and(
                                cb.or(
                                        cb.isNull(userJoin.get("storeVerified")),
                                        cb.equal(userJoin.get("storeVerified"), false)
                                ),
                                cb.or(
                                        cb.isNull(root.get("sellerType")),
                                        cb.equal(cb.upper(root.get("sellerType")), "PRIVATE")
                                )
                        ));
                    } else {
                        String normalized = SellerStatusUtil.normalize(st);
                        sellerPredicates.add(cb.equal(cb.upper(root.get("sellerType")), normalized));
                    }
                }
                if (!sellerPredicates.isEmpty()) {
                    predicates.add(cb.or(sellerPredicates.toArray(new Predicate[0])));
                }
            }

            if (p.getHasLicense() != null) {
                predicates.add(cb.equal(root.get("hasLicense"), p.getHasLicense()));
            }
            if (p.getWorksByContract() != null) {
                predicates.add(cb.equal(root.get("worksByContract"), p.getWorksByContract()));
            }
            if (p.getPriceFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), p.getPriceFrom()));
            }
            if (p.getPriceTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), p.getPriceTo()));
            }
            if (p.getCurrency() != null && !p.getCurrency().isBlank() && !"FROM_AD".equalsIgnoreCase(p.getCurrency())) {
                predicates.add(cb.equal(root.get("currency"), p.getCurrency()));
            }
            if (Boolean.TRUE.equals(p.getUrgentBargain())) {
                predicates.add(cb.equal(root.get("urgentBargain"), true));
            }
            if (Boolean.TRUE.equals(p.getCanDeliver())) {
                predicates.add(cb.equal(root.get("canDeliver"), true));
            }
            if (p.getGiveAway() != null) {
                predicates.add(cb.equal(root.get("giveAway"), p.getGiveAway()));
            }
            if (p.getBrandId() != null && !p.getBrandId().isBlank()) {
                predicates.add(cb.equal(root.get("brandId"), p.getBrandId()));
            }
            if (p.getModelId() != null && !p.getModelId().isBlank()) {
                predicates.add(cb.equal(root.get("modelId"), p.getModelId()));
            }
            if (p.getHandMadeOnly() != null) {
                if (p.getHandMadeOnly()) {
                    predicates.add(cb.equal(root.get("itemCondition"), "HANDMADE"));
                } else {
                    predicates.add(cb.notEqual(root.get("itemCondition"), "HANDMADE"));
                }
            } else if (p.getItemCondition() != null && !p.getItemCondition().isEmpty()) {
                predicates.add(root.get("itemCondition").in(p.getItemCondition()));
            }
            if (p.getCanRent() != null) {
                predicates.add(cb.equal(root.get("canRent"), p.getCanRent()));
            }
            if (p.getYearFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("year"), p.getYearFrom()));
            }
            if (p.getYearTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("year"), p.getYearTo()));
            }
            if (p.getMileageFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("mileage"), p.getMileageFrom()));
            }
            if (p.getMileageTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("mileage"), p.getMileageTo()));
            }
            if (p.getBodyType() != null && !p.getBodyType().isEmpty()) {
                predicates.add(root.get("bodyType").in(p.getBodyType()));
            }
            if (p.getTransmission() != null && !p.getTransmission().isEmpty()) {
                predicates.add(root.get("transmission").in(p.getTransmission()));
            }
            if (p.getFuelType() != null && !p.getFuelType().isEmpty()) {
                predicates.add(root.get("fuelType").in(p.getFuelType()));
            }
            if (p.getDriveType() != null && !p.getDriveType().isEmpty()) {
                predicates.add(root.get("driveType").in(p.getDriveType()));
            }
            if (p.getEngineVolumeFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("engineVolume"), p.getEngineVolumeFrom()));
            }
            if (p.getEngineVolumeTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("engineVolume"), p.getEngineVolumeTo()));
            }
            if (p.getExteriorColor() != null && !p.getExteriorColor().isEmpty()) {
                predicates.add(root.get("exteriorColor").in(p.getExteriorColor()));
            }
            if (p.getSteering() != null && !p.getSteering().isEmpty()) {
                predicates.add(root.get("steering").in(p.getSteering()));
            }
            if (p.getSeats() != null && !p.getSeats().isEmpty()) {
                List<Predicate> seatPreds = new ArrayList<>();
                for (String seat : p.getSeats()) {
                    if (seat == null || seat.isBlank()) continue;
                    if ("8PLUS".equalsIgnoreCase(seat) || "8+".equals(seat)) {
                        seatPreds.add(cb.greaterThanOrEqualTo(root.get("seats"), 8));
                    } else {
                        try {
                            seatPreds.add(cb.equal(root.get("seats"), Integer.parseInt(seat.trim())));
                        } catch (NumberFormatException ignored) {
                        }
                    }
                }
                if (!seatPreds.isEmpty()) {
                    predicates.add(cb.or(seatPreds.toArray(new Predicate[0])));
                }
            }
            if (p.getOwnersCount() != null && !p.getOwnersCount().isEmpty()) {
                List<Predicate> ownerPreds = new ArrayList<>();
                for (String owners : p.getOwnersCount()) {
                    if (owners == null || owners.isBlank()) continue;
                    if ("4PLUS".equalsIgnoreCase(owners) || "4+".equals(owners)) {
                        ownerPreds.add(cb.greaterThanOrEqualTo(root.get("ownersCount"), 4));
                    } else {
                        try {
                            ownerPreds.add(cb.equal(root.get("ownersCount"), Integer.parseInt(owners.trim())));
                        } catch (NumberFormatException ignored) {
                        }
                    }
                }
                if (!ownerPreds.isEmpty()) {
                    predicates.add(cb.or(ownerPreds.toArray(new Predicate[0])));
                }
            }
            if (p.getDistrict() != null && !p.getDistrict().isBlank()) {
                predicates.add(cb.equal(root.get("district"), p.getDistrict()));
            }
            if (p.getDealType() != null && !p.getDealType().isEmpty()) {
                predicates.add(root.get("dealType").in(p.getDealType()));
            }
            if (p.getRooms() != null && !p.getRooms().isEmpty()) {
                List<Predicate> roomPreds = new ArrayList<>();
                for (String room : p.getRooms()) {
                    if (room == null || room.isBlank()) continue;
                    if ("5PLUS".equalsIgnoreCase(room) || "5+".equals(room)) {
                        roomPreds.add(cb.greaterThanOrEqualTo(root.get("rooms"), 5));
                    } else {
                        try {
                            roomPreds.add(cb.equal(root.get("rooms"), Integer.parseInt(room.trim())));
                        } catch (NumberFormatException ignored) {
                            // skip invalid
                        }
                    }
                }
                if (!roomPreds.isEmpty()) {
                    predicates.add(cb.or(roomPreds.toArray(new Predicate[0])));
                }
            }
            if (p.getAreaFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("areaM2"), p.getAreaFrom()));
            }
            if (p.getAreaTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("areaM2"), p.getAreaTo()));
            }
            if (p.getLandAreaFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("landAreaM2"), p.getLandAreaFrom()));
            }
            if (p.getLandAreaTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("landAreaM2"), p.getLandAreaTo()));
            }
            if (p.getFloorFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("floor"), p.getFloorFrom()));
            }
            if (p.getFloorTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("floor"), p.getFloorTo()));
            }
            if (p.getBuildingType() != null && !p.getBuildingType().isEmpty()) {
                predicates.add(root.get("buildingType").in(p.getBuildingType()));
            }
            if (p.getRenovation() != null && !p.getRenovation().isEmpty()) {
                predicates.add(root.get("renovation").in(p.getRenovation()));
            }
            if (p.getFurnished() != null) {
                predicates.add(cb.equal(root.get("furnished"), p.getFurnished()));
            }
            if (p.getJobProfession() != null && !p.getJobProfession().isEmpty()) {
                predicates.add(root.get("jobProfession").in(p.getJobProfession()));
            }
            if (p.getJobIndustry() != null && !p.getJobIndustry().isEmpty()) {
                predicates.add(cb.or(
                        root.get("jobIndustry").in(p.getJobIndustry()),
                        root.get("category").in(p.getJobIndustry())
                ));
            }
            if (p.getJobPriority() != null && !p.getJobPriority().isBlank()
                    && !"ANY".equalsIgnoreCase(p.getJobPriority())) {
                predicates.add(cb.equal(root.get("jobPriority"), p.getJobPriority()));
            }
            addCsvAny(predicates, cb, root.get("jobEmployment"), p.getJobEmployment());
            addCsvAny(predicates, cb, root.get("jobSchedule"), p.getJobSchedule());
            if (p.getJobWorkFormat() != null && !p.getJobWorkFormat().isBlank()
                    && !"ANY".equalsIgnoreCase(p.getJobWorkFormat())) {
                predicates.add(cb.equal(root.get("jobWorkFormat"), p.getJobWorkFormat()));
            }
            if (p.getJobSalaryPeriod() != null && !p.getJobSalaryPeriod().isBlank()
                    && !"ANY".equalsIgnoreCase(p.getJobSalaryPeriod())) {
                predicates.add(cb.equal(root.get("jobSalaryPeriod"), p.getJobSalaryPeriod()));
            }
            addCsvAny(predicates, cb, root.get("jobPayFrequency"), p.getJobPayFrequency());
            if (p.getJobExperience() != null && !p.getJobExperience().isBlank()) {
                predicates.add(cb.equal(root.get("jobExperience"), p.getJobExperience()));
            }
            if (p.getJobCitizenship() != null && !p.getJobCitizenship().isBlank()) {
                predicates.add(cb.equal(root.get("jobCitizenship"), p.getJobCitizenship()));
            }
            if (p.getJobAgeFrom() != null) {
                predicates.add(cb.or(
                        cb.isNull(root.get("jobAgeTo")),
                        cb.greaterThanOrEqualTo(root.get("jobAgeTo"), p.getJobAgeFrom())
                ));
            }
            if (p.getJobAgeTo() != null) {
                predicates.add(cb.or(
                        cb.isNull(root.get("jobAgeFrom")),
                        cb.lessThanOrEqualTo(root.get("jobAgeFrom"), p.getJobAgeTo())
                ));
            }
            if (Boolean.TRUE.equals(p.getJobCompanyVerified())) {
                predicates.add(cb.equal(root.get("jobCompanyVerified"), true));
            }
            if (Boolean.TRUE.equals(p.getJobLargeCompany())) {
                predicates.add(cb.equal(root.get("jobLargeCompany"), true));
            }
            addCsvAny(predicates, cb, root.get("jobBenefits"), p.getJobBenefits());
            addCsvAny(predicates, cb, root.get("jobForCandidates"), p.getJobForCandidates());

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void addCsvAny(
            List<Predicate> predicates,
            jakarta.persistence.criteria.CriteriaBuilder cb,
            jakarta.persistence.criteria.Path<String> path,
            List<String> codes
    ) {
        if (codes == null || codes.isEmpty()) {
            return;
        }
        List<Predicate> or = new ArrayList<>();
        for (String code : codes) {
            if (code == null || code.isBlank()) {
                continue;
            }
            or.add(cb.like(path, com.test.qoldanqolga.util.CsvListUtil.likeToken(code)));
        }
        if (!or.isEmpty()) {
            predicates.add(cb.or(or.toArray(new Predicate[0])));
        }
    }
}
