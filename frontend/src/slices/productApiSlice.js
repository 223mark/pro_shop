import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

/* What is injextEndpoints() method ?
# we are injecting api endpoints into this apiSlice
*/
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL
            }),
            keepUnusedDataFor:5
        }),
         getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`
            }),
            keepUnusedDataFor:5
        }),
    })
});

export const { useGetProductsQuery , useGetProductDetailsQuery} = productsApiSlice;