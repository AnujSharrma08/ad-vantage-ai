import { errorHandler } from "@/src/utils/error-handler";
import { ProcessAudit } from "@/src/types/audit-type";
import { APIKEY } from "@/src/services/api-key";
import axiosInstance from "@/src/services/config";

export const fetchS3ImageUrl = async (fileName: string, contentType: string) => {
    try {
        const res = await axiosInstance.get(`${APIKEY.getS3ImageUrl}?file_name=${fileName}&content_type=${contentType}`);
        return res.data;
    } catch (err) {
        throw errorHandler(err, "fetchS3ImageUrl");
    }
};

export const processAudit = async (auditData: ProcessAudit) => {
    try {
        const res = await axiosInstance.post(`${APIKEY.audit}`, auditData);
        return res.data;
    } catch (err) {
        throw errorHandler(err, "processAudit");
    }
};

export const fetchAuditHistory = async (userId: string, page: number, size: number) => {
    try {
        const res = await axiosInstance.get(`${APIKEY.auditHistory}?user_id=${userId}&page=${page}&limit=${size}`);
        return res.data;
    } catch (err) {
        throw errorHandler(err, "fetchAuditHistory");
    }
};

export const fetchAuditById = async (auditId: string) => {
    try {
        const res = await axiosInstance.get(`${APIKEY.getAuditById}${auditId}`);
        return res.data;
    } catch (err) {
        throw errorHandler(err, "fetchAuditById");
    }
};
