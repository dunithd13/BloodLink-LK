namespace BloodLinkLK.API.Services;

public static class BloodCompatibilityService
{
    private static readonly Dictionary<string, string[]> CompatibleDonors =
        new()
        {
            ["O-"] = ["O-"],

            ["O+"] = ["O-", "O+"],

            ["A-"] = ["O-", "A-"],

            ["A+"] = ["O-", "O+", "A-", "A+"],

            ["B-"] = ["O-", "B-"],

            ["B+"] = ["O-", "O+", "B-", "B+"],

            ["AB-"] = ["O-", "A-", "B-", "AB-"],

            ["AB+"] =
            [
                "O-", "O+",
                "A-", "A+",
                "B-", "B+",
                "AB-", "AB+"
            ]
        };

    public static string[] GetCompatibleDonorGroups(
        string recipientBloodGroup)
    {
        return CompatibleDonors.TryGetValue(
            recipientBloodGroup,
            out var groups)
                ? groups
                : [];
    }
}