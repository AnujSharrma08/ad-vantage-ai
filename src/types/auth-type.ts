export interface loginPayload {
    email: string;
}

export interface OtpPayload {
    email: string;
    otp: string;
}

export interface signUpPayload {
    name: string;
    email: string;
}

export interface OtpResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    quota: {
        total_allowed: number;
        used_requests: number;
        remaining: number;
    }
}