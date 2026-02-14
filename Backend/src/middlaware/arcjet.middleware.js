import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    message: "❌ Rate limit exceeded: Please try again"
                });
            } 
            else if (decision.reason.isBot()) {
                return res.status(403).json({
                    message: "❌ Bot access Denied"
                });
            } 
            else {
                return res.status(403).json({
                    message: "❌ Access denied by security policy"
                });
            }
        }

        // Extra bot inspection
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected.",
            });
        }

        // ✅ If everything is fine → move to next middleware
        next();

    } catch (error) {
        console.log("Arcjet protection error", error);
        return res.status(500).json({ message: "Internal security error" });
    }
};
