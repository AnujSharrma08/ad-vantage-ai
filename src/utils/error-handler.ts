// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (error: any, funName = "") => {
    let _error;
    if (error.response)
        _error =
            error.response.data.message ||
            error.response.data.err ||
            error.response.data.error ||
            error.response.data ||
            "Response error";
    else if (error.request) _error = error?.request || "Request error";
    else if (typeof error === "string") _error = error;
    else if (error?.errorMsg) _error = error?.errorMsg;
    else _error = "Something went wrong please try again later";
    console.log(error, `error in ${ funName }`);

    return _error;
};