const ENDPOINT = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";

export const checkToxicContent = async (text: string): Promise<boolean> => {
    // Read directly from process.env each time to ensure freshness
    const apiKey = process.env.REACT_APP_PERSPECTIVE_API_KEY;

    if (!apiKey) {
        console.error("❌ Chưa có Perspective API Key.");
        return false;
    }

    try {
        const response = await fetch(
            `${ENDPOINT}?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: { text },
                    // Auto-detect language
                    requestedAttributes: {
                        TOXICITY: {},
                    },
                }),
            }
        );

        if (!response.ok) {
            console.error("❌ Perspective API Error Response:", response.status);
            return false;
        }

        const data = await response.json();
        const score = data.attributeScores?.TOXICITY?.summaryScore?.value ?? 0;

        if (score > 0.7) {
            return true;
        }

        return false; // Safe

    } catch (error) {
        console.error("❌ Exception calling Perspective API");
        return false;
    }
};
