package com.test.qoldanqolga.cache;

import com.test.qoldanqolga.dto.ad.AdListParams;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public final class AdListCacheKeys {

    private AdListCacheKeys() {
    }

    public static String of(AdListParams params, Pageable pageable) {
        AdListParams p = params != null ? params : new AdListParams();
        return String.join("|",
                nz(p.getStatus()),
                nz(p.getCategory()),
                nz(p.getRegion()),
                nz(p.getQuery()),
                join(p.getSellerType()),
                bool(p.getHasLicense()),
                bool(p.getWorksByContract()),
                num(p.getPriceFrom()),
                num(p.getPriceTo()),
                nz(p.getCurrency()),
                bool(p.getUrgentBargain()),
                bool(p.getCanDeliver()),
                bool(p.getGiveAway()),
                nz(p.getBrandId()),
                join(p.getItemCondition()),
                bool(p.getHandMadeOnly()),
                bool(p.getCanRent()),
                nz(p.getModelId()),
                num(p.getYearFrom()),
                num(p.getYearTo()),
                num(p.getMileageFrom()),
                num(p.getMileageTo()),
                join(p.getBodyType()),
                join(p.getTransmission()),
                join(p.getFuelType()),
                join(p.getDriveType()),
                num(p.getEngineVolumeFrom()),
                num(p.getEngineVolumeTo()),
                join(p.getExteriorColor()),
                join(p.getSeats()),
                join(p.getSteering()),
                join(p.getOwnersCount()),
                nz(p.getDistrict()),
                join(p.getDealType()),
                join(p.getRooms()),
                num(p.getAreaFrom()),
                num(p.getAreaTo()),
                num(p.getLandAreaFrom()),
                num(p.getLandAreaTo()),
                num(p.getFloorFrom()),
                num(p.getFloorTo()),
                join(p.getBuildingType()),
                join(p.getRenovation()),
                bool(p.getFurnished()),
                String.valueOf(pageable.getPageNumber()),
                String.valueOf(pageable.getPageSize()),
                sortKey(pageable.getSort())
        );
    }

    private static String sortKey(Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return "";
        }
        return StreamSupport.stream(sort.spliterator(), false)
                .map(order -> order.getProperty() + ":" + order.getDirection())
                .sorted()
                .collect(Collectors.joining(","));
    }

    private static String join(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return "";
        }
        return values.stream().map(AdListCacheKeys::nz).sorted().collect(Collectors.joining(","));
    }

    private static String nz(String value) {
        return value == null ? "" : value;
    }

    private static String bool(Boolean value) {
        return value == null ? "" : value.toString();
    }

    private static String num(Object value) {
        return value == null ? "" : value.toString();
    }
}
