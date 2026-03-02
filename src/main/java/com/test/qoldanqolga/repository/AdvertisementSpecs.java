package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Advertisement;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.JoinType;
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
            List<String> sellerType,
            Boolean hasLicense,
            Boolean worksByContract,
            BigDecimal priceFrom,
            BigDecimal priceTo,
            String currency,
            Boolean urgentBargain,
            Boolean canDeliver,
            Boolean giveAway,
            String brandId,
            List<String> itemCondition,
            Boolean handMadeOnly,
            Boolean canRent
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

            if (sellerType != null && !sellerType.isEmpty()) {
                var userJoin = root.join("user", JoinType.LEFT);
                List<Predicate> sellerPredicates = new ArrayList<>();
                for (String st : sellerType) {
                    if (st == null || st.isBlank()) continue;
                    if ("BUSINESS".equalsIgnoreCase(st)) {
                        sellerPredicates.add(cb.equal(userJoin.get("storeVerified"), true));
                    } else if ("PRIVATE".equalsIgnoreCase(st)) {
                        sellerPredicates.add(cb.or(
                                cb.isNull(userJoin.get("storeVerified")),
                                cb.equal(userJoin.get("storeVerified"), false)
                        ));
                    } else {
                        sellerPredicates.add(cb.equal(root.get("sellerType"), st));
                    }
                }
                if (!sellerPredicates.isEmpty()) {
                    predicates.add(cb.or(sellerPredicates.toArray(new Predicate[0])));
                }
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

            if (brandId != null && !brandId.isBlank()) {
                predicates.add(cb.equal(root.get("brandId"), brandId));
            }

            if (handMadeOnly != null) {
                if (handMadeOnly) {
                    predicates.add(cb.equal(root.get("itemCondition"), "HANDMADE"));
                } else {
                    predicates.add(cb.notEqual(root.get("itemCondition"), "HANDMADE"));
                }
            } else if (itemCondition != null && !itemCondition.isEmpty()) {
                predicates.add(root.get("itemCondition").in(itemCondition));
            }

            if (canRent != null) {
                predicates.add(cb.equal(root.get("canRent"), canRent));
            }

            q.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
