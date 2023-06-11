package com.unla.agroecologiaiot.helpers;

import com.google.gson.Gson;

public class JsonParse {

    private static Gson gson = new Gson();

    public static class JsonParser {

        public static String toJson(Object obj) {
            return gson.toJson(obj);
        }

        public static Object fromJson(String json, Class<Object> typeOf){
            return gson.fromJson(json, typeOf);
        }
    }

}
