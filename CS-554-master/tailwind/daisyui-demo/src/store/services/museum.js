import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://collectionapi.metmuseum.org/public/collection/v1/";
const pageSize = 50;

export const museumAPI = createApi({
  reducerPath: "museumAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints: (builder) => ({
    /**
     * Get all objects by department ID (department ID is optional)
     */
    getObjects: builder.query({
      query: ({ departmentIds }) => {
        if (!departmentIds) return "objects";
        return `objects?departmentIds=${departmentIds}`;
      },
      async transformResponse(response, meta, args) {
        const objectIDs = response.objectIDs ?? [];
        let _objectIDs = objectIDs.sort((x, y) => x - y);
        _objectIDs = _objectIDs.slice(
          pageSize * (args.page - 1),
          pageSize * args.page,
        );

        const objects = await Promise.all(
          _objectIDs.map((id) => {
            const response = fetch(`${baseUrl}objects/${id}`).then((res) =>
              res.json(),
            );
            return response;
          }),
        );

        return { objects, pages: Math.ceil(objectIDs.length / pageSize) };
      },
    }),
    /**
     * Get object by object's ID
     */
    getObjectById: builder.query({
      query: ({ id }) => `objects/${id}`,
    }),
    /**
     * Get all departments
     */
    getDepartments: builder.query({
      query: () => "departments",
    }),
    /**
     * Search objects by query
     */
    searchObjects: builder.query({
      query: ({ query }) => `search?q=${query}`,
      async transformResponse(response, meta, args) {
        const objectIDs = response.objectIDs ?? [];

        let _objectIDs = objectIDs.sort((x, y) => x - y);
        _objectIDs = _objectIDs.slice(
          pageSize * (args.page - 1),
          pageSize * args.page,
        );

        const objects = await Promise.all(
          _objectIDs.map((id) => {
            const response = fetch(`${baseUrl}objects/${id}`).then((res) =>
              res.json(),
            );
            return response;
          }),
        );

        return { objects, pages: Math.ceil(objectIDs.length / pageSize) };
      },
    }),
  }),
});

export const {
  useGetObjectsQuery,
  useGetObjectByIdQuery,
  useGetDepartmentsQuery,
  useSearchObjectsQuery,
} = museumAPI;
