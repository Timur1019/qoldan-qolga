package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Advertisement;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class AdvertisementSpecs {

    public static Specification<Advertisement> withFilters(
            String status,
            String category,
            List<String> categories,
            String region,
            String query,
            String sellerType,
            Boolean hasLicense,
            Boolean worksByContract,
            BigDecimal priceFrom,
            BigDecimal priceTo,
            String currency,
            Boolean urgentBargain,
            Boolean canDeliver,
            Boolean giveAway
    ) {
        return (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), status != null && !status.isBlank() ? status : "ACTIVE"));

            if (categories != null && !categories.isEmpty()) {
                predicates.add(root.get("category").in(categories));
            } else if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (region != null && !region.isBlank()) {
                predicates.add(cb.equal(root.get("region"), region));
            }

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (sellerType != null && !sellerType.isBlank()) {
                predicates.add(cb.equal(root.get("sellerType"), sellerType));
            }

            if (hasLicense != null) {
                predicates.add(cb.equal(root.get("hasLicense"), hasLicense));
            }

            if (worksByContract != null) {
                predicates.add(cb.equal(root.get("worksByContract"), worksByContract));
            }

            if (priceFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), priceFrom));
            }

            if (priceTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), priceTo));
            }

            if (currency != null && !currency.isBlank() && !"FROM_AD".equalsIgnoreCase(currency)) {
                predicates.add(cb.equal(root.get("currency"), currency));
            }

            if (urgentBargain != null && urgentBargain) {
                predicates.add(cb.equal(root.get("urgentBargain"), true));
            }

            if (canDeliver != null && canDeliver) {
                predicates.add(cb.equal(root.get("canDeliver"), true));
            }

            if (giveAway != null && giveAway) {
                predicates.add(cb.equal(root.get("giveAway"), true));
            }

            q.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
