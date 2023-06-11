package com.unla.agroecologiaiot.helpers;

import com.unla.agroecologiaiot.shared.paginated.especification.FilterRequest;
import com.unla.agroecologiaiot.shared.paginated.especification.FieldType;
import com.unla.agroecologiaiot.shared.paginated.especification.Operator;

public class FilterHelper {
    public static class Filter {

        public static FilterRequest AddFilterPropertyEqual(String key, Object value, FieldType fieldType) {
            FilterRequest filter = new FilterRequest();
            filter.setKey(key);
            filter.setOperator(Operator.EQUAL);
            filter.setValue(value);
            filter.setFieldType(fieldType);
            return filter;
        }

        public static FilterRequest AddFilterPropertyNotEqual(String key, Object value, FieldType fieldType) {
            FilterRequest filter = new FilterRequest();
            filter.setKey(key);
            filter.setOperator(Operator.NOT_EQUAL);
            filter.setValue(value);
            filter.setFieldType(fieldType);
            return filter;
        }

    }
}
