
export const errorCodes = {
   400: "Bad Request",
   401: "Unauthorized",
   402: "Payment Required",
   403: "Forbidden",
   404: "Not Found",
   405: "Method Not Allowed",
   406: "Not Acceptable",
   407: "Proxy Authentication Required",
   408: "Request Timeout"
}

const successCodes = {
   200: "OK",
   201: "Created",
   202: "Accepted",
   203: "Non-Authoritative Information",
   204: "No Content",
   205: "Reset Content",
   206: "Partial Content",
   207: "Multi-Status",
   208: "Already Reported",
   
}

const StatusCode = {
   ...errorCodes,
   ...successCodes
}

export type SuccessStatusCodeType = typeof successCodes
export type ErrorStatusCodeType = typeof errorCodes
export type StatusCodeType = typeof StatusCode

export default StatusCode